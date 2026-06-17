package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Alumno;
import com.cibertec.colegio.model.Pago;
import com.cibertec.colegio.repository.PagoRepository;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public List<Pago> listarTodos() {
        return pagoRepository.findAll();
    }

    public List<Pago> listarPorAlumno(Long alumnoId) {
        return pagoRepository.findByAlumnoIdOrderByFechaPagoDesc(alumnoId);
    }

    public Pago guardar(Pago pago) {
        return pagoRepository.save(pago);
    }

    public Pago buscarPorId(Long id) {
        return pagoRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        pagoRepository.deleteById(id);
    }

    /** Retorna alumnos que aún no tienen ningún pago */
    public List<Alumno> alumnosSinPago() {
        return pagoRepository.findAlumnosSinPago();
    }
}
