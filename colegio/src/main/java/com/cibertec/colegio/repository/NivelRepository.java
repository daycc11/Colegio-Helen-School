package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.Nivel;

@Repository
public interface NivelRepository extends JpaRepository<Nivel, Integer> {
}
