package cl.duoc.tienda_pasteleria_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    private String imagen;
}
