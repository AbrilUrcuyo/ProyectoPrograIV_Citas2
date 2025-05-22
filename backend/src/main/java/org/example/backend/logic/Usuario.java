package org.example.backend.logic;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios", schema = "citasmedicas")
public class Usuario {




    @Id
    @Size(max = 20)
    @Column(name = "id", nullable = false, length = 20)
    private String id;

    @Size(max = 100)
    @NotNull
    @Column(name = "clave", nullable = false, length = 100)
    private String clave;

    @Size(max = 20)
    @NotNull
    @Column(name = "tipo", nullable = false, length = 20)
    private String tipo;

    @OneToOne(mappedBy = "usuarios")
    private Medico medico;

    @OneToOne(mappedBy = "usuarios")
    private Paciente paciente;


    public Usuario() {}

    public Usuario(String id, String clave, String tipo) {
        this.id = id;
        this.clave = clave;
        this.tipo = tipo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

}