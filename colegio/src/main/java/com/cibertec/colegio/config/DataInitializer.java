package com.cibertec.colegio.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cibertec.colegio.model.Rol;
import com.cibertec.colegio.model.Usuario;
import com.cibertec.colegio.repository.RolRepository;
import com.cibertec.colegio.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Rol auxiliar = rolRepository.findByNombre("Auxiliar").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("Auxiliar");
            return rolRepository.save(rol);
        });

        if (usuarioRepository.count() == 0) {
            crearUsuario("mrodriguez", "123456", "María", "Rodríguez", auxiliar);
            crearUsuario("lgonzales", "admin", "Luis", "Gonzales", auxiliar);
            System.out.println("Usuarios iniciales creados en PostgreSQL");
        }

        actualizarClaveSiPlano("mrodriguez", "123456");
        actualizarClaveSiPlano("lgonzales", "admin");

        System.out.println("Usuarios disponibles para login:");
        System.out.println("   mrodriguez / 123456 (Auxiliar)");
        System.out.println("   lgonzales / admin (Auxiliar)");
    }

    private void crearUsuario(String username, String clave, String nombres, String apellidos, Rol rol) {
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setClave(passwordEncoder.encode(clave));
        usuario.setNombres(nombres);
        usuario.setApellidos(apellidos);
        usuario.setRol(rol);
        usuarioRepository.save(usuario);
    }

    private void actualizarClaveSiPlano(String username, String clavePlana) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            if (!usuario.getClave().startsWith("$2a$")) {
                usuario.setClave(passwordEncoder.encode(clavePlana));
                usuarioRepository.save(usuario);
            }
        });
    }
}
