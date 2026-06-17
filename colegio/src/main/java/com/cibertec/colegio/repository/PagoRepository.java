package com.cibertec.colegio.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByAlumnoIdOrderByFechaPagoDesc(Long alumnoId);

    /** Alumnos que NO tienen ningún pago registrado */
    @Query("SELECT a FROM Alumno a WHERE a.id NOT IN (SELECT p.alumno.id FROM Pago p)")
    List<Alumno> findAlumnosSinPago();

    /** Contar pagos de un alumno */
    long countByAlumnoId(Long alumnoId);
}
