package com.cibertec.colegio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.repository.AlumnoRepository;

@Service
public class AlumnoService {
	
	@Autowired
    private AlumnoRepository alumnoRepository;



    public List<Alumno> listarTodos() {
        return alumnoRepository.findAll();
    }
    
    public Alumno guardar(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }

    public Alumno obtenerPorId(Long id) {
        return alumnoRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
    	alumnoRepository.deleteById(id);
    }
}