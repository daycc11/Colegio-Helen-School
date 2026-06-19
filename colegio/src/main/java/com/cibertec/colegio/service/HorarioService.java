package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Horario;
import com.cibertec.colegio.repository.HorarioRepository;

@Service
public class HorarioService {
    @Autowired
    private HorarioRepository repository;

    public List<Horario> listarTodos() { return repository.findAll(); }
    
    public Horario guardar(Horario entity) {
        // Validación de superposición de horario para el docente
        List<Horario> overlaps = repository.findOverlappingByDocente(
                entity.getCursoDocente().getDocente().getId(),
                entity.getDiaSemana().getId(),
                entity.getHoraInicio(),
                entity.getHoraFin()
        );

        if (!overlaps.isEmpty()) {
            // Si es actualización, asegurarse de no chocar consigo mismo
            boolean isSame = false;
            for (Horario h : overlaps) {
                if (h.getId().equals(entity.getId())) {
                    isSame = true;
                    break;
                }
            }
            if (!isSame || overlaps.size() > 1) {
                throw new RuntimeException("Cruce de horario: El docente ya tiene clases en este rango horario el mismo día.");
            }
        }
        return repository.save(entity);
    }
    
    public void eliminar(Long id) { repository.deleteById(id); }
    
    public List<Horario> listarPorDocente(Integer idDocente) {
        return repository.findByCursoDocente_Docente_Id(idDocente);
    }
    
    public List<Horario> listarPorAula(Integer idNivel, Integer idGrado, Integer idSeccion) {
        return repository.findByAula_GradoNivelSeccion_Nivel_IdAndAula_GradoNivelSeccion_Grado_IdAndAula_GradoNivelSeccion_Seccion_Id(idNivel, idGrado, idSeccion);
    }
}

