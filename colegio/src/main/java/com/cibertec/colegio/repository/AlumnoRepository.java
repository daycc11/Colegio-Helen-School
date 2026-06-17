package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cibertec.colegio.model.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    
}
