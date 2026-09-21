export class Pelicula {
  constructor(nombre, generos, anioEstreno) {
    this.nombre = nombre;
    this.generos = Array.isArray(generos) ? generos : [];
    this.anioEstreno = Number(anioEstreno);
  }
}