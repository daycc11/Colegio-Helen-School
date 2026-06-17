package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;
import com.cibertec.colegio.service.PagoService;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @GetMapping
    public List<Pago> listarTodos() {
        return pagoService.listarTodos();
    }

    @GetMapping("/alumno/{alumnoId}")
    public List<Pago> listarPorAlumno(@PathVariable Long alumnoId) {
        return pagoService.listarPorAlumno(alumnoId);
    }

    @PostMapping
    public ResponseEntity<Pago> crear(@RequestBody Pago pago) {
        // Asegurar que el alumno esté referenciado por ID
        if (pago.getAlumno() == null || pago.getAlumno().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Pago guardado = pagoService.guardar(pago);
        return ResponseEntity.ok(guardado);
    }

    /** IMPORTANTE: /pendientes debe ir ANTES de /{id} para evitar conflicto de rutas */
    @GetMapping("/pendientes")
    public List<Alumno> alumnosSinPago() {
        return pagoService.alumnosSinPago();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> buscarPorId(@PathVariable Long id) {
        Pago pago = pagoService.buscarPorId(id);
        if (pago == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pago);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
