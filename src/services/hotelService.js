const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class HotelService {
  async consultar(ruta) {
    const respuesta = await fetch(`${API_URL}${ruta}`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(typeof datos.detail === "string" ? datos.detail : "Error al consultar");
    }

    return datos;
  }

  obtenerHoteles() {
    return this.consultar("/api/v1/hoteles");
  }

  obtenerTipos() {
    return this.consultar("/api/v1/tipos-habitacion");
  }

  buscarDisponibilidad(parametros) {
    return this.consultar(
      `/api/v1/disponibilidad?${new URLSearchParams(parametros)}`
    );
  }
}

export default new HotelService();
