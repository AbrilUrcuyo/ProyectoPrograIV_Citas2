package org.example.backend.presentation.index;


import org.example.backend.logic.Cita;
import org.example.backend.logic.Medico;
import org.example.backend.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@RestController("indexController")
@RequestMapping("/")
public class Controller {
    @Autowired
    private Service service;

    public record CitaDto(Integer id, LocalDate fecha, LocalTime hora) { }
    public record HorarioDTO(Integer id, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin){}
    public record MedicoDto(String id, String nombre, String especialidad, int costoConsulta, String localidad, int frecCitas, List<HorarioDTO> horarios, List<CitaDto> citasOcupadas) { }
    public record BuscarMedicoRequest(String especialidad, String localidad) {}
    @GetMapping
    public List<MedicoDto> index() {
        List<Medico> medicos = service.medicosAceptados();

        return medicos.stream().map(medico -> {
            List<HorarioDTO> horariosDto = medico.getHorarios().stream()
                    .map(h -> new HorarioDTO(
                            h.getId(),
                            h.getDiaSemana(),
                            h.getHoraInicio(),
                            h.getHoraFin()
                    ))
                    .toList();

            List<CitaDto> citasDto = medico.getCitas().stream().map(
                    c -> new CitaDto(
                            c.getId(),
                            c.getFecha(),
                            c.getHora()
                    )
            ).toList();

            return new MedicoDto(
                    medico.getId(),
                    medico.getNombre(),
                    medico.getEspecialidad(),
                    medico.getCostoConsulta(),
                    medico.getLocalidad(),
                    medico.getFrecCitas(),
                    horariosDto,
                    citasDto
            );
        }).toList();
    }

    @PostMapping("buscar")
    public List<MedicoDto> medicosFiltrado(@RequestBody BuscarMedicoRequest request) {
        String especialidad = request.especialidad() != null ? request.especialidad().toLowerCase() : "";
        String localidad = request.localidad() != null ? request.localidad().toLowerCase() : "";

        List<Medico> medicos = service.medicosAceptados();

        return medicos.stream()
                .filter(m -> {
                    String mEspecialidad = m.getEspecialidad() != null ? m.getEspecialidad().toLowerCase() : "";
                    String mLocalidad = m.getLocalidad() != null ? m.getLocalidad().toLowerCase() : "";

                    boolean matchEspecialidad = especialidad.isEmpty() || mEspecialidad.contains(especialidad);
                    boolean matchLocalidad = localidad.isEmpty() || mLocalidad.contains(localidad);

                    return matchEspecialidad && matchLocalidad;
                })
                .map(medico -> {
                    List<HorarioDTO> horariosDto = medico.getHorarios().stream()
                            .map(h -> new HorarioDTO(h.getId(), h.getDiaSemana(), h.getHoraInicio(), h.getHoraFin()))
                            .toList();

                    List<CitaDto> citasDto = medico.getCitas().stream()
                            .map(c -> new CitaDto(c.getId(), c.getFecha(), c.getHora()))
                            .toList();

                    return new MedicoDto(
                            medico.getId(),
                            medico.getNombre(),
                            medico.getEspecialidad(),
                            medico.getCostoConsulta(),
                            medico.getLocalidad(),
                            medico.getFrecCitas(),
                            horariosDto,
                            citasDto
                    );
                })
                .toList();
    }



}
