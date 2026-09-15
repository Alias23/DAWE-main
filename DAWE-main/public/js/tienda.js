import Raton from './raton.js';
import Teclado from './teclado.js';
import Pantalla from './pantalla.js';
import Cascos from './cascos.js';
import Altavoz from './altavoz.js';

export const productos = [];
export const carrito = [];


// Raton
productos.push(
  new Raton("Ratón Óptico", 25.99, "Ratón óptico de alta precisión", "imagenes/raton/raton1.jpg", true)
);
productos.push(
  new Raton("Ratón Inalámbrico", 29.99, "Ratón inalámbrico con conexión Bluetooth", "imagenes/raton/raton2.jpg", true)
);
productos.push(
  new Raton("Ratón Gamer", 45.99, "Ratón gamer con botones programables", "imagenes/raton/raton3.jpg", false)
);

// Teclado 
productos.push(
  new Teclado("Teclado Mecánico", 59.99, "Teclado mecánico con retroiluminación RGB", "imagenes/teclado/teclado1.webp", true)
);
productos.push(
  new Teclado("Teclado de Membrana", 39.99, "Teclado de membrana resistente para uso diario", "imagenes/teclado/teclado2.jpg", false)
);
productos.push(
  new Teclado("Teclado Ergonómico", 49.99, "Teclado ergonómico para mayor comodidad", "imagenes/teclado/teclado3.webp", false)
);

// Pantalla 
productos.push(
  new Pantalla("Pantalla LED 24\"", 149.99, "Pantalla LED de 24 pulgadas con alta definición", "imagenes/pantalla/pantalla1.jpg", 24)
);
productos.push(
  new Pantalla("Pantalla IPS 27\"", 199.99, "Pantalla IPS de 27 pulgadas con colores vivos", "imagenes/pantalla/pantalla2.jpg", 27)
);
productos.push(
  new Pantalla("Pantalla Ultra HD 32\"", 249.99, "Pantalla Ultra HD de 32 pulgadas", "imagenes/pantalla/pantalla3.jpg", 32)
);

// Cascos 
productos.push(
  new Cascos("Cascos Estándar", 29.99, "Cascos con sonido de alta calidad", "imagenes/cascos/cascos1.jpg", true)
);
productos.push(
  new Cascos("Cascos Gaming", 49.99, "Cascos gaming sin micrófono integrado", "imagenes/cascos/cascos2.jpg", false)
);
productos.push(
  new Cascos("Cascos Inalámbricos", 59.99, "Cascos inalámbricos con cancelación de ruido", "imagenes/cascos/cascos3.jpg", true)
);

// Altavoz
productos.push(
  new Altavoz("Altavoz Portátil", 39.99, "Altavoz Bluetooth portátil y compacto", "imagenes/altavoz/altavoz1.jpg", 10)
);
productos.push(
  new Altavoz("Altavoz para Casa", 89.99, "Altavoz con gran potencia para uso doméstico", "imagenes/altavoz/altavoz2.jpg", 25)
);
productos.push(
  new Altavoz("Altavoz Profesional", 129.99, "Altavoz profesional para eventos", "imagenes/altavoz/altavoz3.jpg", 40)
);

export function crearProducto(tipo, nombre, precio, descripcion, rutaImagen, extra) {
  let nuevoProducto;
  switch (tipo) {
    case 'Raton':
      nuevoProducto = new Raton(nombre, precio, descripcion, rutaImagen, extra);
      break;
    case 'Teclado':
      nuevoProducto = new Teclado(nombre, precio, descripcion, rutaImagen, extra);
      break;
    case 'Pantalla':
      nuevoProducto = new Pantalla(nombre, precio, descripcion, rutaImagen, extra);
      break;
    case 'Cascos':
      nuevoProducto = new Cascos(nombre, precio, descripcion, rutaImagen, extra);
      break;
    case 'Altavoz':
      nuevoProducto = new Altavoz(nombre, precio, descripcion, rutaImagen, extra);
      break;
    default:
      console.error("Tipo de producto no reconocido.");
      return null;
  }
  productos.push(nuevoProducto);
  return nuevoProducto;
}
