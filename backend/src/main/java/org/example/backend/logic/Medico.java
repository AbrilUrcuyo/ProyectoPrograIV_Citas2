package org.example.backend.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "medicos", schema = "citasmedicas")
public class Medico {
    @Id
    @Size(max = 20)
    @Column(name = "id", nullable = false, length = 20)
    private String id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id", nullable = false)
    private Usuario usuarios;

    public Medico() {
        this.id = "";
    }

    @Size(max = 30)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 30)
    private String nombre;

    @Size(max = 30)
    @Column(name = "email", length = 30)
    private String email;

    @Size(max = 30)
    @NotNull
    @Column(name = "especialidad", nullable = false, length = 30)
    private String especialidad;

    @NotNull
    @Column(name = "costo_consulta", nullable = false, precision = 10, scale = 2)
    private int costoConsulta;

    @Size(max = 20)
    @NotNull
    @Column(name = "localidad", nullable = false, length = 20)
    private String localidad;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @Size(max = 20)
    @NotNull
    @Column(name = "estado_aprob", nullable = false, length = 20)
    private String estadoAprob;

    @NotNull
    @Column(name = "frec_citas", nullable = false)
    private Integer frecCitas;

    @OneToMany(mappedBy = "idMedico")
    @JsonIgnore
    private Set<Cita> citas = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idMedico")
    @JsonIgnore
    private Set<Horario> horarios = new LinkedHashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Usuario getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Usuario usuarios) {
        this.usuarios = usuarios;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public int getCostoConsulta() {
        return costoConsulta;
    }

    public void setCostoConsulta(int costoConsulta) {
        this.costoConsulta = costoConsulta;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstadoAprob() {
        return estadoAprob;
    }

    public void setEstadoAprob(String estadoAprob) {
        this.estadoAprob = estadoAprob;
    }

    public Integer getFrecCitas() {
        return frecCitas;
    }

    public void setFrecCitas(Integer frecCitas) {
        this.frecCitas = frecCitas;
    }

    public Set<Cita> getCitas() {
        return citas;
    }

    public void setCitas(Set<Cita> citas) {
        this.citas = citas;
    }

    public Set<Horario> getHorarios() {
        return horarios;
    }

    public void setHorarios(Set<Horario> horarios) {
        this.horarios = horarios;
    }

}