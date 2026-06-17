package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.cibertec.colegio.model.Grado;
import com.cibertec.colegio.service.GradoService;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/grado")
public class GradoController {

    @Autowired
    private GradoService gradoService;

    @GetMapping
    public List<Grado> listar() {
        return gradoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Grado obtenerPorId(@PathVariable Integer id) {
        return gradoService.obtenerPorId(id);
    }

    @PostMapping
    public Grado crearGrado(@RequestBody Grado grado) {
        return gradoService.guardar(grado);
    }

    @PutMapping("/{id}")
    public Grado actualizarGrado(@PathVariable Integer id, @RequestBody Grado grado) {
        grado.setId(id);
        return gradoService.guardar(grado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarGrado(@PathVariable Integer id) {
        try {
            gradoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Grado eliminado correctamente"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar este grado porque está en uso."));
        }
    }
}
