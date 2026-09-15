import Producto from './producto.js';

export default class Cascos extends Producto {
  #microfono;

  constructor(nombre, precio, descripcion, imagen, microfono) {
    super(nombre, precio, descripcion, imagen);
    this.#microfono = microfono;
  }

  get microfono() {
    return this.#microfono;
  }
  set conMicrofono(value) {
    this.#microfono = value;
  }
}
