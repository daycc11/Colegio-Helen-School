package com.cibertec.colegio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "grado_nivel_seccion")
public class GradoNivelSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_grado", nullable = false)
    private Grado grado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_nivel", nullable = false)
    private Nivel nivel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_seccion", nullable = false)
    private Seccion seccion;

    public GradoNivelSeccion() {}
}
