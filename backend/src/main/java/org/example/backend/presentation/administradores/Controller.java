package org.example.backend.presentation.administradores;


import org.example.backend.logic.Medico;
import org.example.backend.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController("administradoresController")
@RequestMapping("/admin")
public class Controller {

    @Autowired
    private Service service;


    public record MedicoDTOPendiente(String id, String nombre){}
    @GetMapping
    public List<MedicoDTOPendiente> readPendientes(){
        return service.medicosPendientes().stream()
                .map(medico -> new MedicoDTOPendiente(
                        medico.getId(),
                        medico.getNombre()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/{idMedico}/aprobar")
    public void aprobarMedico(@PathVariable String idMedico){
        service.actualizarEstadoMedico(idMedico, "Aprobado");
    }

    @PostMapping("/{idMedico}/rechazar")
    public void rechazarMedico(@PathVariable String idMedico){
        service.actualizarEstadoMedico(idMedico, "Rechazado");
    }
}

