package com.cibertec.colegio.service;

import java.util.List;

import com.cibertec.colegio.model.Usuario;

public interface UsuarioService {
	

    Usuario guardarUsuario(Usuario usuario);

    List<Usuario> listartodosUsuario();

    boolean login(Usuario usuario);

    Usuario buscarByUsuario(String username);

    List<Usuario> listarPorRol(String nombreRol); 

    List<Usuario> listarAuxiliares();   

}
