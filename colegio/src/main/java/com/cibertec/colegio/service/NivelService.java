package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Nivel;
import com.cibertec.colegio.repository.NivelRepository;

@Service
public class NivelService {

    @Autowired
    private NivelRepository nivelRepository;

    public List<Nivel> listarTodos() {
        return nivelRepository.findAll();
    }

    public Nivel guardar(Nivel nivel) {
        return nivelRepository.save(nivel);
    }
    
    public void eliminar(Integer id) {
        nivelRepository.deleteById(id);
    }
}
