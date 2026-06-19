package com.cibertec.colegio.service;

import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.CursoDocente;
import com.cibertec.colegio.repository.CursoDocenteRepository;
import java.util.List;

@Service
public class CursoDocenteService {

    private final CursoDocenteRepository repository;

    public CursoDocenteService(CursoDocenteRepository repository) {
        this.repository = repository;
    }

    public List<CursoDocente> listarTodos() {
        return repository.findAll();
    }

    public CursoDocente guardar(CursoDocente cursoDocente) {
        return repository.save(cursoDocente);
    }

    public CursoDocente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
