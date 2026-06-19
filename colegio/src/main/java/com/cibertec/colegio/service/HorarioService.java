package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Horario;
import com.cibertec.colegio.repository.HorarioRepository;

@Service
public class HorarioService {
    @Autowired
    private HorarioRepository repository;

    public List<Horario> listarTodos() { return repository.findAll(); }
    public Horario guardar(Horario entity) { return repository.save(entity); }
    public void eliminar(Long id) { repository.deleteById(id); }
}

