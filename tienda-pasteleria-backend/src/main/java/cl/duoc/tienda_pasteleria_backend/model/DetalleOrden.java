package cl.duoc.tienda_pasteleria_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "detalle_ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id", nullable = false)
    @JsonBackReference
    private Orden orden;

    private String codigoProducto;

    @NotNull
    private String nombreProducto;

    @NotNull
    private Integer precioUnitario;

    @NotNull
    private Integer cantidad;

    @NotNull
    private Integer subtotal;

    private String personalizacion;
}
