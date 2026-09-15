import Producto from './producto.js';

export default class Teclado extends Producto {
  #tipo;

  constructor(nombre, precio, descripcion, imagen, tipo) {
    super(nombre, precio, descripcion, imagen);
    this.#tipo = tipo;
  }

  get tipo() {
    return this.#tipo;
  }
  set tipo(value) {
    this.#tipo = value;
  }
}
