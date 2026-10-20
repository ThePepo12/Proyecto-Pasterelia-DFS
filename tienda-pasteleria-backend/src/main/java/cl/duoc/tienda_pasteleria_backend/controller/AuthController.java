package cl.duoc.tienda_pasteleria_backend.controller;

import cl.duoc.tienda_pasteleria_backend.model.Usuario;
import cl.duoc.tienda_pasteleria_backend.repository.UsuarioRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email y contraseña son obligatorios");
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailAndPassword(
                request.getEmail().trim().toLowerCase(),
                request.getPassword()
        );

        if (usuarioOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Correo o contraseña incorrectos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Usuario u = usuarioOpt.get();
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", u.getId());
        resp.put("nombre", u.getNombre());
        resp.put("email", u.getEmail());
        resp.put("rol", u.getRol());
        resp.put("telefono", u.getTelefono());
        resp.put("direccion", u.getDireccion());
        resp.put("fechaNacimiento", u.getFechaNacimiento());
        resp.put("edad", u.getEdad());
        resp.put("descuentoSenior", u.getDescuentoSenior());
        resp.put("esEstudianteDuoc", u.getEsEstudianteDuoc());

        return ResponseEntity.ok(resp);
    }
}
