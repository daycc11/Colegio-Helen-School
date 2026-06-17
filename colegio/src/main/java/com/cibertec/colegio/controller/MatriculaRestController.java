package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.service.AlumnoService;

/**
 * REST Controller para el frontend Angular — Lista de Matrículas.
 *
 * Expone el endpoint GET /api/matricula que devuelve todos los alumnos
 * con su información de grado y tutor incluida en el JSON.
 * Utilizado por el componente MatriculasComponent del frontend Angular.
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/matricula")
public class MatriculaRestController {

    @Autowired
    private AlumnoService alumnoService;

    /**
     * Devuelve la lista completa de alumnos matriculados.
     * Incluye información de grado y tutor en el JSON de respuesta.
     */
    @GetMapping
    public List<Alumno> listarMatriculas() {
        return alumnoService.listarTodos();
    }
}
