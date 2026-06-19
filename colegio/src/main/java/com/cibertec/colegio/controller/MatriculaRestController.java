package com.cibertec.colegio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Matricula> listar() { return service.listarTodos(); }

    @PostMapping
    public Matricula guardar(@RequestBody Matricula entity) {
        if (entity.getPago() == null || entity.getPago().getId() == null) {
            Pago pagoPendiente = new Pago();
            pagoPendiente.setMonto(BigDecimal.ZERO);
            pagoPendiente.setFechaPago(LocalDate.now());
            Estado estadoPendiente = new Estado();
            estadoPendiente.setId(1); // 1 = Pendiente
            pagoPendiente.setEstado(estadoPendiente);
            pagoPendiente = pagoService.guardar(pagoPendiente);
            entity.setPago(pagoPendiente);
            entity.setEstado(estadoPendiente);
        }
        return service.guardar(entity);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }

    @PutMapping("/{id}")
    public Matricula actualizar(@PathVariable Long id, @RequestBody Matricula entity) {
        Matricula existing = service.listarTodos().stream()
                .filter(m -> m.getId().equals(id))
                .findFirst().orElse(null);

        if (existing != null) {
            existing.setAlumno(entity.getAlumno());
            existing.setAula(entity.getAula());
            
            // Actualizar Estado de Matricula
            if (entity.getEstado() != null && entity.getEstado().getId() != null) {
                Estado estadoReq = new Estado();
                estadoReq.setId(entity.getEstado().getId());
                existing.setEstado(estadoReq);
            }

            // Actualizar Pago si viene provisto
            if (entity.getPago() != null && existing.getPago() != null) {
                Pago pagoReq = entity.getPago();
                Pago pagoDb = pagoService.buscarPorId(existing.getPago().getId());
                if (pagoDb != null) {
                    if (pagoReq.getMonto() != null) pagoDb.setMonto(pagoReq.getMonto());
                    if (pagoReq.getMetodoPago() != null && pagoReq.getMetodoPago().getId() != null) {
                        pagoDb.setMetodoPago(pagoReq.getMetodoPago());
                    }
                    if (pagoReq.getFechaPago() != null) pagoDb.setFechaPago(pagoReq.getFechaPago());
                    // Tambien actualizar el estado del pago basado en el estado de la matricula
                    if (entity.getEstado() != null && entity.getEstado().getId() != null) {
                        Estado estadoReq = new Estado();
                        estadoReq.setId(entity.getEstado().getId());
                        pagoDb.setEstado(estadoReq);
                    }
                    pagoService.guardar(pagoDb);
                }
            }
            return service.guardar(existing);
        }
        return null;
    }
}
