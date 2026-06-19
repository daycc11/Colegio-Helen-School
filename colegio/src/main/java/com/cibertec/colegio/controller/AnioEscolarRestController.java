package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.AnioEscolar;
import com.cibertec.colegio.service.AnioEscolarService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/anios-escolares")
public class AnioEscolarRestController {

    @Autowired
    private AnioEscolarService anioEscolarService;

    @GetMapping
    public List<AnioEscolar> listar() {
        return anioEscolarService.listarTodos();
    }

    @PostMapping
    public AnioEscolar guardar(@RequestBody AnioEscolar anio) {
        return anioEscolarService.guardar(anio);
    }
}
