package org.example.backend.presentation.horarios;

import org.example.backend.logic.Horario;
import org.example.backend.logic.Medico;
import org.example.backend.logic.Service;
import org.example.backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController("horariosController")
@RequestMapping("/horarios")
public class Controller {

    @Autowired
    private Service service;

    public record MedicoDto1(String id, String nombre, String especialidad, int costoConsulta, String localidad) { }
    public record EstructuraHE(MedicoDto1 medico, List<String> fechas, Map<String, List<LocalTime>> citas, Map<String, List<LocalTime>> ocupadas) { }
    @GetMapping("/show/{id}/{fecha}")
    public EstructuraHE show(@PathVariable("id") String id, @PathVariable("fecha") String fechaP) {

        Medico med = service.findMedicoById(id);

        List<Integer> diasQueLabora = service.diasLaboralesPorMedico(id);
        List<String> fechas = new ArrayList<>();
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        Map<String, List<LocalTime>> citas = new HashMap<>();
        Map<String, List<LocalTime>> ocupadas = new HashMap<>();

        LocalDate fechaInicio = LocalDate.parse(fechaP);
        int diaInicio = fechaInicio.getDayOfWeek().getValue();
        LocalDate fecha;
        String fechaF;

        for(Integer dia : diasQueLabora) {
            fecha = fechaInicio.plusDays(-diaInicio + dia);
            if(!fecha.isBefore(LocalDate.now())) {
                fechaF = fecha.format(formato);
                fechas.add(fechaF);
                citas.put(fechaF, service.calcularCitas(dia, id));
                ocupadas.put(fechaF, service.citasOcupadas(id, fecha));
            }
        }

        if(fechas.isEmpty()){
            fechaInicio = fechaInicio.plusWeeks(1);
            diaInicio = fechaInicio.getDayOfWeek().getValue();

            for(Integer dia : diasQueLabora) {
                fecha = fechaInicio.plusDays(-diaInicio + dia);
                fechaF = fecha.format(formato);
                fechas.add(fechaF);
                citas.put(fechaF, service.calcularCitas(dia, id));
                ocupadas.put(fechaF, service.citasOcupadas(id, fecha));
            }
        }

        return new EstructuraHE(new MedicoDto1(med.getId(), med.getNombre(), med.getEspecialidad(), med.getCostoConsulta(), med.getLocalidad()), fechas, citas, ocupadas);
    }

//    @GetMapping("/next/{id}/{fecha}")
//    public String next(@PathVariable("id") String id, @PathVariable("fecha") String fecha) {
//        LocalDate date = LocalDate.parse(fecha);
//        String nuevaFecha = date.plusWeeks(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
//
//        return "redirect:/presentation/horarios/show/" + id + "/" + nuevaFecha;
//    }
//
//    @GetMapping("/prev/{id}/{fecha}")
//    public String prev(@PathVariable("id") String id, @PathVariable("fecha") String fecha) {
//        LocalDate date = LocalDate.parse(fecha);
//        LocalDate semanaPrevia = date.minusWeeks(1);
//        String nuevaFecha;
//        if(!semanaPrevia.isBefore(LocalDate.now()) ){
//            nuevaFecha = semanaPrevia.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
//        }else{
//            nuevaFecha = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
//        }
//
//        return "redirect:/presentation/horarios/show/" + id + "/" + nuevaFecha;
//    }

    public record HorarioDto(Integer id, String diaSemana, LocalTime horaInicio, LocalTime horaFin){}
//    public record MedicoDto(String id, String nombre, String especialidad, int costoConsulta, String localidad, List<HorarioDto> horarios) { }


    @GetMapping("/showIngresoH")
    public List<HorarioDto> showIngresosH() {

        String id = service.getUserId();
        Medico m = service.findMedicoById(id);

        List<HorarioDto> horarios = new ArrayList<>();
        if(m.getEstadoAprob().equals("Aprobado")) {
            Map<Integer, String> diasSemana = Map.of(
                    1, "Lunes",
                    2, "Martes",
                    3, "Miércoles",
                    4, "Jueves",
                    5, "Viernes",
                    6, "Sábado",
                    7, "Domingo"
            );

            Medico med = service.findMedicoById(id);

            horarios = med.getHorarios().stream().map(horario -> new HorarioDto(
                    horario.getId(),
                    diasSemana.get(horario.getDiaSemana()),
                    horario.getHoraInicio(),
                    horario.getHoraFin()
            )).sorted((c1,c2)->{
                int compareHora = c2.diaSemana.compareTo(c1.diaSemana());
                if (compareHora == 0) {
                    return c2.diaSemana().compareTo(c1.diaSemana());
                }
                return compareHora;
            }).toList();
        }
        return horarios;
    }

    public record IngresarHorarioRequest(String dia, String horaInicio, String horaFin) {}
    @PostMapping("/ingresarH")
    public void ingresarH(@RequestBody IngresarHorarioRequest request) {


        Medico medico = service.findMedicoById(service.getUserId());

        Horario horario = new Horario();
        horario.setIdMedico(medico);

        Map<String, Integer> diasSemana = Map.of(
                "1", 1,
                "2", 2,
                "3", 3,
                "4", 4,
                "5", 5,
                "6", 6,
                "7", 7
        );

        System.out.println("DIA DE LA SEMANA"+diasSemana.get(request.dia));

        horario.setDiaSemana(diasSemana.get(request.dia));
        horario.setHoraInicio(LocalTime.parse(request.horaInicio));
        horario.setHoraFin(LocalTime.parse(request.horaFin));

        LocalTime inicio = horario.getHoraInicio();
        LocalTime fin = horario.getHoraFin();

        if(!fin.isBefore(inicio) && !fin.equals(inicio)) {
            service.guardarHorario(horario, medico);
        }else{
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
//
//    @GetMapping("/finalizar")
//    public String finalizar(Model model) {
//        return "redirect:/presentation/medicos/appointment";
//    }

}




