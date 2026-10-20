package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.Categoria;
import cl.duoc.tienda_pasteleria_backend.model.Producto;
import cl.duoc.tienda_pasteleria_backend.repository.CategoriaRepository;
import cl.duoc.tienda_pasteleria_backend.repository.ProductoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Producto> obtenerPorCodigo(@PathVariable String codigo) {
        return productoRepository.findByCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @GetMapping("/ofertas")
    public List<Producto> obtenerOfertas() {
        return productoRepository.findByEnOfertaTrue();
    }

    @GetMapping("/criticos")
    public List<Producto> obtenerCriticos(@RequestParam(defaultValue = "5") Integer limite) {
        return productoRepository.findByStockLessThanEqual(limite);
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria cat = categoriaRepository.findById(producto.getCategoria().getId()).orElse(null);
            producto.setCategoria(cat);
        }
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto nuevo) {
        return productoRepository.findById(id)
                .map(prod -> {
                    prod.setCodigo(nuevo.getCodigo());
                    prod.setNombre(nuevo.getNombre());
                    prod.setDescripcion(nuevo.getDescripcion());
                    prod.setPrecio(nuevo.getPrecio());
                    prod.setStock(nuevo.getStock());
                    prod.setStockCritico(nuevo.getStockCritico());
                    prod.setEnOferta(nuevo.getEnOferta());
                    prod.setPorcentajeDescuento(nuevo.getPorcentajeDescuento());
                    prod.setImagen(nuevo.getImagen());
                    if (nuevo.getCategoria() != null && nuevo.getCategoria().getId() != null) {
                        categoriaRepository.findById(nuevo.getCategoria().getId()).ifPresent(prod::setCategoria);
                    }
                    return ResponseEntity.ok(productoRepository.save(prod));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
