package org.example.backend.data;


import jakarta.validation.constraints.NotNull;

import org.example.backend.logic.Horario;
import org.example.backend.logic.Medico;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends CrudRepository<Horario, String> {
    List<Horario> findByIdMedico(Medico m);
    Horario findByIdMedicoAndDiaSemana(@NotNull Medico idMedico, Integer diaSemana);
    boolean existsByIdMedico(Medico medico);

    List<Horario> findByIdMedico_Id(String m);
}
