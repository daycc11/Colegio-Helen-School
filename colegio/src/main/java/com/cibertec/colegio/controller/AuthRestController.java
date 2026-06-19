package com.cibertec.colegio.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Usuario;
import com.cibertec.colegio.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * REST Controller para autenticación desde el frontend Angular.
 * Usa sesión HTTP con cookies (withCredentials en Angular).
 */
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     * Autentica al usuario y crea una sesión HTTP.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Guardar la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Crear o renovar la sesión HTTP
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT",
                SecurityContextHolder.getContext());

            // Obtener datos del usuario autenticado
            Usuario usuario = usuarioService.buscarByUsuario(username);

            response.put("success", true);
            response.put("mensaje", "Login exitoso");
            if (usuario != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", usuario.getId());
                userData.put("nombres", usuario.getNombres());
                userData.put("apellidos", usuario.getApellidos());
                userData.put("username", usuario.getUsername());
                userData.put("rol", usuario.getRol() != null ? usuario.getRol().getNombre() : "");
                userData.put("fotoUrl", usuario.getFoto());
                response.put("usuario", userData);
            }

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            response.put("success", false);
            response.put("mensaje", "Usuario o clave incorrectos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("mensaje", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * POST /api/auth/logout
     * Cierra la sesión actual del usuario.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        response.put("success", true);
        response.put("mensaje", "Sesión cerrada correctamente");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/status
     * Verifica si hay una sesión activa y retorna datos del usuario.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()
                && !auth.getPrincipal().equals("anonymousUser")) {

            String username = auth.getName();
            Usuario usuario = usuarioService.buscarByUsuario(username);

            response.put("autenticado", true);
            if (usuario != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", usuario.getId());
                userData.put("nombres", usuario.getNombres());
                userData.put("apellidos", usuario.getApellidos());
                userData.put("username", usuario.getUsername());
                userData.put("rol", usuario.getRol() != null ? usuario.getRol().getNombre() : "");
                userData.put("fotoUrl", usuario.getFoto());
                response.put("usuario", userData);
            }
        } else {
            response.put("autenticado", false);
        }

        return ResponseEntity.ok(response);
    }
}
