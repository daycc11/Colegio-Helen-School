package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "anio_escolar")
public class AnioEscolar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 10)
    private String nombre;

    @Column(nullable = false)
    private Boolean activo;

    public AnioEscolar() {}

    public AnioEscolar(Integer id) {
        this.id = id;
    }
}
