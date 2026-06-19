package com.cibertec.colegio.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
@RequestMapping("/api/pagos")
public class PagoRestController {

    @Autowired
    private PagoService pagoService;

    @Autowired
    private MatriculaService matriculaService;

    // Obtener los alumnos con matrícula pendiente de pago
    @GetMapping("/pendientes")
    public ResponseEntity<List<Map<String, Object>>> listarPendientes() {
        List<Matricula> todas = matriculaService.listarTodos();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Matricula m : todas) {
            if (m.getEstado() != null && m.getEstado().getNombre().equalsIgnoreCase("Pendiente")) {
                Map<String, Object> map = new HashMap<>();
                map.put("idMatricula", m.getId());
                map.put("id", m.getAlumno().getId());
                map.put("nombres", m.getAlumno().getNombres());
                map.put("apellidos", m.getAlumno().getApellidos());
                map.put("dni", m.getAlumno().getDni());
                map.put("idPago", m.getPago().getId());
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }

    // Procesar el pago
    @PostMapping("/procesar")
    public ResponseEntity<?> procesarPago(@RequestBody Map<String, Object> payload) {
        try {
            Long idPago = Long.valueOf(payload.get("idPago").toString());
            Long idMatricula = Long.valueOf(payload.get("idMatricula").toString());
            String montoStr = payload.get("monto").toString();
            
            // Buscar el Pago y actualizarlo
            Pago pago = pagoService.buscarPorId(idPago);
            if (pago == null) {
                return ResponseEntity.badRequest().body("Pago no encontrado");
            }
            
            pago.setMonto(new java.math.BigDecimal(montoStr));
            pago.setFechaPago(LocalDate.now());

            // El modelo Pago simplificado solo maneja: monto, fechaPago, estado, metodoPago

            // Asumiendo que el ID 2 es COMPLETADO. Asegurarse que exista.
            Estado estadoCompletado = new Estado();
            estadoCompletado.setId(2); 
            pago.setEstado(estadoCompletado);
            
            // Asignar el método de pago desde el payload
            if (payload.containsKey("idMetodoPago")) {
                com.cibertec.colegio.model.MetodoPago mp = new com.cibertec.colegio.model.MetodoPago();
                mp.setId(Integer.parseInt(payload.get("idMetodoPago").toString()));
                pago.setMetodoPago(mp);
            }

            pagoService.guardar(pago);
            
            // Actualizar la matrícula a completada
            Matricula matricula = matriculaService.listarTodos().stream()
                .filter(m -> m.getId().equals(idMatricula)).findFirst().orElse(null);
                
            if (matricula != null) {
                matricula.setEstado(estadoCompletado);
                matriculaService.guardar(matricula);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar el pago: " + e.getMessage());
        }
    }
}
