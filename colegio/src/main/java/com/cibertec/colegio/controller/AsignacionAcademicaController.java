package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.cibertec.colegio.model.AsignacionAcademica;
import com.cibertec.colegio.service.AsignacionAcademicaService;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/asignacion")
public class AsignacionAcademicaController {

    @Autowired
    private AsignacionAcademicaService asignacionService;

    @GetMapping
    public List<AsignacionAcademica> listar() {
        return asignacionService.listarTodos();
    }

    @GetMapping("/{id}")
    public AsignacionAcademica obtenerPorId(@PathVariable Integer id) {
        return asignacionService.obtenerPorId(id);
    }

    @PostMapping
    public AsignacionAcademica crearAsignacion(@RequestBody AsignacionAcademica asignacion) {
        return asignacionService.guardar(asignacion);
    }

    @PutMapping("/{id}")
    public AsignacionAcademica actualizarAsignacion(@PathVariable Integer id, @RequestBody AsignacionAcademica asignacion) {
        asignacion.setId(id);
        return asignacionService.guardar(asignacion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAsignacion(@PathVariable Integer id) {
        try {
            asignacionService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Asignación eliminada correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar esta asignación porque está en uso."));
        }
    }
}
