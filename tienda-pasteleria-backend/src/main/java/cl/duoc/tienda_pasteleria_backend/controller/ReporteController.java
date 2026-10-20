package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.Orden;
import cl.duoc.tienda_pasteleria_backend.model.Producto;
import cl.duoc.tienda_pasteleria_backend.repository.OrdenRepository;
import cl.duoc.tienda_pasteleria_backend.repository.ProductoRepository;
import cl.duoc.tienda_pasteleria_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/productos")
    public Map<String, Object> reporteProductos() {
        List<Producto> productos = productoRepository.findAll();
        int totalProductos = productos.size();
        int stockTotal = productos.stream().mapToInt(p -> p.getStock() != null ? p.getStock() : 0).sum();
        long valorInventario = productos.stream().mapToLong(p -> (long) (p.getPrecio() != null ? p.getPrecio() : 0) * (p.getStock() != null ? p.getStock() : 0)).sum();
        long criticos = productos.stream().filter(p -> p.getStock() != null && p.getStockCritico() != null && p.getStock() <= p.getStockCritico()).count();
        long enOferta = productos.stream().filter(p -> Boolean.TRUE.equals(p.getEnOferta())).count();

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("totalProductos", totalProductos);
        reporte.put("stockTotalUnidades", stockTotal);
        reporte.put("valorTotalInventarioClp", valorInventario);
        reporte.put("productosCriticosCount", criticos);
        reporte.put("productosEnOfertaCount", enOferta);

        return reporte;
    }

    @GetMapping("/generales")
    public Map<String, Object> reporteGenerales() {
        List<Orden> ordenes = ordenRepository.findAll();
        long totalVentas = ordenes.stream().mapToLong(o -> o.getTotal() != null ? o.getTotal() : 0).sum();
        int totalOrdenes = ordenes.size();
        long totalUsuarios = usuarioRepository.count();
        double ticketPromedio = totalOrdenes > 0 ? (double) totalVentas / totalOrdenes : 0;

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("ventasTotalesClp", totalVentas);
        reporte.put("cantidadOrdenes", totalOrdenes);
        reporte.put("usuariosRegistrados", totalUsuarios);
        reporte.put("ticketPromedioClp", Math.round(ticketPromedio));

        return reporte;
    }
}
