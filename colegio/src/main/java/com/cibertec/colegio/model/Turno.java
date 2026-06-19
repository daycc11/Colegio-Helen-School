package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "hora_inicio")
    private java.time.LocalTime horaInicio;

    @Column(name = "hora_fin")
    private java.time.LocalTime horaFin;

    public Turno() {}

    public Turno(Integer id) {
        this.id = id;
    }
}
