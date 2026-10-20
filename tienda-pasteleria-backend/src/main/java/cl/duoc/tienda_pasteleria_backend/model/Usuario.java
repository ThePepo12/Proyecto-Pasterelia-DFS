package cl.duoc.tienda_pasteleria_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Debe ser un correo electrónico válido")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false)
    private String password;

    private String telefono;

    private String direccion;

    private String fechaNacimiento;

    @Builder.Default
    private Integer edad = 0;

    @Builder.Default
    private String rol = "CLIENTE"; // "ADMIN" o "CLIENTE"

    @Builder.Default
    private Boolean descuentoSenior = false;

    @Builder.Default
    private Boolean esEstudianteDuoc = false;
}
