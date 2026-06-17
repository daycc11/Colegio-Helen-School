package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cibertec.colegio.model.Seccion;

public interface SeccionRepository extends JpaRepository<Seccion, Integer> {
}
