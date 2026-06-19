package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cibertec.colegio.model.Turno;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Integer> {
}
