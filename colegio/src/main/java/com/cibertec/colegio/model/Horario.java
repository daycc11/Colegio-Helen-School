package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "horario")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_aula", nullable = false)
    private Aula aula;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curso_docente", nullable = false)
    private CursoDocente cursoDocente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_dia_semana", nullable = false)
    private DiaSemana diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private java.time.LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private java.time.LocalTime horaFin;

    public Horario() {}
}
