package com.cibertec.colegio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Estado;
import com.cibertec.colegio.model.Matricula;
import com.cibertec.colegio.model.Pago;
import com.cibertec.colegio.service.MatriculaService;
import com.cibertec.colegio.service.PagoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/matricula")
public class MatriculaRestController {

    @Autowired
    private MatriculaService service;

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public List<Matricula> listar() {
        return service.listarTodos();
    }

    /**
     * POST /api/matricula
     * Crea una nueva matricula. Siempre en estado "Pendiente".
     * Valida que el alumno no tenga ya una matrícula.
     */
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Matricula entity) {
        // Validar: un alumno solo puede tener UNA matrícula activa
        if (entity.getAlumno() != null && entity.getAlumno().getId() != null) {
            boolean yaMatriculado = service.listarTodos().stream()
                .anyMatch(m -> m.getAlumno() != null &&
                               m.getAlumno().getId().equals(entity.getAlumno().getId()));
            if (yaMatriculado) {
                return ResponseEntity.badRequest()
                    .body("El estudiante ya tiene una matrícula registrada.");
            }
        }

        // Crear el pago en estado Pendiente (PAGO=1)
        Pago pagoPendiente = new Pago();
        pagoPendiente.setMonto(BigDecimal.ZERO);
        pagoPendiente.setFechaEmision(LocalDate.now());
        pagoPendiente.setFechaVencimiento(LocalDate.now().plusWeeks(2));
        Estado estadoPagoPendiente = new Estado();
        estadoPagoPendiente.setId(1); // 1 = Pendiente (tipo PAGO)
        pagoPendiente.setEstado(estadoPagoPendiente);
        pagoPendiente = pagoService.guardar(pagoPendiente);
        entity.setPago(pagoPendiente);

        // Estado de la matrícula = Pendiente (MATRICULA=4)
        Estado estadoMatricula = new Estado();
        estadoMatricula.setId(4); // 4 = Pendiente (tipo MATRICULA)
        entity.setEstado(estadoMatricula);

        return ResponseEntity.ok(service.guardar(entity));
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    /**
     * PUT /api/matricula/{id}
     * Actualiza la matrícula. Si se provee método de pago + monto > 0,
     * cambia el estado a "Activa" automáticamente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Matricula entity) {
        Optional<Matricula> optExisting = service.listarTodos().stream()
                .filter(m -> m.getId().equals(id))
                .findFirst();

        if (!optExisting.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Matricula existing = optExisting.get();

        // Actualizar alumno y aula si vienen
        if (entity.getAlumno() != null) existing.setAlumno(entity.getAlumno());
        if (entity.getAula() != null) existing.setAula(entity.getAula());

        // Actualizar Pago si se provee
        if (entity.getPago() != null && existing.getPago() != null) {
            Pago pagoReq = entity.getPago();
            Pago pagoDb = pagoService.buscarPorId(existing.getPago().getId());

            if (pagoDb != null) {
                boolean tieneMetodoPago = pagoReq.getMetodoPago() != null
                        && pagoReq.getMetodoPago().getId() != null;
                boolean tieneMonto = pagoReq.getMonto() != null
                        && pagoReq.getMonto().compareTo(BigDecimal.ZERO) > 0;

                if (pagoReq.getMonto() != null) pagoDb.setMonto(pagoReq.getMonto());
                if (tieneMetodoPago) pagoDb.setMetodoPago(pagoReq.getMetodoPago());
                if (pagoReq.getFechaPago() != null) {
                    pagoDb.setFechaPago(pagoReq.getFechaPago());
                }

                // Si tiene método de pago Y monto > 0 → marcar pago como Pagado (id=2)
                // y matrícula como Activa (id=5)
                if (tieneMetodoPago && tieneMonto) {
                    Estado estadoPagado = new Estado();
                    estadoPagado.setId(2); // 2 = Pagado (tipo PAGO)
                    pagoDb.setEstado(estadoPagado);
                    if (pagoDb.getFechaPago() == null) {
                        pagoDb.setFechaPago(LocalDate.now());
                    }

                    Estado estadoActiva = new Estado();
                    estadoActiva.setId(5); // 5 = Activa (tipo MATRICULA)
                    existing.setEstado(estadoActiva);
                } else {
                    // Mantener estado Pendiente si no hay pago completo
                    Estado estadoPendiente = new Estado();
                    estadoPendiente.setId(4);
                    existing.setEstado(estadoPendiente);
                }

                pagoService.guardar(pagoDb);
            }
        }

        return ResponseEntity.ok(service.guardar(existing));
    }
}
