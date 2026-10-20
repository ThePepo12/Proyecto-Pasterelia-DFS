package cl.duoc.tienda_pasteleria_backend.repository;

import cl.duoc.tienda_pasteleria_backend.model.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {
    List<DetalleOrden> findByOrdenId(Long ordenId);
}
