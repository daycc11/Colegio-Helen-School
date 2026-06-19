package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.DiaSemana;
import com.cibertec.colegio.repository.DiaSemanaRepository;

@Service
public class DiaSemanaService {
    @Autowired
    private DiaSemanaRepository repository;

    public List<DiaSemana> listarTodos() { return repository.findAll(); }
    public DiaSemana guardar(DiaSemana entity) { return repository.save(entity); }
    public void eliminar(Integer id) { repository.deleteById(id); }
}

