// Puedes poner esto arriba de GestionCitas o en otro archivo si prefieres
function AnotacionModal({ show, onClose, cita, anotacion, setAnotacion, onGuardar }) {
    if (!show || !cita) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Anotaciones de la cita</h3>
                <form onSubmit={onGuardar}>
                    <input type="hidden" name="citaId" value={cita.id} />
                    <div className="search-group">
                        <label htmlFor="nombreP" className="search-label">Nombre del paciente</label>
                        <output className="search-input" id="nombreP">{cita.nombrePaciente}</output>
                    </div>
                    <div className="search-group">
                        <label htmlFor="fechaYHora" className="search-label">Fecha - Hora</label>
                        <output className="search-input" id="fechaYHora">{cita.fecha + ' - ' + cita.hora}</output>
                    </div>
                    <div className="search-group">
                        <label htmlFor="anotacion" className="search-label">Anotaciones</label>
                        <textarea
                            id="anotacion"
                            name="anotacion"
                            value={anotacion}
                            onChange={e => setAnotacion(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="search-button">Guardar</button>
                    <button type="button" className="cancel-button" onClick={onClose}>Cerrar</button>
                </form>
            </div>
        </div>
    );
}

export default AnotacionModal;