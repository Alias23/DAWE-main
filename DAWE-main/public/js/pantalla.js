import Producto from './producto.js';

export default class Pantalla extends Producto {
  #tamaño;

  constructor(nombre, precio, descripcion, imagen, tamaño) {
    super(nombre, precio, descripcion, imagen);
    this.#tamaño = tamaño;
  }

  get tamaño() {
    return this.#tamaño;
  }
  set tamaño(value) {
    this.#tamaño = value;
  }
}
