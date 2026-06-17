package com.cibertec.colegio.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Grado;
import com.cibertec.colegio.repository.GradoRepository;

@Service
public class GradoService {

	@Autowired
    private GradoRepository gradoRepository;



    public List<Grado> listarTodos() {
        return gradoRepository.findAll();
    }
    
    public Grado guardar(Grado grado) {
        return gradoRepository.save(grado);
    }

    public Grado obtenerPorId(Integer id) {
        return gradoRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
    	gradoRepository.deleteById(id);
    }
}
