package org.example.backend.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "citas", schema = "citasmedicas")
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "num_cita", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente idPaciente;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnore
    private Medico idMedico;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @NotNull
    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Size(max = 20)
    @NotNull
    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Lob
    @Column(name = "anotaciones")
    private String anotaciones;

    public Cita(Paciente p, Medico m, LocalDate fecha, LocalTime hora) {
        this.idPaciente = p;
        this.idMedico = m;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = "Pendiente";
        this.anotaciones = "";
    }

    public Cita() {
        this.idPaciente = null;
        this.idMedico = null;
        this.fecha = null;
        this.hora = null;
        this.estado = "Pendiente";
        this.anotaciones = "";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Paciente getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(Paciente idPaciente) {
        this.idPaciente = idPaciente;
    }

    public Medico getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Medico idMedico) {
        this.idMedico = idMedico;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getAnotaciones() {
        return anotaciones;
    }

    public void setAnotaciones(String anotaciones) {
        this.anotaciones = anotaciones;
    }


}