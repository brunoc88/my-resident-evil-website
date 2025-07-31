import {
    CATEGORIAS_VALIDAS,
    CONDICIONES_VALIDAS,
    validarCategoria,
    validarCondicion,
    validarPrimeraAparicion,
    validarUltimaAparicion
} from '../../utils/characterValidations'


const CharacterSelects = ({ register, errors }) => {
    return (
        <div>
            <div className="campo">
                <label htmlFor="categoria">Categoria:</label>
                <select id="categoria" {...register('categoria', validarCategoria)}>
                    <option value="">--Seleccione categoría--</option>
                    {CATEGORIAS_VALIDAS.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                {errors.categoria && <span>{errors.categoria.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="condicion">Condicion:</label>
                <select id="condicion" {...register('condicion', validarCondicion)}>
                    <option value="">--elige condicion--</option>
                    {CONDICIONES_VALIDAS.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                {errors.condicion && <span>{errors.condicion.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="aparicion">Primera Aparición:</label>
                <select id="aparicion" {...register('primeraAparicion', validarPrimeraAparicion)}>
                    <option value="">--elige videojuego--</option>
                    <option value="Resident Evil (1996)">Resident Evil (1996)</option>
                    <option value="Resident Evil 2 (1998)">Resident Evil 2 (1998)</option>
                    <option value="Resident Evil 3: Nemesis (1999)">Resident Evil 3: Nemesis (1999)</option>
                    <option value="Resident Evil Code: Veronica (2000)">Resident Evil Code: Veronica (2000)</option>
                    <option value="Resident Evil Zero (2002)">Resident Evil Zero (2002)</option>
                    <option value="Resident Evil (Remake) (2002)">Resident Evil (Remake) (2002)</option>
                    <option value="Resident Evil 4 (2005)">Resident Evil 4 (2005)</option>
                    <option value="Resident Evil 5 (2009)">Resident Evil 5 (2009)</option>
                    <option value="Resident Evil: Revelations (2012)">Resident Evil: Revelations (2012)</option>
                    <option value="Resident Evil 6 (2012)">Resident Evil 6 (2012)</option>
                    <option value="Resident Evil: Revelations 2 (2015)">Resident Evil: Revelations 2 (2015)</option>
                    <option value="Resident Evil 7: Biohazard (2017)">Resident Evil 7: Biohazard (2017)</option>
                    <option value="Resident Evil 2 (Remake) (2019)">Resident Evil 2 (Remake) (2019)</option>
                    <option value="Resident Evil 3 (Remake) (2020)">Resident Evil 3 (Remake) (2020)</option>
                    <option value="Resident Evil Village (2021)">Resident Evil Village (2021)</option>
                    <option value="Resident Evil 4 (Remake) (2023)">Resident Evil 4 (Remake) (2023)</option>
                </select>
                {errors.primeraAparicion && <span>{errors.primeraAparicion.message}</span>}
            </div>

            <div className="campo">
                <label htmlFor="ultima">Última Aparición:</label>
                <select id="ultima" {...register('ultimaAparicion', validarUltimaAparicion)}>
                    <option value="">--elige videojuego--</option>
                    <option value="Resident Evil (1996)">Resident Evil (1996)</option>
                    <option value="Resident Evil 2 (1998)">Resident Evil 2 (1998)</option>
                    <option value="Resident Evil 3: Nemesis (1999)">Resident Evil 3: Nemesis (1999)</option>
                    <option value="Resident Evil Code: Veronica (2000)">Resident Evil Code: Veronica (2000)</option>
                    <option value="Resident Evil Zero (2002)">Resident Evil Zero (2002)</option>
                    <option value="Resident Evil (Remake) (2002)">Resident Evil (Remake) (2002)</option>
                    <option value="Resident Evil 4 (2005)">Resident Evil 4 (2005)</option>
                    <option value="Resident Evil 5 (2009)">Resident Evil 5 (2009)</option>
                    <option value="Resident Evil: Revelations (2012)">Resident Evil: Revelations (2012)</option>
                    <option value="Resident Evil 6 (2012)">Resident Evil 6 (2012)</option>
                    <option value="Resident Evil: Revelations 2 (2015)">Resident Evil: Revelations 2 (2015)</option>
                    <option value="Resident Evil 7: Biohazard (2017)">Resident Evil 7: Biohazard (2017)</option>
                    <option value="Resident Evil 2 (Remake) (2019)">Resident Evil 2 (Remake) (2019)</option>
                    <option value="Resident Evil 3 (Remake) (2020)">Resident Evil 3 (Remake) (2020)</option>
                    <option value="Resident Evil Village (2021)">Resident Evil Village (2021)</option>
                    <option value="Resident Evil 4 (Remake) (2023)">Resident Evil 4 (Remake) (2023)</option>
                </select>
                {errors.ultimaAparicion && <span>{errors.ultimaAparicion.message}</span>}
            </div>
        </div>
    )
}

export default CharacterSelects