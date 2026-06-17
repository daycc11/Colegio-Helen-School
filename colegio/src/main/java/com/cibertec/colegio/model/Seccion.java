package com.cibertec.colegio.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "seccion")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 5, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "seccion")
    @JsonIgnore
    private List<Alumno> alumnos;

    public Seccion() {}
}
