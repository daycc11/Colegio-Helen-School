package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.DiaSemana;
import com.cibertec.colegio.service.DiaSemanaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/diaSemana")
public class DiaSemanaRestController {
    @Autowired
    private DiaSemanaService service;

    @GetMapping
    public List<DiaSemana> listar() { return service.listarTodos(); }

    @PostMapping
    public DiaSemana guardar(@RequestBody DiaSemana entity) { return service.guardar(entity); }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { service.eliminar(id); }
}

