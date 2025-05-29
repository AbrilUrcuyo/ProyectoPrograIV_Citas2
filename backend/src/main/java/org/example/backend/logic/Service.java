package org.example.backend.logic;
 import org.example.backend.data.*;
 import org.springframework.beans.factory.annotation.Autowired;

 import java.math.BigDecimal;
 import java.time.LocalDate;
 import java.time.LocalTime;
 import java.time.format.DateTimeFormatter;
 import java.util.*;

@org.springframework.stereotype.Service("service")
public class Service {
     @Autowired
     private CitaRepository citaRepository;

     @Autowired
     private MedicoRepository medicoRepository;

     @Autowired
     private UsuarioRepository usuarioRepository;

     @Autowired
     private PacienteRepository pacienteRepository;

     @Autowired
     private HorarioRepository horarioRepository;


     public Iterable<Cita> findAllCitas() {
         return citaRepository.findAll();
     }

     public Iterable<Medico> findAllMedicos() {
         return medicoRepository.findAll();
     }
     public Iterable<Usuario> findAllUsuarios() {
         return usuarioRepository.findAll();
     }

     public Iterable<Paciente> findAllPacientes() {
         return pacienteRepository.findAll();
     }

     public Iterable<Horario> findAllHorarios() {
         return horarioRepository.findAll();
     }

     public Medico findMedicoById(String id) {
         return medicoRepository.findById(id).orElse(new Medico());
     }

     public Paciente finPacienteById(String id){ return pacienteRepository.findById(id).orElse(new Paciente());}

    // _____________________Horarios_____________________________
     public List<Integer> diasLaboralesPorMedico(String id) {
         List<Horario> horarios = horarioRepository.findByIdMedico(findMedicoById(id));
         List<Integer> diasLaborales = new ArrayList<>();
         for(Horario horario : horarios) {
             diasLaborales.add(horario.getDiaSemana());
         }
         Collections.sort(diasLaborales);
         return diasLaborales;
     }

    public List<LocalDate> primerasTresFechasLaboralesPorMedico(String id) {
        List<LocalDate> fechasLaborales = new ArrayList<>();
        LocalDate actual = LocalDate.now();

        List<Integer> diasLaborales = diasLaboralesPorMedico(id);

        if(!diasLaborales.isEmpty()) {
            while(fechasLaborales.size() < 3) {
                if(diasLaborales.contains(actual.getDayOfWeek().getValue())) {
                    fechasLaborales.add(actual);
                }
                actual = actual.plusDays(1);
            }
        }
        return fechasLaborales;
    }

     public List<LocalTime> calcularCitas(int dia, String id){
         Horario horario = horarioRepository.findByIdMedicoAndDiaSemana(findMedicoById(id), dia);

         List<LocalTime> citas = new ArrayList<>();

         if(horario != null){
             LocalTime hI = horario.getHoraInicio();
             LocalTime hF = horario.getHoraFin();
             int frecuencia = medicoRepository.findById(id).orElse(new Medico()).getFrecCitas();

             while (!hI.isAfter(hF.minusMinutes(frecuencia))) {
                 citas.add(hI);
                 hI = hI.plusMinutes(frecuencia);
             }
         }

         return citas;
     }

     public Map<String, Map<String, List<LocalTime>>> citasMedicosPorFecha(List<Medico> medicos){
         Map<String, Map<String, List<LocalTime>>> citasPorFechaYMedico = new HashMap<>();
         List<LocalDate> diasLaborales;

         DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");

         for(Medico medico : medicos) {

             diasLaborales = primerasTresFechasLaboralesPorMedico(medico.getId());

             Map<String, List<LocalTime>> listaHoras = new LinkedHashMap<>();
             Map<String, List<LocalTime>> horasOcupadas = new LinkedHashMap<>();

             for(LocalDate dia : diasLaborales) {
                 String f = formato.format(dia);
                 listaHoras.put(f, calcularCitas(dia.getDayOfWeek().getValue(), medico.getId()));
                 horasOcupadas.put(f, citasOcupadas(medico.getId(), dia));
             }

             citasPorFechaYMedico.put(medico.getId()+'H', listaHoras);
             citasPorFechaYMedico.put(medico.getId()+'O', horasOcupadas);
         }

         return citasPorFechaYMedico;
     }

     // _____________________Register_____________________________
     public boolean existeUsuario(String username) {
         return usuarioRepository.findById(username).isPresent();
     }

    public void registrarUsuarioConTipo(Usuario usuario, String nombre, String id, String tipo) {
        usuarioRepository.save(usuario);
        usuarioRepository.flush();

        Usuario usuario2 = usuarioRepository.findById(id).orElse(usuario);
        if (tipo.equals("Medico")) {
            Medico medico = new Medico();
            medico.setId(null);
            medico.setUsuarios(usuario2);
            medico.setNombre(nombre);
            medico.setEmail("");
            medico.setEspecialidad("");
            medico.setCostoConsulta(0);
            medico.setLocalidad("");
            medico.setDescripcion("");
            medico.setEstadoAprob("Pendiente");
            medico.setFrecCitas(60);
            medicoRepository.save(medico);

        } else if (tipo.equals("Paciente")) {

            Paciente paciente = new Paciente();
            paciente.setId(null);
            paciente.setUsuarios(usuario2);
            paciente.setNombre(nombre);
            paciente.setPadecimientos("");
            pacienteRepository.save(paciente);
        }
    }

     //_______________________Login________________________________
     public boolean existeByIdAndClave (String id, String clave) {
         return usuarioRepository.existsByIdAndClave(id,clave);
     }

     public List<LocalTime> citasOcupadas(String id, LocalDate fecha){
         List<Cita> citas = citaRepository.findCitasByIdMedicoAndFecha(findMedicoById(id), fecha);

         List<LocalTime> horas = new ArrayList<>();

         for(Cita c : citas){
             horas.add(c.getHora());
         }
         return horas;
     }

     public List<Medico> medicosAceptados(){
         List<Medico> medicos = new ArrayList<>();

         for(Medico m : medicoRepository.findAll()){
             if(m.getEstadoAprob().equals("Aprobado")){
                 medicos.add(m);
             }
         }
         return medicos;
     }

    // _____________________Citas_____________________________
    public void registrarCita(String idP, String idM, LocalDate fecha, LocalTime hora){
         Cita cita = new Cita(this.finPacienteById(idP), this.findMedicoById(idM), fecha, hora);
         citaRepository.save(cita);
    }

    //---------History----------
    public Paciente findPacienteById(String idPaciente) {
        return pacienteRepository.findById(idPaciente).orElse(null);
    }

    //_______________________Medicos______________________________
    public void agregarMedico(Medico medico) {
        medicoRepository.save(medico);
    }


    public void actualizarMedico(String id,String email,String especilidad, int costo, String localidad, String descripcion, int frecuencia) {
        Medico medico = medicoRepository.findById(id).orElse(null);
        medico.setEmail(email);
        medico.setEspecialidad(especilidad);
        medico.setCostoConsulta(costo);

        medico.setLocalidad(localidad);
        medico.setDescripcion(descripcion);
        medico.setEstadoAprob("Aprobado");
        medico.setFrecCitas(frecuencia);
        medicoRepository.save(medico);
    }



    //______________________Paciente________________________________
    public void agregarPaciente(Paciente paciente) {
        pacienteRepository.save(paciente);
    }

    public Paciente obtenerPacienteId(String id){
        return pacienteRepository.findById(id).orElse(new Paciente());
    }

    public void actualizarPaciente( String id, String padecimientos) {
        Paciente paciente = obtenerPacienteId(id);
        paciente.setPadecimientos(padecimientos);
        pacienteRepository.save(paciente);
    }

    public void guardarHorario(Horario horario, Medico medico) {
        Horario horarioAActualizar = null;

        for (Horario h : medico.getHorarios()) {
            if (h.getDiaSemana() != null && h.getDiaSemana().equals(horario.getDiaSemana())) {
                horarioAActualizar = h;
                break;
            }
        }

        if (horarioAActualizar != null) {
            horarioAActualizar.setHoraInicio(horario.getHoraInicio());
            horarioAActualizar.setHoraFin(horario.getHoraFin());
            horarioRepository.save(horarioAActualizar);
        } else {
            horarioRepository.save(horario);
        }
    }
    //-------------------Horario---------------------------------------
    public boolean existeHorario(Medico medico) {
        return horarioRepository.existsByIdMedico(medico);
    }

    //---------Admin--------
    public void actualizarEstadoMedico(String id, String nuevoEstado) {
        Medico medico = medicoRepository.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        medico.setEstadoAprob(nuevoEstado);
        medicoRepository.save(medico);
    }
    public List<Medico> medicosPendientes(){
        List<Medico> medicos = new ArrayList<>();

        for(Medico m : medicoRepository.findAll()){
            if(m.getEstadoAprob().equals("Pendiente")){
                medicos.add(m);
            }
        }
        return medicos;
    }

    //CITAS
    public Cita findCitaById(int citaId) {
        return citaRepository.findById(String.valueOf(citaId)).orElse(new Cita());
    }

    public void confirmarCita(Integer id){
        citaRepository.updateEstado(id, "Confirmada");
    }

    public void cancelarCita(Integer id){
        citaRepository.updateEstado(id, "Cancelada");
    }

    public void completarCita(Integer id){
        citaRepository.updateEstado(id, "Completada");
    }

    public void anotarEnLaCita(Integer id, String anotacion){
        citaRepository.updateAnotaciones(id, anotacion);
    }

    public List<Horario> findHorariosByMedico(String id){
        return horarioRepository.findByIdMedico_Id(id);
    }
}

//Intregrantes del proyecto
//Abril Urcuyo Arce
//Laura Flores Barrantes
//Fernanda Segura Largaespada
