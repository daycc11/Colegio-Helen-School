package com.cibertec.colegio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Turno;
import com.cibertec.colegio.repository.TurnoRepository;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }
}
