package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "aula")
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_grado_nivel_seccion", nullable = false)
    private GradoNivelSeccion gradoNivelSeccion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turno", nullable = false)
    private Turno turno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_anio_escolar", nullable = false)
    private AnioEscolar anioEscolar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_auxiliar", nullable = false)
    private Usuario auxiliar; // Usuario con rol de Auxiliar asignado a este aula

    @Column(nullable = false)
    private Integer capacidad;
    
    @Column(nullable = false)
    private Boolean activo = true;

    @Transient
    private Integer matriculados = 0;

    public Aula() {}
}
