package com.cibertec.colegio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;

import com.cibertec.colegio.model.Grado;
import com.cibertec.colegio.service.GradoService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/grado")
public class GradoController {

	@Autowired
    private GradoService gradoService;



    @GetMapping
    public List<Grado> listar() {
        return gradoService.listarTodos();
    }
    
    @PostMapping
    public Grado crearProducto(@RequestBody Grado grado) {
        return gradoService.guardar(grado);
    }

    @GetMapping("/{id}")
    public Grado obtenerProducto(@PathVariable Integer id) {
        return gradoService.obtenerPorId(id);
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
                    .body(Map.of("mensaje", "No se puede eliminar este grado porque tiene alumnos asignados. Primero cambie a los alumnos a otra aula."));
        }
    }
	
}
