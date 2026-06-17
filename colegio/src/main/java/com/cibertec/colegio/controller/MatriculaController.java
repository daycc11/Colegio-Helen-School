package com.cibertec.colegio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Grado;
import com.cibertec.colegio.model.Tutor;
import com.cibertec.colegio.service.AlumnoService;
import com.cibertec.colegio.service.GradoService;
import com.cibertec.colegio.service.TutorService;

@Controller
@RequestMapping("/matricula")
public class MatriculaController {

    @Autowired
    private AlumnoService alumnoService;
    
    @Autowired
    private GradoService gradoService;
    
    @Autowired
    private TutorService tutorService;

    // Vista principal de matrículas
    @GetMapping
    public String listarMatriculas(Model model) {
        List<Alumno> alumnos = alumnoService.listarTodos();
        model.addAttribute("listaAlumnos", alumnos);
        return "matricula";
    }

    // Formulario para nueva matrícula
    @GetMapping("/nueva")
    public String nuevaMatricula(Model model) {
        model.addAttribute("alumno", new Alumno());
        model.addAttribute("listaGrados", gradoService.listarTodos());
        model.addAttribute("listaTutores", tutorService.listarTodos());
        return "nueva-matricula";
    }

    // Procesar nueva matrícula
    @PostMapping("/guardar")
    public String guardarMatricula(@ModelAttribute("alumno") Alumno alumno, 
                                 BindingResult result, Model model) {
        
        // Validaciones
        if (alumno.getNombres() == null || alumno.getNombres().isEmpty()) {
            result.rejectValue("nombres", null, "Los nombres son obligatorios");
        }
        
        if (alumno.getApellidos() == null || alumno.getApellidos().isEmpty()) {
            result.rejectValue("apellidos", null, "Los apellidos son obligatorios");
        }
        
        if (alumno.getDni() == null || alumno.getDni().isEmpty()) {
            result.rejectValue("dni", null, "El DNI es obligatorio");
        }
        
        if (alumno.getFechaNacimiento() == null) {
            result.rejectValue("fechaNacimiento", null, "La fecha de nacimiento es obligatoria");
        }
        
        if (alumno.getGrado() == null || alumno.getGrado().getId() == null) {
            result.rejectValue("grado.id", null, "Debe seleccionar un grado");
        }
        
        if (alumno.getTutor() == null || alumno.getTutor().getId() == null) {
            result.rejectValue("tutor.id", null, "Debe seleccionar un tutor");
        }
        
        // Validar DNI duplicado
        if (alumno.getDni() != null && !alumno.getDni().isEmpty()) {
            List<Alumno> alumnosExistentes = alumnoService.listarTodos();
            boolean dniExiste = alumnosExistentes.stream()
                .anyMatch(a -> a.getDni().equals(alumno.getDni()));
            if (dniExiste) {
                result.rejectValue("dni", null, "Ya existe un alumno con este DNI");
            }
        }

        if (result.hasErrors()) {
            model.addAttribute("listaGrados", gradoService.listarTodos());
            model.addAttribute("listaTutores", tutorService.listarTodos());
            return "nueva-matricula";
        }

        // Obtener las entidades completas
        Grado gradoSeleccionado = gradoService.obtenerPorId(alumno.getGrado().getId());
        Tutor tutorSeleccionado = tutorService.obtenerPorId(alumno.getTutor().getId());
        
        alumno.setGrado(gradoSeleccionado);
        alumno.setTutor(tutorSeleccionado);

        // Guardar el alumno (matrícula)
        alumnoService.guardar(alumno);
        
        return "redirect:/matricula?success";
    }
}
