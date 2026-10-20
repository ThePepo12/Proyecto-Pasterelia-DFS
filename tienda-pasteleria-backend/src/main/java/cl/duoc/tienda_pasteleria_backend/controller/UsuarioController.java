package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.Usuario;
import cl.duoc.tienda_pasteleria_backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail().trim().toLowerCase()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya se encuentra registrado");
        }
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("CLIENTE");
        }
        // Calcular beneficios si aplican
        if (usuario.getEdad() != null && usuario.getEdad() >= 50) {
            usuario.setDescuentoSenior(true);
        }
        if (usuario.getEmail().endsWith("@duocuc.cl")) {
            usuario.setEsEstudianteDuoc(true);
        }
        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    if (datos.getNombre() != null) u.setNombre(datos.getNombre());
                    if (datos.getTelefono() != null) u.setTelefono(datos.getTelefono());
                    if (datos.getDireccion() != null) u.setDireccion(datos.getDireccion());
                    if (datos.getFechaNacimiento() != null) u.setFechaNacimiento(datos.getFechaNacimiento());
                    if (datos.getEdad() != null) {
                        u.setEdad(datos.getEdad());
                        u.setDescuentoSenior(datos.getEdad() >= 50);
                    }
                    if (datos.getRol() != null && !datos.getRol().isBlank()) {
                        u.setRol(datos.getRol());
                    }
                    if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                        u.setPassword(datos.getPassword());
                    }
                    return ResponseEntity.ok(usuarioRepository.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
