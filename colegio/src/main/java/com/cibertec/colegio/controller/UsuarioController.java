package com.cibertec.colegio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller mínimo para mantener compatibilidad con Spring Security form-login.
 * Solo conserva la ruta "/" que Spring Security necesita como loginPage.
 * Todo el resto de la funcionalidad fue migrado a:
 *   - UsuarioRestController (registro, listado vía REST para Angular)
 *   - AuthRestController (login/logout/status para Angular)
 */
@Controller
public class UsuarioController {

    /**
     * Página de login legacy (usada por Spring Security formLogin).
     * El frontend Angular maneja su propio login en localhost:4200/login.
     */
    @GetMapping("/")
    public String loginPage(Model model) {
        return "login";
    }

    /**
     * Menú principal legacy (para compatibilidad con rutas existentes).
     */
    @GetMapping("/menu")
    public String menuPrincipal() {
        return "menu";
    }
}
