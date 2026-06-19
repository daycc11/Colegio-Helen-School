package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Docente;
import com.cibertec.colegio.service.DocenteService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/docente")
public class DocenteRestController {

    @Autowired
    private DocenteService docenteService;

    /** GET /api/docente — Lista todos los docentes */
    @GetMapping
    public List<Docente> listar() {
        return docenteService.listarTodos();
    }

    /** POST /api/docente — Registra un nuevo docente */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Docente docente) {
        // Validar DNI duplicado al crear
        if (docente.getDni() != null && docenteService.existePorDni(docente.getDni())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un docente con ese DNI."));
        }
        return ResponseEntity.ok(docenteService.guardar(docente));
    }

    /** GET /api/docente/{id} — Obtiene un docente por ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        Docente docente = docenteService.obtenerPorId(id);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }

    /** PUT /api/docente/{id} — Actualiza un docente existente */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Docente docente) {
        // Validar DNI duplicado excluyendo el propio registro
        if (docente.getDni() != null && docenteService.existePorDniExcluyendoId(docente.getDni(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un docente con ese DNI."));
        }
        docente.setId(id);
        return ResponseEntity.ok(docenteService.guardar(docente));
    }

    /** DELETE /api/docente/{id} — Elimina un docente */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Docente existente = docenteService.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        docenteService.eliminar(id);
        return ResponseEntity.ok(Map.of("mensaje", "Docente eliminado correctamente."));
    }
}
