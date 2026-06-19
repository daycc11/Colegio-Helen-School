package com.cibertec.colegio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Aula;
import com.cibertec.colegio.repository.AulaRepository;
import com.cibertec.colegio.repository.MatriculaRepository;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;
    
    @Autowired
    private MatriculaRepository matriculaRepository;

    private List<Aula> populateMatriculados(List<Aula> aulas) {
        aulas.forEach(aula -> {
            // Asumimos que estadoId 1 es "Activa" (puedes ajustar según tu DB)
            int count = matriculaRepository.countByAulaIdAndEstadoId(aula.getId(), 1);
            aula.setMatriculados(count);
        });
        return aulas;
    }

    public List<Aula> listarTodos() {
        return populateMatriculados(aulaRepository.findAll());
    }

    public List<Aula> listarPorAnioYGrado(Integer idAnioEscolar, Integer idGrado) {
        List<Aula> aulas;
        if (idGrado != null) {
            aulas = aulaRepository.findByAnioEscolarIdAndGradoNivelSeccionGradoId(idAnioEscolar, idGrado);
        } else {
            aulas = aulaRepository.findByAnioEscolarId(idAnioEscolar);
        }
        return populateMatriculados(aulas);
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
