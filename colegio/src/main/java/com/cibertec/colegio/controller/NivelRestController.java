package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Nivel;
import com.cibertec.colegio.service.NivelService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/nivel")
public class NivelRestController {

    @Autowired
    private NivelService nivelService;

    @GetMapping
    public List<Nivel> listar() {
        return nivelService.listarTodos();
    }

    @PostMapping
    public Nivel guardar(@RequestBody Nivel nivel) {
        return nivelService.guardar(nivel);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        nivelService.eliminar(id);
    }
}
