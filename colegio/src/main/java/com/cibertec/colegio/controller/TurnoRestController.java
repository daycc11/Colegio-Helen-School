package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Turno;
import com.cibertec.colegio.service.TurnoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/turnos")
public class TurnoRestController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public List<Turno> listar() {
        return turnoService.listarTodos();
    }
}
