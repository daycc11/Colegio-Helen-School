package com.cibertec.colegio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cibertec.colegio.model.Docente;

public interface DocenteRepository extends JpaRepository<Docente, Integer> {

    Optional<Docente> findByDni(String dni);
}
