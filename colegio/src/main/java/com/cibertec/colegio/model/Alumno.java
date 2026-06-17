package com.cibertec.colegio.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "alumno")

public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alumno")
    private Long id;

    @Column(name = "nombres", nullable = false)
    private String nombres;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "fecha_nacimiento", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd") 
    private LocalDate fechaNacimiento;


    @Column(name = "dni", unique = true, nullable = false, length = 8)
    private String dni;
    
    @ManyToOne
	@JoinColumn(name = "id_tutor")
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties("alumnos")
	private Tutor tutor;

	@ManyToOne
	@JoinColumn(name = "id_grado")
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties("alumnos")
	private Grado grado;
    
    @Column(name = "fecha_matricula")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaMatricula;

    @Column(name = "fecha_fin_matricula")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFinMatricula;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "monto_pagado", precision = 10, scale = 2)
    private BigDecimal montoPagado;
    
    
    
    
    
    
    
    

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombres() {
		return nombres;
	}

	public void setNombres(String nombres) {
		this.nombres = nombres;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(LocalDate fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getDni() {
		return dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public Grado getGrado() {
		return grado;
	}

	public void setGrado(Grado grado) {
		this.grado = grado;
	}

	public Tutor getTutor() {
		return tutor;
	}

	public void setTutor(Tutor tutor) {
		this.tutor = tutor;
	}

	public LocalDate getFechaMatricula() {
		return fechaMatricula;
	}

	public void setFechaMatricula(LocalDate fechaMatricula) {
		this.fechaMatricula = fechaMatricula;
	}

	public LocalDate getFechaFinMatricula() {
		return fechaFinMatricula;
	}

	public void setFechaFinMatricula(LocalDate fechaFinMatricula) {
		this.fechaFinMatricula = fechaFinMatricula;
	}

	public String getMetodoPago() {
		return metodoPago;
	}

	public void setMetodoPago(String metodoPago) {
		this.metodoPago = metodoPago;
	}

	public BigDecimal getMontoPagado() {
		return montoPagado;
	}

	public void setMontoPagado(BigDecimal montoPagado) {
		this.montoPagado = montoPagado;
	}

}