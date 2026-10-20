package cl.duoc.tienda_pasteleria_backend.repository;

import cl.duoc.tienda_pasteleria_backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigo(String codigo);
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByEnOfertaTrue();
    List<Producto> findByStockLessThanEqual(Integer stockLimite);
}
