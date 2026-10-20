package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.DetalleOrden;
import cl.duoc.tienda_pasteleria_backend.model.Orden;
import cl.duoc.tienda_pasteleria_backend.model.Producto;
import cl.duoc.tienda_pasteleria_backend.model.Usuario;
import cl.duoc.tienda_pasteleria_backend.repository.OrdenRepository;
import cl.duoc.tienda_pasteleria_backend.repository.ProductoRepository;
import cl.duoc.tienda_pasteleria_backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @GetMapping
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtenerPorId(@PathVariable Long id) {
        return ordenRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<Orden> obtenerPorFolio(@PathVariable String folio) {
        return ordenRepository.findByFolio(folio)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Orden> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ordenRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    @PostMapping
    public ResponseEntity<Orden> crear(@Valid @RequestBody Orden orden) {
        // Asignar folio automático si no viene especificado
        if (orden.getFolio() == null || orden.getFolio().isBlank()) {
            long aleatorio = (long) (Math.random() * 900000) + 100000;
            orden.setFolio("MS-" + aleatorio);
        }

        // Asignar fecha y hora actual si faltan
        if (orden.getFecha() == null || orden.getFecha().isBlank()) {
            orden.setFecha(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        if (orden.getHora() == null || orden.getHora().isBlank()) {
            orden.setHora(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        }

        // Asociar usuario si viene el ID
        if (orden.getUsuario() != null && orden.getUsuario().getId() != null) {
            Usuario u = usuarioRepository.findById(orden.getUsuario().getId()).orElse(null);
            orden.setUsuario(u);
        }

        // Asociar cada ítem con la orden padre y rebajar stock
        if (orden.getItems() != null) {
            for (DetalleOrden item : orden.getItems()) {
                item.setOrden(orden);
                if (item.getCodigoProducto() != null) {
                    productoRepository.findByCodigo(item.getCodigoProducto()).ifPresent(prod -> {
                        int nuevoStock = Math.max(0, prod.getStock() - item.getCantidad());
                        prod.setStock(nuevoStock);
                        productoRepository.save(prod);
                    });
                }
            }
        }

        Orden guardada = ordenRepository.save(orden);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @Data
    public static class EstadoRequest {
        private String estado;
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Orden> cambiarEstado(@PathVariable Long id, @RequestBody EstadoRequest req) {
        return ordenRepository.findById(id)
                .map(orden -> {
                    if (req.getEstado() != null && !req.getEstado().isBlank()) {
                        orden.setEstado(req.getEstado());
                    }
                    return ResponseEntity.ok(ordenRepository.save(orden));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!ordenRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordenRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
