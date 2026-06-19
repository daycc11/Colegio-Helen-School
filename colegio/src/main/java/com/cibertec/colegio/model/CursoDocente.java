package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "curso_docente")
public class CursoDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso_docente")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_docente", nullable = false)
    private Docente docente;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1: Activo, 0: Inactivo

    public CursoDocente() {}
}
