package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.cibertec.colegio.model.Seccion;
import com.cibertec.colegio.service.SeccionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/seccion")
public class SeccionRestController {

    @Autowired
    private SeccionService seccionService;

    @GetMapping
    public List<Seccion> listar() {
        return seccionService.listarTodos();
    }

    @GetMapping("/{id}")
    public Seccion obtenerPorId(@PathVariable Integer id) {
        return seccionService.obtenerPorId(id);
    }

    @PostMapping
    public Seccion crearSeccion(@RequestBody Seccion seccion) {
        return seccionService.guardar(seccion);
    }

    @PutMapping("/{id}")
    public Seccion actualizarSeccion(@PathVariable Integer id, @RequestBody Seccion seccion) {
        seccion.setId(id);
        return seccionService.guardar(seccion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSeccion(@PathVariable Integer id) {
        try {
            seccionService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Sección eliminada correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar esta sección porque está en uso."));
        }
    }
}
