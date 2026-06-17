package com.cibertec.colegio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Docente;
import com.cibertec.colegio.repository.DocenteRepository;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    public List<Docente> listarTodos() {
        return docenteRepository.findAll();
    }

    public Docente guardar(Docente docente) {
        return docenteRepository.save(docente);
    }

    public Docente obtenerPorId(Integer id) {
        return docenteRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        docenteRepository.deleteById(id);
    }

    public boolean existePorDni(String dni) {
        return docenteRepository.findByDni(dni).isPresent();
    }

    public boolean existePorDniExcluyendoId(String dni, Integer idExcluir) {
        return docenteRepository.findByDni(dni)
                .map(d -> !d.getId().equals(idExcluir))
                .orElse(false);
    }
}
