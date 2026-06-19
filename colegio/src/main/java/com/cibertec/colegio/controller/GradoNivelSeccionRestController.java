package com.cibertec.colegio.controller;

import com.cibertec.colegio.model.GradoNivelSeccion;
import com.cibertec.colegio.service.GradoNivelSeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grado-nivel-seccion")
@CrossOrigin(origins = "*")
public class GradoNivelSeccionRestController {

    @Autowired
    private GradoNivelSeccionService service;

    @GetMapping
    public List<GradoNivelSeccion> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<GradoNivelSeccion> registrar(@RequestBody GradoNivelSeccion gns) {
        return new ResponseEntity<>(service.guardar(gns), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
