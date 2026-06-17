package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Seccion;
import com.cibertec.colegio.repository.SeccionRepository;

@Service
public class SeccionService {

    @Autowired
    private SeccionRepository seccionRepository;

    public List<Seccion> listarTodos() {
        return seccionRepository.findAll();
    }

    public Seccion guardar(Seccion seccion) {
        return seccionRepository.save(seccion);
    }

    public Seccion obtenerPorId(Integer id) {
        return seccionRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        seccionRepository.deleteById(id);
    }
}
