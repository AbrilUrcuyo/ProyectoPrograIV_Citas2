package org.example.backend.presentation.citas;


import org.example.backend.logic.Cita;
import org.example.backend.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController("citasController")
@RequestMapping("/citas")
public class Controller {

    @Autowired
    private Service service;


    @GetMapping("/show")
    public String show(Model model) {
        model.addAttribute("citas", service.findAllCitas());
        return "/presentation/citas/View";
    }

    @GetMapping("/confirmar/{citaId}")
    public void confirmar(@PathVariable("citaId") int citaId) {
        try {
            service.confirmarCita(citaId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cancelar/{citaId}")
    public void cancelar(@PathVariable("citaId") int citaId) {
        try {
            service.cancelarCita(citaId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/completar/{citaId}")
    public void completar(@PathVariable("citaId") int citaId) {
        try {
            if(!service.findCitaById(citaId).getFecha().isAfter(LocalDate.now()))
                service.completarCita(citaId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

    }

    @GetMapping("/anotar/{citaId}")
    public String anotar(@PathVariable("citaId") int citaId) {
        try {
            return service.findCitaById(citaId).getAnotaciones();
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/guardarAnotacion")
    public void anotar(@RequestBody GuardarAnotacionRequest request){
        try {
            service.anotarEnLaCita(request.citaId(), request.anotacion());
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public record GuardarAnotacionRequest(int citaId, String anotacion) {}
}

