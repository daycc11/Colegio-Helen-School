package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cibertec.colegio.model.Tutor;

public interface TutorRepository extends JpaRepository<Tutor, Integer> {
    
}
