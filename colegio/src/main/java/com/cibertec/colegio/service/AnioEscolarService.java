package com.cibertec.colegio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cibertec.colegio.model.AnioEscolar;
import com.cibertec.colegio.repository.AnioEscolarRepository;

@Service
public class AnioEscolarService {

    @Autowired
    private AnioEscolarRepository anioEscolarRepository;

    public List<AnioEscolar> listarTodos() {
        return anioEscolarRepository.findAll();
    }

    public AnioEscolar guardar(AnioEscolar anioEscolar) {
        return anioEscolarRepository.save(anioEscolar);
    }
}
