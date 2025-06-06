package org.example.backend.presentation.pacientes;

import org.example.backend.logic.Cita;
import org.example.backend.logic.Medico;
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
    public record MedicoDTO(String id, String nombre, int costoConsulta, String especialidad, String localidad ) {}
    public record CitaDTOsinMedico(Integer id, LocalDate fecha, LocalTime hora, String estado, MedicoDTO medico) { };

    public record FiltroCitasRequest(String estado, String nombreM) {}

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


    @PostMapping("/buscar")
    public List<CitaDTOsinMedico> filtrarCitas(@RequestBody FiltroCitasRequest request) {
        String estado = request.estado();
        String nombreMedico = request.nombreM();

        String idPaciente = service.getUserId();
        List<Cita> citas = service.obtenerCitasPorPaciente(idPaciente);

        return citas.stream()
                .filter(cita ->
                        (estado.equals("Todas") || cita.getEstado().equalsIgnoreCase(estado)) &&
                                (nombreMedico == null || nombreMedico.isEmpty() ||
                                        cita.getIdMedico().getNombre().toLowerCase().contains(nombreMedico.toLowerCase()))
                )
                .map(cita -> {
                    Medico m = cita.getIdMedico();
                    MedicoDTO mDto = new MedicoDTO(
                            m.getId(),
                            m.getNombre(),
                            m.getCostoConsulta(),
                            m.getEspecialidad(),
                            m.getLocalidad()
                    );
                    return new CitaDTOsinMedico(
                            cita.getId(),
                            cita.getFecha(),
                            cita.getHora(),
                            cita.getEstado(),
                            mDto
                    );
                })
                .toList();
    }

}
