package cl.duoc.tienda_pasteleria_backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String folio;

    private String fecha;

    private String hora;

    @NotNull
    private Integer subtotal;

    @Builder.Default
    private Integer montoDescuento = 0;

    @Builder.Default
    private Integer porcentajeDescuento = 0;

    private String motivoDescuento;

    @Builder.Default
    private Integer envio = 3500;

    @Builder.Default
    private Integer iva = 0;

    @NotNull
    private Integer total;

    @Builder.Default
    private String estado = "Confirmado"; // "Confirmado", "En Preparación", "En Ruta", "Entregado", "Cancelado"

    @NotBlank
    private String clienteNombre;

    @NotBlank
    private String clienteEmail;

    private String telefono;

    private String direccionEntrega;

    private String region;

    private String comuna;

    private String indicaciones;

    private String fechaEntrega;

    private String horarioEntrega;

    private String repartidor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    private List<DetalleOrden> items = new ArrayList<>();
}
