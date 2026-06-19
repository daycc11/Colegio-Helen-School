package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.service.AlumnoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/alumno")
public class AlumnoRestController {

    @Autowired
    private AlumnoService alumnoService;



    @GetMapping
    public List<Alumno> listar() {
        return alumnoService.listarTodos();
    }
    
    @PostMapping
    public Alumno crearProducto(@RequestBody Alumno alumno) {
        return alumnoService.guardar(alumno);
    }

    @GetMapping("/{id}")
    public Alumno obtenerProducto(@PathVariable Long id) {
        return alumnoService.obtenerPorId(id);
    }
    
    @PutMapping("/{id}")
    public Alumno actualizarAlumno(@PathVariable Long id, @RequestBody Alumno alumno) {
        alumno.setId(id);
        return alumnoService.guardar(alumno);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
    	alumnoService.eliminar(id);
    }

}