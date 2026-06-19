package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cibertec.colegio.model.Tutor;
import com.cibertec.colegio.service.TutorService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tutor")
public class TutorRestController {

    @Autowired
    private TutorService tutorService;

    @GetMapping
    public List<Tutor> listar() {
        return tutorService.listarTodos();
    }

    @PostMapping
    public Tutor crearTutor(@RequestBody Tutor tutor) {
        return tutorService.guardar(tutor);
    }

    @GetMapping("/{id}")
    public Tutor obtenerTutor(@PathVariable Integer id) {
        return tutorService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public Tutor actualizarTutor(@PathVariable Integer id, @RequestBody Tutor tutor) {
        tutor.setId(id);
        return tutorService.guardar(tutor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTutor(@PathVariable Integer id) {
        try {
            tutorService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Tutor eliminado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar este tutor porque tiene alumnos asignados. Primero cambie el tutor del alumno o elimine el alumno relacionado."));
        }
    }
}