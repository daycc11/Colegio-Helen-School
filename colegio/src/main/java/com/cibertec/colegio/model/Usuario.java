package com.cibertec.colegio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table (name ="usuario")
public class Usuario {
	

	@Id
	@Column (name = "idusuario")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column (name ="nombres")
	private String nombres;
	
	@Column (name ="apellidos")
	private String apellidos;
	
	@Column (name ="username")
	private String username;
	
	@Column (name ="clave")
	private String clave;
	
	@ManyToOne
	@JoinColumn(name = "idrol") 
	private Rol rol;
	
	
	public Usuario (String nombres, String apellidos, String username ,String clave , Rol rol, String nombre ) {
		this.nombres=nombres;
		this.apellidos=apellidos ;
		this.username =username ;
		this.clave=clave ;
		this.rol=rol;
	}


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
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


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getClave() {
		return clave;
	}


	public void setClave(String clave) {
		this.clave = clave;
	}


	public Rol getRol() {
		return rol;
	}


	public void setRol(Rol rol) {
		this.rol = rol;
	}


}
