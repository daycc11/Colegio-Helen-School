package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.Auxiliar;
import com.cibertec.colegio.repository.AuxiliarRepository;

@Service
public class AuxiliarService {

    @Autowired
    private AuxiliarRepository auxiliarRepository;

    public List<Auxiliar> listarTodos() {
        return auxiliarRepository.findAll();
    }
}
