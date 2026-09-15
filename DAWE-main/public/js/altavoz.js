import Producto from './producto.js';

export default class Altavoz extends Producto {
  #potencia;

  constructor(nombre, precio, descripcion, imagen, potencia) {
    super(nombre, precio, descripcion, imagen);
    this.#potencia = potencia;
  }

  get potencia() {
    return this.#potencia;
  }
  set potencia(value) {
    this.#potencia = value;
  }
}
