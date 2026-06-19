package com.cibertec.colegio.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cibertec.colegio.model.Rol;
import com.cibertec.colegio.model.Usuario;
import com.cibertec.colegio.repository.UsuarioRepository;
import com.cibertec.colegio.service.RolService;
import com.cibertec.colegio.service.UsuarioService;

/**
 * REST Controller para gestión de usuarios desde el frontend Angular.
 * Expone endpoints para registrar usuarios y listar roles.
 */
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/usuario")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RolService rolService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * GET /api/usuario
     * Lista todos los usuarios registrados.
     */
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    /**
     * GET /api/usuario/auxiliares
     * Devuelve la lista de usuarios con el rol de Auxiliar.
     */
    @GetMapping("/auxiliares")
    public ResponseEntity<List<Usuario>> listarAuxiliares() {
        return ResponseEntity.ok(usuarioRepository.findByRolNombre("Auxiliar"));
    }

    /**
     * GET /api/usuario/roles
     * Devuelve la lista de roles disponibles (para el formulario de registro).
     */
    @GetMapping("/roles")
    public ResponseEntity<List<Rol>> listarRoles() {
        return ResponseEntity.ok(rolService.listarTodosRol());
    }

    /**
     * POST /api/usuario/registrar
     * Registra un nuevo usuario en el sistema.
     * Body: { "nombres": "", "apellidos": "", "username": "", "clave": "", "rol": { "id": 1 } }
     */
    @PostMapping("/registrar")
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();

        // Validaciones básicas
        if (usuario.getNombres() == null || usuario.getNombres().isBlank()) {
            response.put("success", false);
            response.put("campo", "nombres");
            response.put("mensaje", "Los nombres son obligatorios");
            return ResponseEntity.badRequest().body(response);
        }

        if (usuario.getApellidos() == null || usuario.getApellidos().isBlank()) {
            response.put("success", false);
            response.put("campo", "apellidos");
            response.put("mensaje", "Los apellidos son obligatorios");
            return ResponseEntity.badRequest().body(response);
        }

        if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
            response.put("success", false);
            response.put("campo", "username");
            response.put("mensaje", "El usuario es obligatorio");
            return ResponseEntity.badRequest().body(response);
        }

        if (usuario.getClave() == null || usuario.getClave().isBlank()) {
            response.put("success", false);
            response.put("campo", "clave");
            response.put("mensaje", "La clave es obligatoria");
            return ResponseEntity.badRequest().body(response);
        }

        if (usuario.getRol() == null || usuario.getRol().getId() == null) {
            response.put("success", false);
            response.put("campo", "rol");
            response.put("mensaje", "Debe seleccionar un rol");
            return ResponseEntity.badRequest().body(response);
        }

        // Verificar si el username ya existe
        if (usuarioService.buscarByUsuario(usuario.getUsername()) != null) {
            response.put("success", false);
            response.put("campo", "username");
            response.put("mensaje", "Ya existe una cuenta con ese nombre de usuario");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Obtener el rol completo
        Rol rol = rolService.buscarById(usuario.getRol().getId());
        if (rol == null) {
            response.put("success", false);
            response.put("mensaje", "Rol no válido");
            return ResponseEntity.badRequest().body(response);
        }
        usuario.setRol(rol);

        // Guardar el usuario
        usuarioService.guardarUsuario(usuario);

        response.put("success", true);
        response.put("mensaje", "Usuario registrado correctamente");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<Map<String, Object>> actualizarPerfil(@PathVariable Integer id, @RequestBody Usuario usuarioReq) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioDB = usuarioRepository.findById(id).orElse(null);
        
        if (usuarioDB == null) {
            response.put("success", false);
            response.put("mensaje", "Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        usuarioDB.setNombres(usuarioReq.getNombres());
        usuarioDB.setApellidos(usuarioReq.getApellidos());
        usuarioDB.setUsername(usuarioReq.getUsername());
        
        usuarioRepository.save(usuarioDB);
        
        response.put("success", true);
        response.put("mensaje", "Perfil actualizado con éxito");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/foto")
    public ResponseEntity<Map<String, Object>> actualizarFoto(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioDB = usuarioRepository.findById(id).orElse(null);
        
        if (usuarioDB == null) {
            response.put("success", false);
            response.put("mensaje", "Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        usuarioDB.setFoto(body.get("fotoUrl"));
        usuarioRepository.save(usuarioDB);
        
        response.put("success", true);
        response.put("mensaje", "Foto actualizada con éxito");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/clave")
    public ResponseEntity<Map<String, Object>> actualizarClave(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioDB = usuarioRepository.findById(id).orElse(null);
        
        if (usuarioDB == null) {
            response.put("success", false);
            response.put("mensaje", "Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        String claveActual = body.get("claveActual");
        String nuevaClave = body.get("nuevaClave");

        // Validar clave actual llamando a UsuarioService.login (que usa PasswordEncoder internamente)
        Usuario tempUser = new Usuario();
        tempUser.setUsername(usuarioDB.getUsername());
        tempUser.setClave(claveActual);

        if (!usuarioService.login(tempUser)) {
            response.put("success", false);
            response.put("mensaje", "La contraseña actual es incorrecta");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        usuarioDB.setClave(nuevaClave);
        // guardarUsuario internamente encripta si el encoder lo permite
        usuarioService.guardarUsuario(usuarioDB);

        response.put("success", true);
        response.put("mensaje", "Contraseña actualizada con éxito");
        return ResponseEntity.ok(response);
    }
}
