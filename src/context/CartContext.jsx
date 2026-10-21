/**
 * CONTEXTO DEL CARRITO DE COMPRAS (src/context/CartContext.jsx)
 * 
 * Implementa la lógica de compra migrada de legacy/js/carrito.js:
 * - Persistencia en localStorage ('carrito_mil_sabores')
 * - Soporte para personalizaciones y tamaños
 * - Cálculo de Subtotal, Descuentos (Senior 50%, Cupones), Envío ($3.500) e IVA
 * - Sincronización automática con beneficios de AuthContext
 */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);
const STORAGE_KEY_CARRITO = 'carrito_mil_sabores';
const COSTO_ENVIO_ESTANDAR = 3500;

export function CartProvider({ children }) {
  const { usuario, isSenior } = useAuth();

  const [carrito, setCarrito] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CARRITO);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [cupon, setCupon] = useState(null); // { codigo: 'FELICES50', porcentaje: 10, motivo: '...' }

  // Persistir en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARRITO, JSON.stringify(carrito));
    } catch (e) {
      console.error('Error al guardar carrito en localStorage:', e);
    }
  }, [carrito]);

  // Agregar producto al carrito
  const agregarAlCarrito = (item) => {
    const cantidad = Number(item.cantidad) || 1;
    const personalizacion = item.personalizacion || 'Estándar';

    setCarrito((actuales) => {
      const copia = [...actuales];
      const indexExistente = copia.findIndex(
        (p) => p.codigo === item.codigo && (p.personalizacion || 'Estándar') === personalizacion
      );

      if (indexExistente >= 0) {
        copia[indexExistente] = {
          ...copia[indexExistente],
          cantidad: copia[indexExistente].cantidad + cantidad
        };
      } else {
        copia.push({
          codigo: item.codigo,
          nombre: item.nombre,
          precio: Number(item.precio),
          cantidad: cantidad,
          personalizacion: personalizacion,
          imagen: item.imagen || '/img/producto_TE001.avif'
        });
      }
      return copia;
    });
  };

  // Actualizar cantidad de un ítem por índice
  const actualizarCantidad = (indice, nuevaCantidad) => {
    setCarrito((actuales) => {
      if (nuevaCantidad <= 0) {
        return actuales.filter((_, i) => i !== indice);
      }
      const copia = [...actuales];
      copia[indice] = { ...copia[indice], cantidad: nuevaCantidad };
      return copia;
    });
  };

  // Eliminar un ítem por índice
  const eliminarDelCarrito = (indice) => {
    setCarrito((actuales) => actuales.filter((_, i) => i !== indice));
  };

  // Vaciar completamente el carrito
  const limpiarCarrito = () => {
    setCarrito([]);
    setCupon(null);
  };

  // Aplicar cupón de descuento
  const aplicarCupon = (codigoRaw) => {
    const codigo = (codigoRaw || '').trim().toUpperCase();
    if (!codigo) {
      return { success: false, mensaje: 'Por favor introduce un código de descuento.' };
    }

    if (codigo === 'FELICES50') {
      const nuevo = { codigo: 'FELICES50', porcentaje: 10, motivo: 'Descuento FELICES50 (10% de por vida)' };
      setCupon(nuevo);
      if (isSenior) {
        return { success: true, mensaje: '✓ Cupón FELICES50 reconocido, pero tu beneficio Senior (50%) es mayor. ¡Se mantiene tu mejor beneficio!' };
      }
      return { success: true, mensaje: '✓ Código FELICES50 aplicado: 10% de descuento.' };
    }

    if (codigo === 'DUOCUMPLE') {
      const nuevo = { codigo: 'DUOCUMPLE', porcentaje: 20, motivo: 'Convenio Cumpleaños Duoc UC (20%)' };
      setCupon(nuevo);
      if (isSenior) {
        return { success: true, mensaje: '✓ Cupón DUOCUMPLE reconocido, pero tu beneficio Senior (50%) es mayor. ¡Se mantiene tu mejor beneficio!' };
      }
      return { success: true, mensaje: '✓ Descuento Duoc UC del 20% aplicado con éxito.' };
    }

    return { success: false, mensaje: '✗ Código inválido. Puedes probar con FELICES50 o DUOCUMPLE.' };
  };

  // Cálculos reactivos de montos y totales
  const calculos = useMemo(() => {
    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    let porcentajeDescuento = 0;
    let motivoDescuento = '';

    if (isSenior) {
      porcentajeDescuento = 50;
      motivoDescuento = `Beneficio Senior (+50 años): 50%`;
    } else if (cupon) {
      porcentajeDescuento = cupon.porcentaje;
      motivoDescuento = cupon.motivo;
    }

    const descuentoMonto = Math.round(subtotal * (porcentajeDescuento / 100));
    const costoEnvio = subtotal > 0 ? COSTO_ENVIO_ESTANDAR : 0;
    const baseImponible = Math.max(0, subtotal - descuentoMonto);
    const iva = Math.round(baseImponible * 0.19);
    const total = baseImponible + costoEnvio;

    return {
      subtotal,
      totalItems,
      porcentajeDescuento,
      motivoDescuento,
      descuentoMonto,
      costoEnvio,
      iva,
      total
    };
  }, [carrito, isSenior, cupon]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        cupon,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        limpiarCarrito,
        aplicarCupon,
        ...calculos
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCarrito debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
