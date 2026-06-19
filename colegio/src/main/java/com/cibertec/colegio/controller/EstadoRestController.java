package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.Estado;
import com.cibertec.colegio.service.EstadoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/estado")
public class EstadoRestController {
    @Autowired
    private EstadoService service;

    @GetMapping
    public List<Estado> listar() { return service.listarTodos(); }

    @PostMapping
    public Estado guardar(@RequestBody Estado entity) { return service.guardar(entity); }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { service.eliminar(id); }
}

