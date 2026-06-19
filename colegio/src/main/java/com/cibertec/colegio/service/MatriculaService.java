package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Matricula;
import com.cibertec.colegio.repository.MatriculaRepository;

@Service
public class MatriculaService {
    @Autowired
    private MatriculaRepository repository;

    public List<Matricula> listarTodos() { return repository.findAll(); }
    public Matricula guardar(Matricula entity) { return repository.save(entity); }
    public void eliminar(Long id) { repository.deleteById(id); }
}

