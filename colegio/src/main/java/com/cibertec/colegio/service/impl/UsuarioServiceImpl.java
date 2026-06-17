package com.cibertec.colegio.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.Usuario;
import com.cibertec.colegio.repository.UsuarioRepository;
import com.cibertec.colegio.service.UsuarioService;

@Service

public class UsuarioServiceImpl implements UsuarioService {
	


    private final UsuarioRepository usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepositorio, PasswordEncoder passwordEncoder) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario guardarUsuario(Usuario objUsuario) {
        // En este caso NO encriptamos porque usamos NoOpPasswordEncoder
        // Pero dejamos el encoder para que en un futuro, si quieres BCrypt, solo cambies el bean.
        objUsuario.setClave(passwordEncoder.encode(objUsuario.getClave()));
        return usuarioRepositorio.save(objUsuario);
    }

    @Override
    public List<Usuario> listartodosUsuario() {
        return usuarioRepositorio.findAll();
    }

    @Override
    public boolean login(Usuario usuario) {
        System.out.println("Usuario ingresado: " + usuario.getUsername());
        System.out.println("Clave ingresada: " + usuario.getClave());

        Optional<Usuario> entidadOpt = usuarioRepositorio.findByUsername(usuario.getUsername());

        if (entidadOpt.isEmpty()) {
            System.out.println("⚠️ Usuario no encontrado");
            return false;
        }

        Usuario entidad = entidadOpt.get();

        // Aquí usamos el passwordEncoder inyectado (NoOpPasswordEncoder)
        boolean match = passwordEncoder.matches(usuario.getClave(), entidad.getClave());

        System.out.println("Clave en BD: " + entidad.getClave());
        System.out.println("¿Password válido?: " + match);

        return match;
    }

    @Override
    public Usuario buscarByUsuario(String username) {
        return usuarioRepositorio.findByUsername(username).orElse(null);
    }
    
    @Override
    public List<Usuario> listarPorRol(String nombreRol) {
        return usuarioRepositorio.findByRolNombre(nombreRol);
    }

    @Override
    public List<Usuario> listarAuxiliares() {
        return usuarioRepositorio.findByRolNombre("Auxiliar");
    }

}
