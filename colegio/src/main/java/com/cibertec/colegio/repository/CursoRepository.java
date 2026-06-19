package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
}

