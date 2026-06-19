package com.cibertec.colegio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.CursoDocente;
import com.cibertec.colegio.service.CursoDocenteService;
import java.util.List;

@RestController
@RequestMapping("/api/curso-docente")
@CrossOrigin(origins = "*")
public class CursoDocenteRestController {

    private final CursoDocenteService service;

    public CursoDocenteRestController(CursoDocenteService service) {
        this.service = service;
    }

    @GetMapping
    public List<CursoDocente> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public CursoDocente guardar(@RequestBody CursoDocente cursoDocente) {
        return service.guardar(cursoDocente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDocente> buscarPorId(@PathVariable Long id) {
        CursoDocente cd = service.buscarPorId(id);
        if (cd == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cd);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
