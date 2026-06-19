package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Aula;
import com.cibertec.colegio.service.AulaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/aulas")
public class AulaRestController {

    @Autowired
    private AulaService aulaService;

    @GetMapping
    public List<Aula> listar(@RequestParam(required = true) Integer idAnioEscolar, @RequestParam(required = false) Integer idGrado) {
        return aulaService.listarPorAnioYGrado(idAnioEscolar, idGrado);
    }
    
    @GetMapping("/todas")
    public List<Aula> listarTodas() {
        return aulaService.listarTodos();
    }

    @PostMapping
    public Aula guardar(@RequestBody Aula aula) {
        return aulaService.guardar(aula);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        aulaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
