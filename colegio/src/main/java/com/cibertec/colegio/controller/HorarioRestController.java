package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.Horario;
import com.cibertec.colegio.service.HorarioService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/horario")
public class HorarioRestController {
    @Autowired
    private HorarioService service;

    @GetMapping
    public List<Horario> listar() { return service.listarTodos(); }

    @PostMapping
    public Horario guardar(@RequestBody Horario entity) { return service.guardar(entity); }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}

