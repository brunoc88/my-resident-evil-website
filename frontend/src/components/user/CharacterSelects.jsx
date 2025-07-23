const CharacterSelects = ({ register, watch, reset, errors }) => {
    return (
        <div>
            <div>
                <label htmlFor="categorias">Categoria:</label>
                <select name="categoria" id="categoria">
                    <option value="">--elige una categoria--</option>
                    <option value="héroe">Héroe</option>
                    <option value="villano">Villano</option>
                    <option value="neutral">Neutral</option>
                </select>
            </div>
            <div>
                <label htmlFor="condiciones">Condicion:</label>
                <select name="condicion" id="condicion">
                    <option value="">--elige condicion--</option>
                    <option value="vivo">Vivo</option>
                    <option value="muerto">Muerto</option>
                    <option value="desaparecido">Desaparecido</option>
                    <option value="desconocido">Desconocido</option>
                </select>
            </div>
            <div>
                <label htmlFor="aparicion">Primera Aparición:</label>
                <select name="primeraAparicion" id="aparicion">
                    <option value="">--elige videojuego--</option>
                    <option value="Resident Evil (1996)">Resident Evil (1996)</option>
                    <option value="Resident Evil 2 (1998)">Resident Evil 2 (1998)</option>
                    <option value="Resident Evil 3: Nemesis (1999)">Resident Evil 3: Nemesis (1999)</option>
                    <option value="Resident Evil Code: Veronica (2000)">Resident Evil Code: Veronica (2000)</option>
                    <option value="Resident Evil Zero (2002)">Resident Evil Zero (2002)</option>
                    <option value="Resident Evil 4 (2005)">Resident Evil 4 (2005)</option>
                    <option value="Resident Evil 5 (2009)">Resident Evil 5 (2009)</option>
                    <option value="Resident Evil 6 (2012)">Resident Evil 6 (2012)</option>
                    <option value="Resident Evil 7: Biohazard (2017)">Resident Evil 7: Biohazard (2017)</option>
                    <option value="Resident Evil Village (2021)">Resident Evil Village (2021)</option>
                </select>
            </div>

            <div>
                <label htmlFor="ultimaAparicion">Última Aparición:</label>
                <select name="ultimaAparicion" id="ultimaAparicion">
                    <option value="">--elige videojuego--</option>
                    <option value="Resident Evil (1996)">Resident Evil (1996)</option>
                    <option value="Resident Evil 2 (1998)">Resident Evil 2 (1998)</option>
                    <option value="Resident Evil 3: Nemesis (1999)">Resident Evil 3: Nemesis (1999)</option>
                    <option value="Resident Evil Code: Veronica (2000)">Resident Evil Code: Veronica (2000)</option>
                    <option value="Resident Evil Zero (2002)">Resident Evil Zero (2002)</option>
                    <option value="Resident Evil 4 (2005)">Resident Evil 4 (2005)</option>
                    <option value="Resident Evil 5 (2009)">Resident Evil 5 (2009)</option>
                    <option value="Resident Evil 6 (2012)">Resident Evil 6 (2012)</option>
                    <option value="Resident Evil 7: Biohazard (2017)">Resident Evil 7: Biohazard (2017)</option>
                    <option value="Resident Evil Village (2021)">Resident Evil Village (2021)</option>
                </select>
            </div>
        </div>
    )
}

export default CharacterSelects