package com.cibertec.colegio.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "grado")

public class Grado {

	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

	    @Column(nullable = false, length = 50)
	    private String nombre;

	    @Column(nullable = false, length = 5)
	    private String seccion;

		@Column(name = "profesor_encargado", length = 100)
		private String profesorEncargado;


	    // Si quieres ver cuántos alumnos están asociados a este grado
	    @OneToMany(mappedBy = "grado")
		@com.fasterxml.jackson.annotation.JsonIgnore
		private List<Alumno> alumnos;

         
	    

		public Grado() {
			
		}



		public Integer getId() {
			return id;
		}



		public void setId(Integer id) {
			this.id = id;
		}



		public String getNombre() {
			return nombre;
		}



		public void setNombre(String nombre) {
			this.nombre = nombre;
		}



		public String getSeccion() {
			return seccion;
		}



		public void setSeccion(String seccion) {
			this.seccion = seccion;
		}



		public List<Alumno> getAlumnos() {
			return alumnos;
		}



		public void setAlumnos(List<Alumno> alumnos) {
			this.alumnos = alumnos;
		}

	    public String getProfesorEncargado() {
			return profesorEncargado;
		}

		public void setProfesorEncargado(String profesorEncargado) {
			this.profesorEncargado = profesorEncargado;
		}
				
}
