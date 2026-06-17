package com.cibertec.colegio.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cibertec.colegio.service.ReporteService;

/**
 * REST Controller para descarga de reportes desde el frontend Angular.
 * Expone endpoints para descargar Excel generado con Apache POI.
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reportes")
public class ReporteRestController {

    @Autowired
    private ReporteService reporteService;

    private String ts() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    }

    @GetMapping("/alumnos/excel")
    public ResponseEntity<byte[]> excelAlumnos() throws IOException {
        byte[] data = reporteService.generarReporteAlumnos();
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        h.setContentDispositionFormData("attachment", "alumnos_" + ts() + ".xlsx");
        return new ResponseEntity<>(data, h, HttpStatus.OK);
    }

    @GetMapping("/tutores/excel")
    public ResponseEntity<byte[]> excelTutores() throws IOException {
        byte[] data = reporteService.generarReporteTutores();
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        h.setContentDispositionFormData("attachment", "tutores_" + ts() + ".xlsx");
        return new ResponseEntity<>(data, h, HttpStatus.OK);
    }

    @GetMapping("/grados/excel")
    public ResponseEntity<byte[]> excelGrados() throws IOException {
        byte[] data = reporteService.generarReporteGrados();
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        h.setContentDispositionFormData("attachment", "grados_" + ts() + ".xlsx");
        return new ResponseEntity<>(data, h, HttpStatus.OK);
    }

    @GetMapping("/completo/excel")
    public ResponseEntity<byte[]> excelCompleto() throws IOException {
        byte[] data = reporteService.generarReporteCompleto();
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        h.setContentDispositionFormData("attachment", "reporte_completo_" + ts() + ".xlsx");
        return new ResponseEntity<>(data, h, HttpStatus.OK);
    }
}
