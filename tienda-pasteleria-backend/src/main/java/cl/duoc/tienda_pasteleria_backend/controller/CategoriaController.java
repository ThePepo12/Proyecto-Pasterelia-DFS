package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.Categoria;
import cl.duoc.tienda_pasteleria_backend.repository.CategoriaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        return categoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> crear(@Valid @RequestBody Categoria categoria) {
        Categoria guardada = categoriaRepository.save(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @Valid @RequestBody Categoria nueva) {
        return categoriaRepository.findById(id)
                .map(cat -> {
                    cat.setNombre(nueva.getNombre());
                    cat.setDescripcion(nueva.getDescripcion());
                    cat.setImagen(nueva.getImagen());
                    return ResponseEntity.ok(categoriaRepository.save(cat));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!categoriaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoriaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
