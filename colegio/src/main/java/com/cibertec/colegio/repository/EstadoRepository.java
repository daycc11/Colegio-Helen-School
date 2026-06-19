package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.Estado;

@Repository
public interface EstadoRepository extends JpaRepository<Estado, Integer> {
}

