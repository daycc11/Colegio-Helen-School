package com.cibertec.colegio.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cibertec.colegio.model.Usuario;
import com.cibertec.colegio.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        System.out.println("🔧 Actualizando contraseñas existentes a BCrypt...");
        
        // Actualizar contraseñas de usuarios existentes que están en texto plano
        Usuario mrodriguez = usuarioRepository.findByUsername("mrodriguez").orElse(null);
        if (mrodriguez != null && !mrodriguez.getClave().startsWith("$2a$")) {
            mrodriguez.setClave(passwordEncoder.encode("123456"));
            usuarioRepository.save(mrodriguez);
            System.out.println("✅ Contraseña actualizada para: mrodriguez");
        }
        
        Usuario lgonzales = usuarioRepository.findByUsername("lgonzales").orElse(null);
        if (lgonzales != null && !lgonzales.getClave().startsWith("$2a$")) {
            lgonzales.setClave(passwordEncoder.encode("admin"));
            usuarioRepository.save(lgonzales);
            System.out.println("✅ Contraseña actualizada para: lgonzales");
        }
        
        System.out.println("🚀 Inicialización completada");
        System.out.println("📋 Usuarios disponibles para login:");
        System.out.println("   • mrodriguez / 123456 (Auxiliar)");
        System.out.println("   • lgonzales / admin (Auxiliar)");
    }
}
