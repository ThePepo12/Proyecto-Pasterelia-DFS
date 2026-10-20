package cl.duoc.tienda_pasteleria_backend.config;

import cl.duoc.tienda_pasteleria_backend.model.*;
import cl.duoc.tienda_pasteleria_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) return;

        // 1. Categorías
        Categoria catCuadradas = categoriaRepository.save(Categoria.builder()
                .nombre("Tortas Cuadradas")
                .descripcion("Bizcochos húmedos y rellenos artesanales en presentación cuadrada.")
                .imagen("/img/producto_TC001.avif")
                .build());

        Categoria catCirculares = categoriaRepository.save(Categoria.builder()
                .nombre("Tortas Circulares")
                .descripcion("El formato tradicional para cumpleaños y reuniones familiares.")
                .imagen("/img/producto_TT001.avif")
                .build());

        Categoria catPostres = categoriaRepository.save(Categoria.builder()
                .nombre("Postres Individuales")
                .descripcion("Deliciosas porciones personales para deleitar en cualquier momento.")
                .imagen("/img/producto_PI001.jpg")
                .build());

        Categoria catSinAzucar = categoriaRepository.save(Categoria.builder()
                .nombre("Productos Sin Azúcar")
                .descripcion("Endulzados con ingredientes naturales para disfrutar sin culpa.")
                .imagen("/img/producto_PSA001.avif")
                .build());

        Categoria catTradicional = categoriaRepository.save(Categoria.builder()
                .nombre("Pastelería Tradicional")
                .descripcion("Recetas clásicas chilenas e internacionales con 50 años de historia.")
                .imagen("/img/producto_PT001.avif")
                .build());

        Categoria catSinGluten = categoriaRepository.save(Categoria.builder()
                .nombre("Productos Sin Gluten")
                .descripcion("Preparaciones certificadas libres de gluten para personas celíacas.")
                .imagen("/img/producto_PSG001.avif")
                .build());

        Categoria catVeganos = categoriaRepository.save(Categoria.builder()
                .nombre("Productos Veganos")
                .descripcion("100% libres de ingredientes de origen animal con sabor incomparable.")
                .imagen("/img/producto_PV001.avif")
                .build());

        Categoria catEspeciales = categoriaRepository.save(Categoria.builder()
                .nombre("Tortas Especiales")
                .descripcion("Creaciones exclusivas de autor para matrimonios y eventos únicos.")
                .imagen("/img/producto_TE001.avif")
                .build());

        // 2. Productos
        List<Producto> productos = Arrays.asList(
                Producto.builder()
                        .codigo("TC001")
                        .categoria(catCuadradas)
                        .nombre("Torta Cuadrada de Chocolate")
                        .precio(45000)
                        .stock(3) // Producto Crítico (<= 5)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Deliciosa torta de chocolate con capas de ganache y un toque de avellanas.")
                        .imagen("/img/producto_TC001.avif")
                        .build(),
                Producto.builder()
                        .codigo("TC002")
                        .categoria(catCuadradas)
                        .nombre("Torta Cuadrada de Frutas")
                        .precio(50000)
                        .stock(12)
                        .stockCritico(5)
                        .enOferta(true) // En Oferta
                        .porcentajeDescuento(15)
                        .descripcion("Mezcla de frutas frescas de la estación y crema chantilly sobre bizcocho de vainilla.")
                        .imagen("/img/producto_TC002.avif")
                        .build(),
                Producto.builder()
                        .codigo("TT001")
                        .categoria(catCirculares)
                        .nombre("Torta Circular de Vainilla")
                        .precio(40000)
                        .stock(15)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Bizcocho de vainilla clásico relleno con crema pastelera y glaseado dulce tradicional.")
                        .imagen("/img/producto_TT001.avif")
                        .build(),
                Producto.builder()
                        .codigo("TT002")
                        .categoria(catCirculares)
                        .nombre("Torta Circular de Manjar")
                        .precio(42000)
                        .stock(8)
                        .stockCritico(5)
                        .enOferta(true) // En Oferta
                        .porcentajeDescuento(10)
                        .descripcion("Torta tradicional chilena con manjar artesanal y nueces seleccionadas.")
                        .imagen("/img/producto_TT002.avif")
                        .build(),
                Producto.builder()
                        .codigo("PI001")
                        .categoria(catPostres)
                        .nombre("Mousse de Chocolate")
                        .precio(5000)
                        .stock(20)
                        .stockCritico(5)
                        .enOferta(true) // En Oferta
                        .porcentajeDescuento(20)
                        .descripcion("Postre individual cremoso y suave, hecho con chocolate de alta calidad.")
                        .imagen("/img/producto_PI001.jpg")
                        .build(),
                Producto.builder()
                        .codigo("PI002")
                        .categoria(catPostres)
                        .nombre("Tiramisú Clásico")
                        .precio(5500)
                        .stock(14)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Postre italiano con capas de café, queso mascarpone y cacao en polvo fino.")
                        .imagen("/img/producto_PI002.avif")
                        .build(),
                Producto.builder()
                        .codigo("PSA001")
                        .categoria(catSinAzucar)
                        .nombre("Torta Sin Azúcar de Naranja")
                        .precio(48000)
                        .stock(2) // Producto Crítico (<= 5)
                        .stockCritico(5)
                        .enOferta(true) // En Oferta
                        .porcentajeDescuento(10)
                        .descripcion("Torta ligera y deliciosa, endulzada naturalmente con cítricos frescos.")
                        .imagen("/img/producto_PSA001.avif")
                        .build(),
                Producto.builder()
                        .codigo("PSA002")
                        .categoria(catSinAzucar)
                        .nombre("Cheesecake Sin Azúcar")
                        .precio(47000)
                        .stock(9)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Suave y cremoso sobre base de frutos secos tostados.")
                        .imagen("/img/producto_PSA002.avif")
                        .build(),
                Producto.builder()
                        .codigo("PT001")
                        .categoria(catTradicional)
                        .nombre("Empanada de Manzana")
                        .precio(3000)
                        .stock(25)
                        .stockCritico(8)
                        .enOferta(false)
                        .descripcion("Pastel tradicional chileno relleno de manzanas especiadas con canela y masa hojaldrada.")
                        .imagen("/img/producto_PT001.avif")
                        .build(),
                Producto.builder()
                        .codigo("PT002")
                        .categoria(catTradicional)
                        .nombre("Tarta de Santiago")
                        .precio(6000)
                        .stock(11)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Tarta tradicional a base de almendras seleccionadas, azúcar y huevos.")
                        .imagen("/img/producto_PT002.avif")
                        .build(),
                Producto.builder()
                        .codigo("PSG001")
                        .categoria(catSinGluten)
                        .nombre("Brownie Sin Gluten")
                        .precio(4000)
                        .stock(4) // Producto Crítico (<= 5)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Intenso y húmedo brownie de chocolate puro elaborado con harina certificada sin gluten.")
                        .imagen("/img/producto_PSG001.avif")
                        .build(),
                Producto.builder()
                        .codigo("PSG002")
                        .categoria(catSinGluten)
                        .nombre("Panqueque de Naranja Sin Gluten")
                        .precio(45000)
                        .stock(7)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Capas finas de panqueque sin gluten rellenas de crema de naranja natural.")
                        .imagen("/img/producto_PSG002.avif")
                        .build(),
                Producto.builder()
                        .codigo("PV001")
                        .categoria(catVeganos)
                        .nombre("Torta Vegana de Chocolate")
                        .precio(50000)
                        .stock(8)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Exquisita torta 100% vegana con cacao orgánico y leche vegetal.")
                        .imagen("/img/producto_PV001.avif")
                        .build(),
                Producto.builder()
                        .codigo("PV002")
                        .categoria(catVeganos)
                        .nombre("Galletas Veganas de Avena")
                        .precio(4500)
                        .stock(18)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Crujientes galletas de avena integral, miel de agave, pasas y semillas.")
                        .imagen("/img/producto_PV002.avif")
                        .build(),
                Producto.builder()
                        .codigo("TE001")
                        .categoria(catEspeciales)
                        .nombre("Torta Especial de Cumpleaños")
                        .precio(55000)
                        .stock(6)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Diseñada para celebraciones únicas. Doble relleno de manjar y chantilly con flores de azúcar.")
                        .imagen("/img/producto_TE001.avif")
                        .build(),
                Producto.builder()
                        .codigo("TE002")
                        .categoria(catEspeciales)
                        .nombre("Torta Especial de Boda")
                        .precio(60000)
                        .stock(5) // Producto Crítico (<= 5)
                        .stockCritico(5)
                        .enOferta(false)
                        .descripcion("Elegante creación de varios pisos con detalles artesanales de glaseado real.")
                        .imagen("/img/producto_TE002.jpg")
                        .build()
        );
        productoRepository.saveAll(productos);

        // 3. Usuarios de prueba
        Usuario admin = usuarioRepository.save(Usuario.builder()
                .nombre("Administrador Mil Sabores")
                .email("admin@pasteleriamilsabores.cl")
                .password("admin123")
                .telefono("+56 9 8765 4321")
                .direccion("Casa Matriz, Av. Concha y Toro #1234, Santiago")
                .rol("ADMIN")
                .edad(42)
                .descuentoSenior(false)
                .esEstudianteDuoc(false)
                .build());

        Usuario rosa = usuarioRepository.save(Usuario.builder()
                .nombre("Rosa María Carrasco")
                .email("rosa.carrasco@gmail.com")
                .password("rosa123")
                .telefono("+56 9 7654 3210")
                .direccion("Av. Concha y Toro #2500, Santiago")
                .fechaNacimiento("1965-03-20")
                .edad(61)
                .rol("CLIENTE")
                .descuentoSenior(true) // +50 años
                .esEstudianteDuoc(false)
                .build());

        Usuario estudiante = usuarioRepository.save(Usuario.builder()
                .nombre("Matías Albornoz")
                .email("estudiante@duocuc.cl")
                .password("duoc123")
                .telefono("+56 9 6543 2109")
                .direccion("San Carlos de Apoquindo #2222, Las Condes")
                .fechaNacimiento("2002-08-14")
                .edad(24)
                .rol("CLIENTE")
                .descuentoSenior(false)
                .esEstudianteDuoc(true) // Duoc UC
                .build());

        // 4. Órdenes iniciales de demostración
        Orden orden1 = Orden.builder()
                .folio("MS-501991")
                .fecha("18/10/2026")
                .hora("11:30")
                .subtotal(55000)
                .porcentajeDescuento(50)
                .montoDescuento(27500)
                .motivoDescuento("Descuento Senior 50% (+50 años)")
                .envio(3500)
                .iva(4950)
                .total(31000)
                .estado("Entregado")
                .clienteNombre(rosa.getNombre())
                .clienteEmail(rosa.getEmail())
                .telefono(rosa.getTelefono())
                .direccionEntrega(rosa.getDireccion())
                .region("Región Metropolitana")
                .comuna("Puente Alto")
                .fechaEntrega("19/10/2026")
                .horarioEntrega("10:00 a 14:00 hrs")
                .repartidor("Carlos Valenzuela - Furgón Refrigerado")
                .usuario(rosa)
                .items(new ArrayList<>())
                .build();

        orden1.getItems().add(DetalleOrden.builder()
                .orden(orden1)
                .codigoProducto("TE001")
                .nombreProducto("Torta Especial de Cumpleaños")
                .precioUnitario(55000)
                .cantidad(1)
                .subtotal(55000)
                .personalizacion("Forma: Circular · Tamaño: Mediana · Dedicatoria: 'Felices 50 Años'")
                .build());

        ordenRepository.save(orden1);

        Orden orden2 = Orden.builder()
                .folio("MS-501992")
                .fecha("19/10/2026")
                .hora("15:45")
                .subtotal(50000)
                .porcentajeDescuento(15)
                .montoDescuento(7500)
                .motivoDescuento("Oferta Especial Temporada")
                .envio(3500)
                .iva(7345)
                .total(46000)
                .estado("En Preparación")
                .clienteNombre(estudiante.getNombre())
                .clienteEmail(estudiante.getEmail())
                .telefono(estudiante.getTelefono())
                .direccionEntrega(estudiante.getDireccion())
                .region("Región Metropolitana")
                .comuna("Las Condes")
                .fechaEntrega("21/10/2026")
                .horarioEntrega("14:00 a 18:00 hrs")
                .repartidor("En asignación de ruta")
                .usuario(estudiante)
                .items(new ArrayList<>())
                .build();

        orden2.getItems().add(DetalleOrden.builder()
                .orden(orden2)
                .codigoProducto("TC002")
                .nombreProducto("Torta Cuadrada de Frutas")
                .precioUnitario(50000)
                .cantidad(1)
                .subtotal(50000)
                .personalizacion("Forma: Cuadrada · Tamaño: Grande")
                .build());

        ordenRepository.save(orden2);
    }
}
