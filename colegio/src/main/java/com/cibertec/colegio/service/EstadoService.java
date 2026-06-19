package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Estado;
import com.cibertec.colegio.repository.EstadoRepository;

@Service
public class EstadoService {
    @Autowired
    private EstadoRepository repository;

    public List<Estado> listarTodos() { return repository.findAll(); }
    public Estado guardar(Estado entity) { return repository.save(entity); }
    public void eliminar(Integer id) { repository.deleteById(id); }
}

