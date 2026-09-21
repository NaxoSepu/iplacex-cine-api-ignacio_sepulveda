export class Actor {
  constructor(idPelicula, nombre, edad, estaRetirado, premios) {
    this.idPelicula = idPelicula;
    this.nombre = nombre;
    this.edad = Number(edad);
    this.estaRetirado = Boolean(estaRetirado);
    this.premios = Array.isArray(premios) ? premios : [];
  }
}