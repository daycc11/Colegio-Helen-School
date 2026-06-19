package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.Curso;
import com.cibertec.colegio.service.CursoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/curso")
public class CursoRestController {
    @Autowired
    private CursoService service;

    @GetMapping
    public List<Curso> listar() { return service.listarTodos(); }

    @PostMapping
    public Curso guardar(@RequestBody Curso entity) { return service.guardar(entity); }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { service.eliminar(id); }
}

