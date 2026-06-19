package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.Horario;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    List<Horario> findByCursoDocente_Docente_Id(Integer idDocente);

    List<Horario> findByAula_GradoNivelSeccion_Nivel_IdAndAula_GradoNivelSeccion_Grado_IdAndAula_GradoNivelSeccion_Seccion_Id(
            Integer idNivel, Integer idGrado, Integer idSeccion);

    @Query("SELECT h FROM Horario h WHERE h.cursoDocente.docente.id = :idDocente " +
           "AND h.diaSemana.id = :idDia " +
           "AND ((h.horaInicio < :horaFin AND h.horaFin > :horaInicio))")
    List<Horario> findOverlappingByDocente(
            @Param("idDocente") Integer idDocente,
            @Param("idDia") Integer idDia,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin);
}

