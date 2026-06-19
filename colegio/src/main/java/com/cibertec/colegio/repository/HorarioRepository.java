package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.Horario;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
}

