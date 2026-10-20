package cl.duoc.tienda_pasteleria_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código del producto es obligatorio")
    @Column(nullable = false, unique = true)
    private String codigo;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 1, message = "El precio debe ser mayor a 0")
    private Integer precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Builder.Default
    private Integer stock = 10;

    @NotNull(message = "El stock crítico es obligatorio")
    @Min(value = 1, message = "El stock crítico debe ser al menos 1")
    @Builder.Default
    private Integer stockCritico = 5;

    @Builder.Default
    private Boolean enOferta = false;

    @Builder.Default
    private Integer porcentajeDescuento = 0;

    private String imagen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
