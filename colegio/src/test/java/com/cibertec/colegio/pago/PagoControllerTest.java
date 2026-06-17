package com.cibertec.colegio.pago;

import com.cibertec.colegio.controller.PagoController;
import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;
import com.cibertec.colegio.service.PagoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PagoController - Pruebas Unitarias")
class PagoControllerTest {

    @Mock
    private PagoService pagoService;

    @InjectMocks
    private PagoController pagoController;

    private Alumno alumno;
    private Pago pago;

    @BeforeEach
    void setUp() {
        alumno = new Alumno();
        alumno.setId(1L);
        alumno.setNombres("Gabriel");
        alumno.setApellidos("Gonzales Torres");
        alumno.setDni("34567890");

        pago = new Pago();
        pago.setId(10L);
        pago.setAlumno(alumno);
        pago.setMetodoPago("Efectivo");
        pago.setMonto(new BigDecimal("350.00"));
        pago.setEstado("COMPLETADO");
        pago.setFechaPago(LocalDateTime.now());
    }

    // ─────────────────────────────────────────────
    //  GET /api/pagos
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ GET /api/pagos → 200 con lista de pagos")
    void listarTodos_debeRetornarListaConStatus200() {
        when(pagoService.listarTodos()).thenReturn(List.of(pago));

        List<Pago> resultado = pagoController.listarTodos();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getId()).isEqualTo(10L);
        verify(pagoService).listarTodos();
    }

    // ─────────────────────────────────────────────
    //  GET /api/pagos/pendientes
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ GET /api/pagos/pendientes → lista de alumnos sin pago")
    void alumnosSinPago_debeRetornarListaDePendientes() {
        when(pagoService.alumnosSinPago()).thenReturn(List.of(alumno));

        List<Alumno> resultado = pagoController.alumnosSinPago();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getDni()).isEqualTo("34567890");
        verify(pagoService).alumnosSinPago();
    }

    @Test
    @DisplayName("✅ GET /api/pagos/pendientes → lista vacía si todos pagaron")
    void alumnosSinPago_todosPagearon_retornaListaVacia() {
        when(pagoService.alumnosSinPago()).thenReturn(List.of());

        List<Alumno> resultado = pagoController.alumnosSinPago();

        assertThat(resultado).isEmpty();
    }

    // ─────────────────────────────────────────────
    //  GET /api/pagos/alumno/{alumnoId}
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ GET /api/pagos/alumno/{id} → pagos del alumno")
    void listarPorAlumno_debeRetornarPagosDelAlumno() {
        when(pagoService.listarPorAlumno(1L)).thenReturn(List.of(pago));

        List<Pago> resultado = pagoController.listarPorAlumno(1L);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getAlumno().getNombres()).isEqualTo("Gabriel");
    }

    // ─────────────────────────────────────────────
    //  POST /api/pagos
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ POST /api/pagos → 200 al crear pago válido")
    void crear_pagoValido_debeRetornar200() {
        when(pagoService.guardar(any(Pago.class))).thenReturn(pago);

        ResponseEntity<Pago> respuesta = pagoController.crear(pago);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(respuesta.getBody()).isNotNull();
        assertThat(respuesta.getBody().getEstado()).isEqualTo("COMPLETADO");
        verify(pagoService).guardar(any(Pago.class));
    }

    @Test
    @DisplayName("❌ POST /api/pagos → 400 si el alumno es null")
    void crear_sinAlumno_debeRetornar400() {
        Pago pagoSinAlumno = new Pago();
        pagoSinAlumno.setMetodoPago("Efectivo");
        pagoSinAlumno.setMonto(new BigDecimal("350.00"));

        ResponseEntity<Pago> respuesta = pagoController.crear(pagoSinAlumno);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(pagoService, never()).guardar(any());
    }

    @Test
    @DisplayName("❌ POST /api/pagos → 400 si el id del alumno es null")
    void crear_alumnoSinId_debeRetornar400() {
        Alumno alumnoSinId = new Alumno(); // sin setId()
        Pago pagoSinIdAlumno = new Pago();
        pagoSinIdAlumno.setAlumno(alumnoSinId);
        pagoSinIdAlumno.setMonto(new BigDecimal("350.00"));

        ResponseEntity<Pago> respuesta = pagoController.crear(pagoSinIdAlumno);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(pagoService, never()).guardar(any());
    }

    // ─────────────────────────────────────────────
    //  GET /api/pagos/{id}
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ GET /api/pagos/{id} → 200 si existe")
    void buscarPorId_existente_debeRetornar200() {
        when(pagoService.buscarPorId(10L)).thenReturn(pago);

        ResponseEntity<Pago> respuesta = pagoController.buscarPorId(10L);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(respuesta.getBody()).isNotNull();
        assertThat(respuesta.getBody().getId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("❌ GET /api/pagos/{id} → 404 si no existe")
    void buscarPorId_noExiste_debeRetornar404() {
        when(pagoService.buscarPorId(999L)).thenReturn(null);

        ResponseEntity<Pago> respuesta = pagoController.buscarPorId(999L);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ─────────────────────────────────────────────
    //  DELETE /api/pagos/{id}
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ DELETE /api/pagos/{id} → 204 No Content")
    void eliminar_debeRetornar204() {
        doNothing().when(pagoService).eliminar(10L);

        ResponseEntity<Void> respuesta = pagoController.eliminar(10L);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(pagoService).eliminar(10L);
    }
}
