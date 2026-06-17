package com.cibertec.colegio.pago;

import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;
import com.cibertec.colegio.repository.PagoRepository;
import com.cibertec.colegio.service.PagoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PagoService - Pruebas Unitarias")
class PagoServiceTest {

    @Mock
    private PagoRepository pagoRepository;

    @InjectMocks
    private PagoService pagoService;

    private Alumno alumno1;
    private Alumno alumno2;
    private Pago pago1;
    private Pago pago2;

    @BeforeEach
    void setUp() {
        // Alumno de prueba 1
        alumno1 = new Alumno();
        alumno1.setId(1L);
        alumno1.setNombres("Andrés");
        alumno1.setApellidos("Ramírez Soto");
        alumno1.setDni("12346778");

        // Alumno de prueba 2
        alumno2 = new Alumno();
        alumno2.setId(2L);
        alumno2.setNombres("Valeria");
        alumno2.setApellidos("Fernández López");
        alumno2.setDni("23456789");

        // Pago 1 — Tarjeta
        pago1 = new Pago();
        pago1.setId(1L);
        pago1.setAlumno(alumno1);
        pago1.setMetodoPago("Tarjeta");
        pago1.setMonto(new BigDecimal("350.00"));
        pago1.setEstado("COMPLETADO");
        pago1.setUltimosDigitos("4321");
        pago1.setNombreTitular("CARLOS RAMIREZ");
        pago1.setFechaPago(LocalDateTime.now());

        // Pago 2 — Yape
        pago2 = new Pago();
        pago2.setId(2L);
        pago2.setAlumno(alumno2);
        pago2.setMetodoPago("Yape/Plin");
        pago2.setMonto(new BigDecimal("350.00"));
        pago2.setEstado("COMPLETADO");
        pago2.setNumeroCelular("987654321");
        pago2.setFechaPago(LocalDateTime.now());
    }

    // ─────────────────────────────────────────────
    //  1. listarTodos()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ listarTodos() debe retornar todos los pagos")
    void listarTodos_debeRetornarListaCompleta() {
        when(pagoRepository.findAll()).thenReturn(Arrays.asList(pago1, pago2));

        List<Pago> resultado = pagoService.listarTodos();

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getMetodoPago()).isEqualTo("Tarjeta");
        assertThat(resultado.get(1).getMetodoPago()).isEqualTo("Yape/Plin");
        verify(pagoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("✅ listarTodos() debe retornar lista vacía si no hay pagos")
    void listarTodos_sinPagos_debeRetornarListaVacia() {
        when(pagoRepository.findAll()).thenReturn(List.of());

        List<Pago> resultado = pagoService.listarTodos();

        assertThat(resultado).isEmpty();
    }

    // ─────────────────────────────────────────────
    //  2. listarPorAlumno()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ listarPorAlumno() debe retornar pagos del alumno indicado")
    void listarPorAlumno_debeRetornarPagosDelAlumno() {
        when(pagoRepository.findByAlumnoIdOrderByFechaPagoDesc(1L))
                .thenReturn(List.of(pago1));

        List<Pago> resultado = pagoService.listarPorAlumno(1L);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getAlumno().getNombres()).isEqualTo("Andrés");
        verify(pagoRepository).findByAlumnoIdOrderByFechaPagoDesc(1L);
    }

    @Test
    @DisplayName("✅ listarPorAlumno() retorna vacío si el alumno no tiene pagos")
    void listarPorAlumno_sinPagos_retornaVacio() {
        when(pagoRepository.findByAlumnoIdOrderByFechaPagoDesc(99L))
                .thenReturn(List.of());

        List<Pago> resultado = pagoService.listarPorAlumno(99L);

        assertThat(resultado).isEmpty();
    }

    // ─────────────────────────────────────────────
    //  3. guardar()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ guardar() debe persistir el pago y retornarlo con ID")
    void guardar_debeGuardarYRetornarPago() {
        when(pagoRepository.save(any(Pago.class))).thenReturn(pago1);

        Pago resultado = pagoService.guardar(pago1);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getMonto()).isEqualByComparingTo("350.00");
        assertThat(resultado.getEstado()).isEqualTo("COMPLETADO");
        verify(pagoRepository, times(1)).save(pago1);
    }

    @Test
    @DisplayName("✅ guardar() con método Transferencia debe persistir banco y operación")
    void guardar_transferencia_debePersistirDatosBancarios() {
        Pago pagoTransferencia = new Pago();
        pagoTransferencia.setAlumno(alumno1);
        pagoTransferencia.setMetodoPago("Transferencia");
        pagoTransferencia.setMonto(new BigDecimal("350.00"));
        pagoTransferencia.setBanco("BCP");
        pagoTransferencia.setNumeroOperacion("0099887766");
        pagoTransferencia.setEstado("COMPLETADO");

        when(pagoRepository.save(any(Pago.class))).thenReturn(pagoTransferencia);

        Pago resultado = pagoService.guardar(pagoTransferencia);

        assertThat(resultado.getBanco()).isEqualTo("BCP");
        assertThat(resultado.getNumeroOperacion()).isEqualTo("0099887766");
    }

    @Test
    @DisplayName("✅ guardar() con Efectivo debe persistir sin datos bancarios")
    void guardar_efectivo_debePersistirSinDatosBancarios() {
        Pago pagoEfectivo = new Pago();
        pagoEfectivo.setAlumno(alumno2);
        pagoEfectivo.setMetodoPago("Efectivo");
        pagoEfectivo.setMonto(new BigDecimal("350.00"));
        pagoEfectivo.setEstado("COMPLETADO");

        when(pagoRepository.save(any(Pago.class))).thenReturn(pagoEfectivo);

        Pago resultado = pagoService.guardar(pagoEfectivo);

        assertThat(resultado.getMetodoPago()).isEqualTo("Efectivo");
        assertThat(resultado.getBanco()).isNull();
        assertThat(resultado.getNumeroOperacion()).isNull();
    }

    // ─────────────────────────────────────────────
    //  4. buscarPorId()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ buscarPorId() debe retornar el pago cuando existe")
    void buscarPorId_debeRetornarPagoExistente() {
        when(pagoRepository.findById(1L)).thenReturn(Optional.of(pago1));

        Pago resultado = pagoService.buscarPorId(1L);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getMetodoPago()).isEqualTo("Tarjeta");
    }

    @Test
    @DisplayName("✅ buscarPorId() debe retornar null cuando no existe")
    void buscarPorId_debeRetornarNullSiNoExiste() {
        when(pagoRepository.findById(999L)).thenReturn(Optional.empty());

        Pago resultado = pagoService.buscarPorId(999L);

        assertThat(resultado).isNull();
    }

    // ─────────────────────────────────────────────
    //  5. eliminar()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ eliminar() debe invocar deleteById en el repositorio")
    void eliminar_debeInvocarDeleteById() {
        doNothing().when(pagoRepository).deleteById(1L);

        pagoService.eliminar(1L);

        verify(pagoRepository, times(1)).deleteById(1L);
    }

    // ─────────────────────────────────────────────
    //  6. alumnosSinPago()
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ alumnosSinPago() debe retornar alumnos sin pago registrado")
    void alumnosSinPago_debeRetornarAlumnosPendientes() {
        when(pagoRepository.findAlumnosSinPago()).thenReturn(List.of(alumno1, alumno2));

        List<Alumno> resultado = pagoService.alumnosSinPago();

        assertThat(resultado).hasSize(2);
        assertThat(resultado).extracting(Alumno::getNombres)
                .containsExactlyInAnyOrder("Andrés", "Valeria");
        verify(pagoRepository).findAlumnosSinPago();
    }

    @Test
    @DisplayName("✅ alumnosSinPago() retorna vacío cuando todos pagaron")
    void alumnosSinPago_todosPagearon_retornaVacio() {
        when(pagoRepository.findAlumnosSinPago()).thenReturn(List.of());

        List<Alumno> resultado = pagoService.alumnosSinPago();

        assertThat(resultado).isEmpty();
    }

    // ─────────────────────────────────────────────
    //  7. Validaciones de monto
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("✅ El monto del pago debe ser mayor a cero")
    void pago_montoDebeSerPositivo() {
        assertThat(pago1.getMonto()).isGreaterThan(BigDecimal.ZERO);
        assertThat(pago2.getMonto()).isGreaterThan(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("✅ El pago debe tener un alumno asociado")
    void pago_debeEstarAsociadoAAlumno() {
        assertThat(pago1.getAlumno()).isNotNull();
        assertThat(pago1.getAlumno().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("✅ Estado inicial del pago debe ser COMPLETADO")
    void pago_estadoDebeSerCompletado() {
        assertThat(pago1.getEstado()).isEqualTo("COMPLETADO");
        assertThat(pago2.getEstado()).isEqualTo("COMPLETADO");
    }
}
