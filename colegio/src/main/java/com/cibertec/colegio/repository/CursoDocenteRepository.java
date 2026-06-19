package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cibertec.colegio.model.CursoDocente;

public interface CursoDocenteRepository extends JpaRepository<CursoDocente, Long> {
}
