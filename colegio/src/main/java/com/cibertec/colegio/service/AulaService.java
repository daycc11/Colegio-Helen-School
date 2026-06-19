package com.cibertec.colegio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Aula;
import com.cibertec.colegio.repository.AulaRepository;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    public List<Aula> listarTodos() {
        return aulaRepository.findAll();
    }

    public List<Aula> listarPorAnioYGrado(Integer idAnioEscolar, Integer idGrado) {
        if (idGrado != null) {
            return aulaRepository.findByAnioEscolarIdAndGradoNivelSeccionGradoId(idAnioEscolar, idGrado);
        }
        return aulaRepository.findByAnioEscolarId(idAnioEscolar);
    }

    public Optional<Aula> buscarPorId(Integer id) {
        return aulaRepository.findById(id);
    }

    public Aula guardar(Aula aula) {
        return aulaRepository.save(aula);
    }

    public void eliminar(Integer id) {
        aulaRepository.deleteById(id);
    }
}
