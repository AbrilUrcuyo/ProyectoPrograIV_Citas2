package org.example.backend.data;



import jakarta.validation.constraints.NotNull;
import org.example.backend.logic.Cita;
import org.example.backend.logic.Medico;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaRepository extends CrudRepository<Cita, String> {
    List<Cita> findCitasByIdMedicoAndFecha(@NotNull Medico idMedico, @NotNull LocalDate fecha);

    @Transactional
    @Modifying
    @Query("update Cita set estado = :estado WHERE id = :id")
    void updateEstado(@NotNull @Param("id") Integer id, @NotNull @Param("estado") String estado);

    @Transactional
    @Modifying
    @Query("update Cita set anotaciones = :anotacion WHERE id = :id")
    void updateAnotaciones(@NotNull @Param("id") Integer id, @NotNull @Param("anotacion") String anotacion);
}
