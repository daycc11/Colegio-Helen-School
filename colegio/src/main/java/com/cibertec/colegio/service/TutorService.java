package com.cibertec.colegio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Tutor;
import com.cibertec.colegio.repository.TutorRepository;

@Service
public class TutorService {
	
	@Autowired
    private TutorRepository tutorRepository;



    public List<Tutor> listarTodos() {
        return tutorRepository.findAll();
    }
    
    public Tutor guardar(Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    public Tutor obtenerPorId(Integer id) {
        return tutorRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
    	tutorRepository.deleteById(id);
    }
}