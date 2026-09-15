import Producto from './producto.js';

export default class Raton extends Producto {
  #inalambrico;

  constructor(nombre, precio, descripcion, imagen, inalambrico) {
    super(nombre, precio, descripcion, imagen);
    this.#inalambrico = inalambrico;
  }

  get inalambrico() {
    return this.#inalambrico;
  }
  set inalambrico(value) {
    this.#inalambrico = value;
  }
}

