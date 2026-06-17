package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.AsignacionAcademica;
import com.cibertec.colegio.repository.AsignacionAcademicaRepository;

@Service
public class AsignacionAcademicaService {

    @Autowired
    private AsignacionAcademicaRepository asignacionRepository;

    public List<AsignacionAcademica> listarTodos() {
        return asignacionRepository.findAll();
    }

    public AsignacionAcademica guardar(AsignacionAcademica asignacion) {
        return asignacionRepository.save(asignacion);
    }

    public AsignacionAcademica obtenerPorId(Integer id) {
        return asignacionRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        asignacionRepository.deleteById(id);
    }
}
