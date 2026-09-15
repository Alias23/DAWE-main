import { productos, carrito, crearProducto } from './tienda.js';

const DEFAULT_IMAGE = './imagenes/default.jpg';
const productosContainer = document.getElementById('productos-container');
const searchInput = document.getElementById('searchInput');
const searchQueryDisplay = document.getElementById('search-query');
const productCount = document.getElementById('product-count');
const paginationUl = document.querySelector('.pagination');
let currentPage = 1;
const itemsPerPage = 6;
let productosFiltrados = [];


// Función para paginar una lista de productos
export function paginate(list, page = 1, itemsPerPage = 6) {
    const start = (page - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  }
// Función para buscar productos
export function searchProducts(query) {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return productos.filter(product =>
    product.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery)
  );
}

function buscarProducto(query) {
    currentPage = 1; 
    searchQueryDisplay.textContent = query; 
    productosFiltrados = searchProducts(query);
    mostrarProductos(productosFiltrados);
  }
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    buscarProducto(query);
  })

// ------------------------------------------
// Función para mostrar productos 
// ------------------------------------------
function mostrarProductos(listaProductos) {
  productosContainer.innerHTML = '';
  const paginatedProducts = paginate(listaProductos, currentPage, itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, listaProductos.length);

  if (listaProductos.length === 0) {
    productCount.textContent = `Mostrando 0-0 de 0 productos`;
    productosContainer.innerHTML = '<p class="text-center w-100">No se encontraron productos.</p>';
    paginationUl.innerHTML = '';
    return;
  }

  productCount.textContent = `Mostrando ${start}-${end} de ${listaProductos.length} productos`;

  paginatedProducts.forEach(producto => {
    let extraInfo = '';
    let extraLabel = '';
    if (producto.inalambrico !== undefined) {
      extraInfo = producto.inalambrico ? 'Inalámbrico' : 'Con cable';
      extraLabel = 'Tipo';
    } else if (producto.tipo !== undefined) {
      extraInfo = producto.tipo ? 'Mecánico' : 'De membrana';
      extraLabel = 'Tipo';
    } else if (producto.microfono !== undefined) {
      extraInfo = producto.microfono ? 'Con micrófono' : 'Sin micrófono';
      extraLabel = 'Micrófono';
    } else if (producto.tamaño) {
      extraInfo = `${producto.tamaño}"`;
      extraLabel = 'Pulgadas';
    } else if (producto.potencia) {
      extraInfo = `${producto.potencia}W`;
      extraLabel = 'Potencia';
    }

    const card = document.createElement('div');
    card.classList.add('col');
    card.innerHTML = `
      <div class="card shadow-sm h-100 producto-card" type="button">
        <div class="position-relative">
          <img src="${producto.imagen || DEFAULT_IMAGE}" class="producto-imagen" alt="${producto.nombre}" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'">
          <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" class="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center p-2 shadow-sm" onclick="event.stopPropagation(); addToCart(${productos.indexOf(producto)})">
            <span class="material-symbols-rounded fs-5">shopping_cart</span>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text"><strong>Precio:</strong> ${producto.precio.toFixed(2)}€</p>
          ${extraInfo ? `<p class="card-text extra-card"><strong>${extraLabel}:</strong> ${extraInfo}</p>` : ''}
          <p class="card-text">${producto.descripcion.length > 100 ? producto.descripcion.slice(0, 100) + '...' : producto.descripcion}</p>
        </div>
      </div>
    `;
    card.addEventListener('click', () => showProductDetails(producto));
    productosContainer.appendChild(card);
  });

  updatePagination(listaProductos);
}

// -----------------------------------
// Función para actualizar la paginación
// -----------------------------------
function updatePagination(productList) {
  const paginationUl = document.querySelector('.pagination');
  paginationUl.innerHTML = '';
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const productCount = document.getElementById('product-count');

  if (productList.length === 0) {
    productCount.textContent = `Mostrando 0-0 de 0 productos`;
    return;
  }
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'opacity-0' : ''}`;
  prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  prevLi.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      mostrarProductos(productList);
    }
  });
  paginationUl.appendChild(prevLi);
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageLi.addEventListener('click', () => {
      currentPage = i;
      mostrarProductos(productList);
    });
    paginationUl.appendChild(pageLi);
  }

  if (totalPages > 1) {
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'opacity-0' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
    nextLi.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        mostrarProductos(productList);
      }
    });
    paginationUl.appendChild(nextLi);
  }
}

// -------------------------------------------------
// Función para mostrar detalles del producto (modal)
// -------------------------------------------------
function showProductDetails(product) {
  const overlay = document.getElementById('product-overlay');
  const title = document.getElementById('detail-title');
  const image = document.getElementById('detail-image');
  const price = document.getElementById('detail-price');
  const extraContainer = document.getElementById('detail-extra-container');
  const description = document.getElementById('detail-description');

  title.textContent = product.nombre;
  image.src = product.imagen || DEFAULT_IMAGE;
  price.textContent = `${product.precio.toFixed(2)}€`;

  let extraInfo = '';
  let extraLabel = '';
  if (productoHasExtra(product)) {
    if (product.inalambrico !== undefined) {
      extraInfo = product.inalambrico ? 'Inalámbrico' : 'Con cable';
      extraLabel = 'Tipo';
    } else if (product.tipo !== undefined) {
      extraInfo = product.tipo ? 'Mecánico' : 'De membrana';
      extraLabel = 'Tipo';
    } else if (product.microfono !== undefined) {
      extraInfo = product.microfono ? 'Con micrófono' : 'Sin micrófono';
      extraLabel = 'Micrófono';
    } else if (product.tamaño) {
      extraInfo = `${product.tamaño}"`;
      extraLabel = 'Pulgadas';
    } else if (product.potencia) {
      extraInfo = `${product.potencia}W`;
      extraLabel = 'Potencia';
    }
  }
  extraContainer.innerHTML = extraInfo ? `<p class="card-text extra-card fs-5"><strong>${extraLabel}:</strong> ${extraInfo}</p>` : '';
  description.textContent = product.descripcion;

  overlay.classList.remove('d-none');
  document.body.classList.add('overflow-hidden');
}

function productoHasExtra(product) {
  return (
    product.inalambrico !== undefined ||
    product.tipo !== undefined ||
    product.microfono !== undefined ||
    product.tamaño ||
    product.potencia
  );
}

document.getElementById('product-overlay').addEventListener('click', () => {
  document.getElementById('product-overlay').classList.add('d-none');
  document.body.classList.remove('overflow-hidden');
});

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('product-overlay').classList.add('d-none');
  document.body.classList.remove('overflow-hidden');
});

// ----------------------------------------
// Función para agregar un producto al carrito
// ----------------------------------------
function addToCart(productIndex) {
  const product = productos[productIndex];
  const existingItem = carrito.find(item => item.id === product.id);

  if (existingItem) {
    if (existingItem.cantidad < 20) {
      existingItem.cantidad++;
    } else {
      showQuantityAlert(carrito.indexOf(existingItem));
      return;
    }
  } else {
    carrito.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1
    });
  }
  renderCart();
  updateCartTotal();
}
window.addToCart = addToCart; 

// ----------------------------------------
// Función para mostrar productos en el carrito
// ----------------------------------------
function renderCart() {
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';

  carrito.forEach((item, index) => {
    const itemHTML = `
      <div class="row mb-3 align-items-center" data-index="${index}">
        <div class="col-3">
          <img src="${item.imagen || DEFAULT_IMAGE}" class="img-fluid rounded" alt="${item.nombre}" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'">
        </div>
        <div class="col-7">
          <h6 class="mb-1">${item.nombre}</h6>
          <div class="d-flex align-items-center">
            <span class="me-2">${item.precio.toFixed(2)}€</span>
            <span class="me-2">×</span>
            <input type="number" class="form-control form-control-sm cart-quantity-input" value="${item.cantidad}" min="0" max="21" style="width: 70px;">
          </div>
          <div class="text-danger mt-1" id="alert-${index}" style="display: none;">¡Máximo 20 unidades!</div>
        </div>
        <div class="col-2 text-center">
          <span class="fw-bold">${(item.precio * item.cantidad).toFixed(2)}€</span>
        </div>
      </div>
      <hr class="my-2">
    `;
    container.innerHTML += itemHTML;
  });

  document.querySelectorAll('.cart-quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      updateQuantity(e.target);
      updateCartTotal();
    });
  });
}

// ----------------------------------------
// Funciones para actualizar cantidades y totales del carrito
// ----------------------------------------
function updateQuantity(input) {
    const index = input.closest('.row').dataset.index;
    let newQuantity = parseInt(input.value);
    if (newQuantity < 1) {
      carrito.splice(index, 1);
      renderCart();
      updateCartTotal();
      return;
    }
    if (newQuantity > 20) {
      newQuantity = 20;
      input.value = 20;
      showQuantityAlert(index);
    }
  
    carrito[index].cantidad = newQuantity;
    updateItemTotal(index, input);
    updateCartTotal();
  }

function showQuantityAlert(index) {
  const alertElem = document.getElementById(`alert-${index}`);
  alertElem.style.display = 'block';
  setTimeout(() => {
    alertElem.style.display = 'none';
  }, 2000);
}

function updateItemTotal(index, input) {
  const row = input.closest('.row');
  const totalItem = (carrito[index].precio * carrito[index].cantidad).toFixed(2);
  row.querySelector('.col-2 span').textContent = `${totalItem}€`;
}

function updateCartTotal() {
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// ----------------------------------------
// Formulario para añadir productos
// ----------------------------------------
document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tipo = document.getElementById('productType').value;
  const nombre = document.getElementById('productName').value;
  const precio = parseFloat(document.getElementById('productPrice').value);
  const descripcion = document.getElementById('productDescription').value;
  const imagenFile = document.getElementById('productImage').files[0];

  let extra;
  const extraElement = document.getElementById('extra');

  if (extraElement) {
    if (extraElement.type === "checkbox") {
      extra = extraElement.checked;
    } else if (extraElement.type === "radio") {
      const selectedRadio = document.querySelector('input[name="keyboardType"]:checked');
      extra = (selectedRadio && selectedRadio.value === "true");
    } else {
      extra = extraElement.value;
    }
  }

  if (!tipo || !nombre || isNaN(precio) || !descripcion) {
    mostrarAlerta('alert-vacio');
    return;
  }

  if (imagenFile) {
    const formatosPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    if (!formatosPermitidos.includes(imagenFile.type)) {
      mostrarAlerta('alert-imagen-formato');
      return;
    }
  }

  if (document.getElementById('productImage').files.length > 1) {
    mostrarAlerta('alert-una-imagen');
    return;
  }

  const rutasImagenes = {
    'Altavoz': 'imagenes/altavoz/',
    'Pantalla': 'imagenes/pantalla/',
    'Cascos': 'imagenes/cascos/',
    'Raton': 'imagenes/raton/',
    'Teclado': 'imagenes/teclado/'
  };

  const rutaBase = rutasImagenes[tipo];
  let rutaImagen = imagenFile ? `${rutaBase}${imagenFile.name}` : '';
  if (imagenFile){rutaImagen = URL.createObjectURL(imagenFile);}
  
  const nuevoProducto = crearProducto(tipo, nombre, precio, descripcion, rutaImagen, extra);
  if (nuevoProducto) {
    mostrarProductos(productos);
    mostrarAlerta('alert-exito');
  }
});

// ----------------------------------------
// Función para mostrar alertas
// ----------------------------------------
function mostrarAlerta(id) {
  const alerta = document.getElementById(id);
  alerta.classList.remove('d-none');
  setTimeout(() => {
    alerta.classList.add('d-none');
  }, 3000);
}

// ----------------------------------------
// Manejo del cambio en el tipo de producto para mostrar en el formulario
// ----------------------------------------
document.getElementById('productType').addEventListener('change', function() {
  const tipo = this.value;
  const extraFieldContainer = document.getElementById('extraFieldContainer');
  extraFieldContainer.innerHTML = '';

  if (tipo === 'Raton') {
    extraFieldContainer.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="extra">
        <label class="form-check-label">Inalámbrico</label>
      </div>
    `;
  } else if (tipo === 'Teclado') {
    extraFieldContainer.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="keyboardType" id="extra" value="true">
        <label class="form-check-label">Mecánico</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="keyboardType" id="extra" value="false">
        <label class="form-check-label">Membrana</label>
      </div>
    `;
  } else if (tipo === 'Pantalla') {
    extraFieldContainer.innerHTML = `
      <div class="form-floating mb-3">
        <input type="number" class="form-control" id="extra" placeholder="Pulgadas">
        <label>Tamaño (Pulgadas)</label>
      </div>
    `;
  } else if (tipo === 'Cascos') {
    extraFieldContainer.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="extra">
        <label class="form-check-label">Con Micrófono</label>
      </div>
    `;
  } else if (tipo === 'Altavoz') {
    extraFieldContainer.innerHTML = `
      <div class="form-floating mb-3">
        <input type="number" class="form-control" id="extra" placeholder="Potencia (W)">
        <label>Potencia (W)</label>
      </div>
    `;
  }
});

// ----------------------------------------
// Funcionalidad de drag & drop para la imagen del producto
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const originalText = dropZone.innerHTML;

  function handleDragOver(event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDragLeave() {
    dropZone.style.border = '2px dashed #ccc';
  }

  function handleDrop(event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      document.getElementById('productImage').files = files;
      dropZone.innerHTML = '¡Elemento añadido!';
      setTimeout(() => {
        dropZone.innerHTML = originalText;
      }, 1500);
    }
  }

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
});

// ----------------------------------------
// Funcionalidad extra para ordenar productos por precio
// ----------------------------------------
let ascendingOrder = true;
document.getElementById('sort-price').addEventListener('click', () => {
  const listaAOrdenar = (productosFiltrados && productosFiltrados.length > 0) ? productosFiltrados : productos;
  listaAOrdenar.sort((a, b) => ascendingOrder ? a.precio - b.precio : b.precio - a.precio);
  ascendingOrder = !ascendingOrder;
  mostrarProductos(listaAOrdenar);
});

// Renderizado inicial de productos
mostrarProductos(productos);