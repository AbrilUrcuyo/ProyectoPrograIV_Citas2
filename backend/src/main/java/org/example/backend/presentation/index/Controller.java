package org.example.backend.presentation.index;


import org.example.backend.logic.Medico;
import org.example.backend.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController("indexController")
@RequestMapping("/")
public class Controller {
    @Autowired
    private Service service;

    public record CitaDto(Integer id, LocalDate fecha, LocalTime hora, String estado, String anotaciones) { }
    public record HorarioDTO(Integer id, Integer diaSemana, LocalTime horaInicio, LocalTime horaFin){}
    public record MedicoDto(String id, String nombre, String especialidad,int costoConsulta,String localidad, List<CitaDto> citas, List<HorarioDTO> horarios) { }
    @GetMapping
    public List<MedicoDto> index() {
        List<Medico> medicos = service.medicosAceptados();

        return medicos.stream().map(medico -> {
            List<CitaDto> citasDto = medico.getCitas().stream()
                    .map(cita -> new CitaDto(
                            cita.getId(),
                            cita.getFecha(),
                            cita.getHora(),
                            cita.getEstado(),
                            cita.getAnotaciones()
                    ))
                    .toList();

            List<HorarioDTO> horariosDto = medico.getHorarios().stream()
                    .map(h -> new HorarioDTO(
                            h.getId(),
                            h.getDiaSemana(),
                            h.getHoraInicio(),
                            h.getHoraFin()
                    ))
                    .toList();

            return new MedicoDto(
                    medico.getId(),
                    medico.getNombre(),
                    medico.getEspecialidad(),
                    medico.getCostoConsulta(),
                    medico.getLocalidad(),
                    citasDto,
                    horariosDto
            );
        }).toList();
    }


}
