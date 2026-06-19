package com.cibertec.colegio.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {

}
