package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Curso;
import com.cibertec.colegio.repository.CursoRepository;

@Service
public class CursoService {
    @Autowired
    private CursoRepository repository;

    public List<Curso> listarTodos() { return repository.findAll(); }
    public Curso guardar(Curso entity) { return repository.save(entity); }
    public void eliminar(Integer id) { repository.deleteById(id); }
}

