import { useEffect, useState } from "react";
import hotelService from "./services/hotelService";
import "./App.css";

function BuscadorHabitaciones({ hoteles, tipos, buscar, cargando }) {
  const [filtros, setFiltros] = useState({
    hotel_id: "",
    tipo_habitacion_id: "",
    fecha_entrada: "",
    fecha_salida: "",
    numero_personas: 1,
    numero_habitaciones: 1
  });

  function actualizar(evento) {
    setFiltros({
      ...filtros,
      [evento.target.name]: evento.target.value
    });
  }

  function enviar(evento) {
    evento.preventDefault();
    buscar(filtros);
  }

  return (
    <form onSubmit={enviar} className="buscador">
      <div className="campo">
        <label>Hotel</label>
        <select name="hotel_id" value={filtros.hotel_id} onChange={actualizar} required>
          <option value="">Seleccionar hotel</option>
          {hoteles.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.ciudad}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label>Tipo de habitación</label>
        <select name="tipo_habitacion_id" value={filtros.tipo_habitacion_id} onChange={actualizar} required>
          <option value="">Seleccionar categoría</option>
          {tipos.map(tipo => (
            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label>Fecha de entrada</label>
        <input name="fecha_entrada" type="date" min={new Date().toLocaleDateString("en-CA")} value={filtros.fecha_entrada} onChange={actualizar} required />
      </div>

      <div className="campo">
        <label>Fecha de salida</label>
        <input name="fecha_salida" type="date" min={filtros.fecha_entrada || new Date().toLocaleDateString("en-CA")} value={filtros.fecha_salida} onChange={actualizar} required />
      </div>

      <div className="campo">
        <label>Número de personas</label>
        <input name="numero_personas" type="number" min="1" value={filtros.numero_personas} onChange={actualizar} required />
      </div>

      <div className="campo">
        <label>Habitaciones solicitadas</label>
        <input name="numero_habitaciones" type="number" min="1" value={filtros.numero_habitaciones} onChange={actualizar} required />
      </div>

      <button type="submit" disabled={cargando}>
        {cargando ? "Consultando..." : "Consultar disponibilidad"}
      </button>
    </form>
  );
}

function ResultadoDisponibilidad({ resultado }) {
  if (!resultado) return null;

  const moneda = valor => new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);

  return (
    <section className="resultado">
      <div className={resultado.disponible ? "estado disponible" : "estado ocupado"}>
        {resultado.disponible ? "Habitaciones disponibles" : "Sin disponibilidad suficiente"}
      </div>

      <h2>{resultado.hotel}</h2>
      <p>Categoría: {resultado.tipo_habitacion}</p>

      <div className="resumen">
        <div><strong>{resultado.noches}</strong><span>Noches</span></div>
        <div><strong>{resultado.habitaciones_disponibles}</strong><span>Habitaciones disponibles</span></div>
        <div><strong>{resultado.numero_personas}</strong><span>Personas</span></div>
      </div>

      {resultado.disponible && (
        <>
          <h3>Desglose de tarifas</h3>
          {resultado.desglose.map((item, indice) => (
            <div className="tarifa" key={indice}>
              <span>{item.temporada} · {item.noches} noche(s)</span>
              <strong>{moneda(item.subtotal)}</strong>
            </div>
          ))}
          <div className="total">
            <span>Total de alojamiento</span>
            <strong>{moneda(resultado.tarifa_total)}</strong>
          </div>
          <p className="nota">Consulta informativa. No se realiza ninguna reserva.</p>
        </>
      )}
    </section>
  );
}

export default function App() {
  const [hoteles, setHoteles] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    Promise.all([
      hotelService.obtenerHoteles(),
      hotelService.obtenerTipos()
    ])
      .then(([listaHoteles, listaTipos]) => {
        setHoteles(listaHoteles);
        setTipos(listaTipos);
      })
      .catch(err => setError(err.message));
  }, []);

  async function buscar(filtros) {
    setError("");
    setResultado(null);
    setCargando(true);

    try {
      const datos = await hotelService.buscarDisponibilidad(filtros);
      setResultado(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="app">
      <header className="encabezado">
        <div className="navegacion">
          <strong>HOTEL RESERVATIONS</strong>
          <span>Explora nuestros destinos</span>
        </div>
        <div className="presentacion">
          <span>ENCUENTRA TU PRÓXIMO DESTINO</span>
          <h1>Tu próxima estadía comienza aquí.</h1>
          <p>Consulta habitaciones, compara tarifas y encuentra el alojamiento ideal.</p>
        </div>
      </header>

      <main className="contenido">
        <section className="panel">
          <h2>Buscar alojamiento</h2>
          <p className="subtitulo">Selecciona tus preferencias para consultar disponibilidad.</p>
          <BuscadorHabitaciones hoteles={hoteles} tipos={tipos} buscar={buscar} cargando={cargando} />
        </section>

        {error && <div className="error">{error}</div>}
        <ResultadoDisponibilidad resultado={resultado} />
      </main>

      <footer>Sistema de consulta de disponibilidad hotelera</footer>
    </div>
  );
}
