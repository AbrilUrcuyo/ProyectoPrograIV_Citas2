package org.example.backend.presentation.medicos;


import jakarta.servlet.http.HttpSession;
import org.example.backend.logic.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

@RestController
@RequestMapping("/medicos")
public class Controller {

    @Autowired
    private Service service;

    public record CitaDto(Integer id, String nombrePaciente, LocalDate fecha, LocalTime hora, String estado) { }
    public record MedicoDto(String id, String nombre, String estadoAprob, List<CitaDto> citas) { }

    @GetMapping("/{cedula}")
    public MedicoDto read(@PathVariable String cedula){
        try{
            Medico med = service.findMedicoById(cedula);

            Paciente p = service.findPacienteById(cedula);

            List<CitaDto> citasDTO = med.getCitas().stream()
                    .map(cita -> new CitaDto(
                            cita.getId(),
                            cita.getIdPaciente().getNombre(),
                            cita.getFecha(),
                            cita.getHora(),
                            cita.getEstado()
                    ))
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

    @PostMapping("/appointment/buscar")
    public String search(Model model,  @AuthenticationPrincipal(expression = "usuario") Usuario usuario,
                         @RequestParam("estado") String estado,
                         @RequestParam("paciente") String paciente,
                         HttpSession session) {

        String id = usuario.getId();
        Medico m = service.findMedicoById(id);
        model.addAttribute("medico", m);

        Set<Cita> citasM = m.getCitas();
        List<Cita> citas = citasM.stream()
                .sorted((c1, c2) -> {
                    int compareFecha = c2.getFecha().compareTo(c1.getFecha());
                    if (compareFecha == 0) {
                        return c2.getHora().compareTo(c1.getHora());
                    }
                    return compareFecha;
                })
                .collect(Collectors.toList());


        if(!Objects.equals(estado, "Todas")){
            String finalEstado = estado;
            citas.removeIf(cita -> !cita.getEstado().equals(finalEstado));
        }else{
            estado = "Todas";
        }
        model.addAttribute("filterE", estado);
        session.setAttribute("estado", estado);

        if(!Objects.equals(paciente, "")){
            String finalPaciente = paciente;
            citas.removeIf(cita -> !cita.getIdPaciente().getNombre().contains(finalPaciente));
        }else{
            paciente = "";
        }
        model.addAttribute("filterP", paciente);
        session.setAttribute("paciente", paciente);


        model.addAttribute("citas", citas);

        return "/medicos/appointment";
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
    public String actualizarMedico(Model model,@AuthenticationPrincipal(expression = "usuario") Usuario usuario,
                                   @RequestParam("email") String email, @RequestParam("especialidad") String especialidad,
                                   @RequestParam("costoConsulta") String costo, @RequestParam("localidad") String localidad,
                                   @RequestParam("descripcion") String descripcion, @RequestParam("frecCitas") String frecuencia ) {
        String id = usuario.getId();
        BigDecimal costoConsulta = new BigDecimal(costo);
        if (costoConsulta.compareTo(BigDecimal.ZERO) < 0) {
            Medico m = service.findMedicoById(id);
            model.addAttribute("medico", m);
            model.addAttribute("error", "El costo debe ser positivo");
            return "/presentation/medicos/perfilMedico";
        }else {
            service.actualizarMedico(id,email,especialidad,costoConsulta,localidad,descripcion,frecuencia);
            return "redirect:/medicos/appointment";
        }
    }
}

