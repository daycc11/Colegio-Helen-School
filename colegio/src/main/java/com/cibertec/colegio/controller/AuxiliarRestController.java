package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Auxiliar;
import com.cibertec.colegio.service.AuxiliarService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auxiliares")
public class AuxiliarRestController {

    @Autowired
    private AuxiliarService auxiliarService;

    @GetMapping
    public List<Auxiliar> listar() {
        return auxiliarService.listarTodos();
    }
}
