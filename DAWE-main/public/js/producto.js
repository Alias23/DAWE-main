function guidGenerator() {
	var S4 = function() {
   	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const DEFAULT_IMAGE = '../imagenes/default.jpg';

export default class Producto {
  #id;
  #nombre;
  #precio;
  #descripcion;
  #imagen;

  constructor(nombre, precio, descripcion, imagen) {
    this.#id = guidGenerator();
    this.#nombre = nombre;
    this.#precio = precio;
    this.#descripcion = descripcion;
    this.#imagen = imagen ? imagen : DEFAULT_IMAGE;
  }

  get id() {
    return this.#id;
  }

  get nombre() {
    return this.#nombre;
  }
  set nombre(value) {
    this.#nombre = value;
  }
  get precio() {
    return this.#precio;
  }
  set precio(value) {
    this.#precio = value;
  }

  get descripcion() {
    return this.#descripcion;
  }
  set descripcion(value) {
    this.#descripcion = value;
  }

  get imagen() {
    return this.#imagen;
  }
  set imagen(value) {
    this.#imagen = value ? value : DEFAULT_IMAGE;
  }
}

