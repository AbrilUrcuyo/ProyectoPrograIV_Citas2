package org.example.backend.presentation.pacientes;

import org.example.backend.logic.Cita;
import org.example.backend.logic.Service;
import org.example.backend.logic.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController("pacientesController")
@RequestMapping("/pacientes")
public class Controller {

    @Autowired
    private Service service;

    public record CitaDto(
            Integer id,
            String fecha,
            String hora,
            String estado,
            MedicoDtoSinCita medico,
            String pacienteNombre
    ) {}

    public record MedicoDtoSinCita(
            String id,
            String nombre,
            String especialidad,
            String localidad,
            int costoConsulta
    ) {}
    public record CitasPacienteResponse(
            String pacienteNombre,
            List<CitaDto> citas
    ) {}

    public record ConfirmarCitaRequest(
            String medicoId,
            String fecha,
            String hora
    ) {}


    @GetMapping("/citas")
    public CitasPacienteResponse getCitasPaciente() {
        String pacienteId = service.getUserId();
        Paciente paciente = service.findPacienteById(pacienteId);
        String pacienteNombre = paciente.getNombre();
        Set<Cita> citas = paciente.getCitas();

        List<CitaDto> lista = citas.stream().map(cita -> new CitaDto(
                cita.getId(),
                cita.getFecha().toString(),
                cita.getHora().toString(),
                cita.getEstado(),
                new MedicoDtoSinCita(
                        cita.getIdMedico().getId(),
                        cita.getIdMedico().getNombre(),
                        cita.getIdMedico().getEspecialidad(),
                        cita.getIdMedico().getLocalidad(),
                        cita.getIdMedico().getCostoConsulta()
                ),
                pacienteNombre
        )).toList();

        return new CitasPacienteResponse(pacienteNombre, lista);
    }
    @PostMapping("/confirmarCita")
    public ResponseEntity<?> confirmarCita(@RequestBody ConfirmarCitaRequest request) {
        String pacienteId = service.getUserId();

        try {
            LocalDate fecha = LocalDate.parse(request.fecha());
            LocalTime hora = LocalTime.parse(request.hora());

            service.registrarCita(pacienteId, request.medicoId(), fecha, hora);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Datos inválidos para confirmar la cita");
        }
    }


}


//@PostMapping("/citas/confirmar")
//public void confirmarCita(@RequestBody CitaDto cita) {
//    String cedula = service.getUserId();
//
//
//    String idMedico = request.getIdM();
//    LocalDate fecha = LocalDate.parse(request.getFecha());
//    LocalTime hora = LocalTime.parse(request.getHora());
//    service.registrarCita(cedula, idMedico, fecha, hora);
//    return ResponseEntity.ok().build();
//}


//
//    @GetMapping("/confirmarCita/{idM}/{fecha}/{hora}")
//    public String confirmarCita(Model model, @AuthenticationPrincipal(expression = "usuario")Usuario usuario, @PathVariable("idM") String idM, @PathVariable("fecha") LocalDate fecha, @PathVariable("hora") LocalTime hora) {
////        LocalDate date = LocalDate.parse(fecha, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
////        LocalTime hour = LocalTime.parse(hora, DateTimeFormatter.ofPattern("hh:mm"));
//        String idP = usuario.getId();
//        service.registrarCita(idP, idM, fecha, hora);
//        return "redirect:/presentation/pacientes/appointment";
//    }
//
//    @GetMapping("/appointment")
//    public String appointment(Model model, @AuthenticationPrincipal(expression = "usuario")Usuario usuario) {
//        String id = usuario.getId();
//        model.addAttribute("paciente", service.findPacienteById(id));
//
//
//        Set<Cita> citas = service.findPacienteById(id).getCitas();
//
//        LocalDate fechaActual = LocalDate.now();
//        LocalTime horaActual = LocalTime.now();
//
//        List<Cita> citasOrdenadas = citas.stream()
//                .sorted((c1, c2) -> {
//                    long diasDiferencia1 = Math.abs(ChronoUnit.DAYS.between(c1.getFecha(), fechaActual));
//                    long diasDiferencia2 = Math.abs(ChronoUnit.DAYS.between(c2.getFecha(), fechaActual));
//
//                    if (diasDiferencia1 != diasDiferencia2) {
//                        return Long.compare(diasDiferencia1, diasDiferencia2);
//                    }
//
//                    if (c1.getFecha().equals(fechaActual) && c2.getFecha().equals(fechaActual)) {
//                        long minutosDiferencia1 = Math.abs(ChronoUnit.MINUTES.between(c1.getHora(), horaActual));
//                        long minutosDiferencia2 = Math.abs(ChronoUnit.MINUTES.between(c2.getHora(), horaActual));
//                        return Long.compare(minutosDiferencia1, minutosDiferencia2);
//                    }
//
//                    return c1.getHora().compareTo(c2.getHora());
//                })
//                .collect(Collectors.toList());
//
//        model.addAttribute("citas", citasOrdenadas);
//
//        return "/presentation/pacientes/History";
//    }
//    @PostMapping("/appointment/buscar")
//    public String search(Model model, @AuthenticationPrincipal(expression = "usuario")Usuario usuario, @RequestParam("estado") String estado, @RequestParam("doctor") String doctor) {
//        String id =  usuario.getId();
//        model.addAttribute("paciente", service.findPacienteById(id));
//
//        Set<Cita> citas = service.findPacienteById(id).getCitas();
//
//        List<Cita> citasOrdenadas = citas.stream()
//                .sorted((c1, c2) -> {
//                    int compareFecha = c2.getFecha().compareTo(c1.getFecha());
//                    if (compareFecha == 0) {
//                        return c2.getHora().compareTo(c1.getHora());
//                    }
//                    return compareFecha;
//                })
//                .collect(Collectors.toList());
//
//        if(!Objects.equals(estado, "Todas")){
//            citasOrdenadas.removeIf(cita -> !cita.getEstado().equals(estado));
//        }
//
//        if(!Objects.equals(doctor, "")){
//            citasOrdenadas.removeIf(cita -> !cita.getIdMedico().getNombre().equals(doctor));
//        }
//
//        model.addAttribute("citas", citasOrdenadas);
//
//        return "/presentation/pacientes/History";
//    }
//
//    @GetMapping("/perfilP")
//    public String perfilP(Model model,@AuthenticationPrincipal(expression = "usuario")Usuario usuario) {
//        String id =  usuario.getId();
//        model.addAttribute("id",id);
//        return "/presentation/pacientes/perfilPaciente";
//    }
//
//    @PostMapping("/actualizar")
//    public String actualizarPaciente(Model model, @RequestParam("id") String id, @RequestParam("padecimientos") String padecimientos) {
//        service.actualizarPaciente(id, padecimientos);
//        return "redirect:/presentation/usuarios/index/show";
//    }



