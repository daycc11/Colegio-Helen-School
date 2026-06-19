package com.cibertec.colegio.service;

import com.cibertec.colegio.model.GradoNivelSeccion;
import com.cibertec.colegio.repository.GradoNivelSeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradoNivelSeccionService {

    @Autowired
    private GradoNivelSeccionRepository repository;

    public List<GradoNivelSeccion> listarTodos() {
        return repository.findAll();
    }

    public List<GradoNivelSeccion> listarActivos() {
        return repository.findByEstado(1);
    }

    public GradoNivelSeccion guardar(GradoNivelSeccion gns) {
        return repository.save(gns);
    }

    public GradoNivelSeccion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminarLogico(Integer id) {
        GradoNivelSeccion gns = buscarPorId(id);
        if (gns != null) {
            gns.setEstado(0);
            repository.save(gns);
        }
    }
}
