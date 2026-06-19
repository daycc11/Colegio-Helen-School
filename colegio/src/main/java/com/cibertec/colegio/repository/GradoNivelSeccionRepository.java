package com.cibertec.colegio.repository;

import com.cibertec.colegio.model.GradoNivelSeccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradoNivelSeccionRepository extends JpaRepository<GradoNivelSeccion, Integer> {
    List<GradoNivelSeccion> findByEstado(Integer estado);
}
