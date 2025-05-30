package org.example.backend.presentation.medicos;


import jakarta.servlet.http.HttpSession;
import org.example.backend.logic.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController("medicosController")
@RequestMapping("/medicos")
public class Controller {

    @Autowired
    private Service service;

    public record CitaDto(Integer id, String nombrePaciente, LocalDate fecha, LocalTime hora, String estado, String anotaciones) { }
    public record MedicoDto(String id, String nombre, String estadoAprob, List<CitaDto> citas) { }
    public record MedicoDtoSinCita(String id, String nombre, String email, String especialidad, int costoConsulta, String localidad, String descripcion, int frecuencia) { }
    public record BuscarCitasRequest(String estado, String paciente) {}

    @GetMapping("/citas")
    public MedicoDto read(){
        String cedula = service.getUserId();

        try{
            Medico med = service.findMedicoById(cedula);

            Paciente p = service.findPacienteById(cedula);

            List<CitaDto> citasDTO = med.getCitas().stream()
                    .map(cita -> new CitaDto(
                            cita.getId(),
                            cita.getIdPaciente().getNombre(),
                            cita.getFecha(),
                            cita.getHora(),
                            cita.getEstado(),
                            cita.getAnotaciones()
                    ))
                    .sorted((c1, c2) -> {
                        int compareFecha = c2.fecha().compareTo(c1.fecha());
                        if (compareFecha == 0) {
                            return c2.hora().compareTo(c1.hora());
                        }
                        return compareFecha;
                    })
                    .collect(Collectors.toList());

            return new MedicoDto(med.getId(), med.getNombre(), med.getEstadoAprob(), citasDTO);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/show")
    public String show(Model model) {
        model.addAttribute("medicos", service.findAllMedicos());
        return "/medicos/View";
    }

    @GetMapping("/appointment")
    public String appointment(Model model, @AuthenticationPrincipal(expression = "usuario") Usuario usuario, HttpSession session) {

        String id = usuario.getId();
        Medico m = service.findMedicoById(id);
        model.addAttribute("medico", m);

        Set<Cita> citas = m.getCitas();

        List<Cita> citasOrdenadas = citas.stream()
                .sorted((c1, c2) -> {
                    int compareFecha = c2.getFecha().compareTo(c1.getFecha());
                    if (compareFecha == 0) {
                        return c2.getHora().compareTo(c1.getHora());
                    }
                    return compareFecha;
                })
                .collect(Collectors.toList());

        String estado = (String) session.getAttribute("estado");
        if (estado != null && !estado.equals("Todas")) {
            String finalEstado = estado;
            citasOrdenadas.removeIf(cita -> !cita.getEstado().equals(finalEstado));
        }else{
            estado = "Todas";
        }
        model.addAttribute("filterE", estado);

        String paciente = (String) session.getAttribute("paciente");
        if(paciente != null && !Objects.equals(paciente, "")){
            String finalPaciente = paciente;
            citasOrdenadas.removeIf(cita -> !cita.getIdPaciente().getNombre().contains(finalPaciente));
        }else{
            paciente = "";
        }
        model.addAttribute("filterP", paciente);


        model.addAttribute("citas", citasOrdenadas);
        return "/medicos/appointment";
    }

    @PostMapping("/citas/buscar")
    public List<CitaDto> search(@RequestBody BuscarCitasRequest request) {
        String estado = request.estado();
        String paciente = request.paciente();

        String id = service.getUserId();
        Medico med = service.findMedicoById(id);

        List<CitaDto> citasM = med.getCitas().stream()
            .map(cita -> new CitaDto(
                cita.getId(),
                cita.getIdPaciente().getNombre(),
                cita.getFecha(),
                cita.getHora(),
                cita.getEstado(),
                cita.getAnotaciones()
            ))
            .sorted((c1, c2) -> {
                int compareFecha = c2.fecha().compareTo(c1.fecha());
                if (compareFecha == 0) {
                return c2.hora().compareTo(c1.hora());
                }
                return compareFecha;
            })
            .toList();


        List<CitaDto> citas = citasM.stream()
            .filter(cita -> (Objects.equals(estado, "Todas") || cita.estado().equals(estado)) &&
                    (paciente == null || paciente.isEmpty() || cita.nombrePaciente().contains(paciente)))
            .toList();

        return citas;
    }

    @GetMapping("/ingresoMedicos")
    public String perfilMedico(@AuthenticationPrincipal(expression = "usuario") Usuario usuario) {
        Medico m = service.findMedicoById(usuario.getId());
        if(Objects.equals(m.getEmail(), "") || Objects.equals(m.getEspecialidad(), "") || Objects.equals(m.getLocalidad(), "")){
            return "redirect:/presentation/medicos/perfilMedico";
        }
        return "redirect:/medicos/appointment";
    }

    @GetMapping("/perfilMedico")
    public String perfilMedico(Model model,@AuthenticationPrincipal(expression = "usuario") Usuario usuario) {
        String id = usuario.getId();
        Medico m = service.findMedicoById(id);
        if(m.getEstadoAprob().equals("Aprobado")) {
            model.addAttribute("medico", m);
            model.addAttribute("error", "");
            return "/presentation/medicos/perfilMedico";
        }else{
            return "redirect:/medicos/appointment";
        }
    }

    @PostMapping("/actualizarMedico")
    public ResponseEntity<?> actualizarMedico(@AuthenticationPrincipal Jwt jwt, @RequestBody MedicoDtoSinCita m) {
        String id = (String) jwt.getClaims().get("id");

        System.out.println(id + m.email() + m.especialidad() + m.costoConsulta()+
                m.localidad()+ m.descripcion() + m.frecuencia());

        if (m.costoConsulta() < 0) {
            return ResponseEntity.badRequest().body("El costo debe ser positivo");
        }else {
            service.actualizarMedico(id, m.email(), m.especialidad(), m.costoConsulta(),
                    m.localidad(), m.descripcion(), m.frecuencia());
            return ResponseEntity.ok().build();
        }
    }


    @GetMapping("/perfil")
    public MedicoDtoSinCita traerDatos(@AuthenticationPrincipal Jwt jwt) {
        String id = (String) jwt.getClaims().get("id");
        Medico m = service.findMedicoById(id);

        return new MedicoDtoSinCita(
                m.getId(),
                m.getNombre(),
                m.getEmail(),
                m.getEspecialidad(),
                m.getCostoConsulta(),
                m.getLocalidad(),
                m.getDescripcion(),
                m.getFrecCitas()
        );
    }
}