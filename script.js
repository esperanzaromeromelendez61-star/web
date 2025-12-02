// ==========================
// 🎞️ CARRUSEL AUTOMÁTICO
// ==========================

// Seleccionamos los elementos del carrusel
const slide = document.querySelector(".slide");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0; // índice actual del carrusel
const total = document.querySelectorAll(".item").length; // total de imágenes

// Función que muestra el slide actual
function showSlide() {
  slide.style.transform = `translateX(-${index * 100}%)`;
}

// Botón siguiente
next.addEventListener("click", () => {
  index = (index + 1) % total; // si llega al final, vuelve al inicio
  showSlide();
});

// Botón anterior
prev.addEventListener("click", () => {
  index = (index - 1 + total) % total; // evita que sea negativo
  showSlide();
});

// Movimiento automático cada 5 segundos
setInterval(() => {
  index = (index + 1) % total;
  showSlide();
}, 5000);

// ==========================
// ✨ ANIMACIONES AL CARGAR
// ==========================

// Cuando la página termina de cargar, aparecen suavemente el logo y el título principal
window.addEventListener("load", () => {
  document.querySelector(".logo").style.opacity = "1";
  document.querySelector(".hero-title").style.opacity = "1";
});

// ==========================
// 🛒 CARRITO DE COMPRAS
// ==========================

// Seleccionamos los elementos del carrito
const carrito = document.querySelector(".carrito");
const dropdown = document.querySelector(".dropdown-carrito");
const cartItemsContainer = document.getElementById("cart-items");

// Array que almacenará los productos agregados
let carritoProductos = [];

// Controla si el carrito está visible o no
let carritoAbierto = false;

// Mostrar / ocultar carrito al hacer clic en el ícono
carrito.addEventListener("click", (e) => {
  e.stopPropagation(); // Evita que el clic se propague a otros elementos
  carritoAbierto = !carritoAbierto;
  dropdown.style.display = carritoAbierto ? "block" : "none";
});

// ==========================
// 🔄 FUNCIÓN PARA ACTUALIZAR CARRITO
// ==========================
function actualizarCarrito() {
  cartItemsContainer.innerHTML = ""; // Limpiamos el contenido previo

  // Si no hay productos, mostramos un mensaje
  if (carritoProductos.length === 0) {
    cartItemsContainer.innerHTML = `<tr><td colspan="5" class="empty">Carrito vacío</td></tr>`;
    document.querySelector(".cart-total").textContent = "Total: S/ 0.00";
    return;
  }

  let total = 0;

  // Recorremos los productos para construir las filas
  carritoProductos.forEach((producto, i) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = `
      <tr>
        <td><img src="${producto.imagen}" width="40"></td>
        <td>${producto.nombre}</td>
        <td>S/ ${producto.precio.toFixed(2)}</td>
        <td>
          <button class="menos" data-index="${i}">−</button>
          <span class="cantidad">${producto.cantidad}</span>
          <button class="mas" data-index="${i}">+</button>
        </td>
        <td><button class="eliminar" data-index="${i}">❌</button></td>
      </tr>
    `;
    cartItemsContainer.innerHTML += fila;
  });

  // Mostramos el total actualizado
  document.querySelector(".cart-total").textContent = `Total: S/ ${total.toFixed(2)}`;
}

// ==========================
// ➕ AGREGAR PRODUCTOS AL CARRITO
// ==========================

// Recorremos todos los botones con clase "agregar-carrito"
document.querySelectorAll(".agregar-carrito").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    // Obtenemos la tarjeta del producto
    const card = e.target.closest(".card");
    const nombre = card.querySelector("h3").textContent.trim();
    const precioTexto = card.querySelector(".precio").textContent.trim();
    const precioLimpio = parseFloat(precioTexto.replace(/[^\d.]/g, ""));
    const imagen = card.querySelector("img").src;

    if (isNaN(precioLimpio)) return; // seguridad por si falla el precio

    // Buscamos si el producto ya está en el carrito
    const existente = carritoProductos.find((p) => p.nombre === nombre);
    if (existente) {
      existente.cantidad += 1; // si existe, sumamos 1
    } else {
      // si no existe, lo agregamos como nuevo
      carritoProductos.push({ nombre, precio: precioLimpio, imagen, cantidad: 1 });
    }

    actualizarCarrito(); // actualizamos el contenido
  });
});

// ==========================
// ♻️ EVENTOS DENTRO DEL CARRITO (+, −, ❌)
// ==========================
cartItemsContainer.addEventListener("click", (e) => {
  e.stopPropagation(); // evita cerrar el carrito

  const index = e.target.getAttribute("data-index");

  // Aumentar cantidad
  if (e.target.classList.contains("mas")) {
    carritoProductos[index].cantidad += 1;

  // Disminuir cantidad
  } else if (e.target.classList.contains("menos")) {
    if (carritoProductos[index].cantidad > 1) {
      carritoProductos[index].cantidad -= 1;
    } else {
      // Si queda en 0, lo eliminamos del carrito
      carritoProductos.splice(index, 1);
    }

  // Eliminar producto completamente
  } else if (e.target.classList.contains("eliminar")) {
    carritoProductos.splice(index, 1);
  }

  actualizarCarrito();
});

// ==========================
// 🔍 BUSCADOR CON SUGERENCIAS
// ==========================

// Seleccionamos el campo de búsqueda y el contenedor de sugerencias
const searchInput = document.getElementById("search");
const sugerenciasDiv = document.getElementById("sugerencias");

// Obtenemos todos los productos del HTML
const productos = Array.from(document.querySelectorAll(".card")).map((card) => ({
  nombre: card.querySelector("h3").textContent.trim(),
  descripcion: card.querySelector("p").textContent.trim(),
  elemento: card, // referencia directa a la tarjeta del producto
}));

// Escuchamos los cambios en el buscador
searchInput.addEventListener("input", () => {
  const texto = searchInput.value.toLowerCase().trim();
  sugerenciasDiv.innerHTML = ""; // limpiamos sugerencias anteriores

  // Si el campo está vacío, mostramos todos los productos
  if (texto === "") {
    sugerenciasDiv.style.display = "none";
    productos.forEach((p) => (p.elemento.style.display = "block"));
    return;
  }

  // Filtramos los productos que coinciden con el texto
  const coincidencias = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
  );

  // Si hay coincidencias, las mostramos
  if (coincidencias.length > 0) {
    coincidencias.forEach((p) => {
      const sugerencia = document.createElement("div");
      sugerencia.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${p.nombre}`;

      // Al hacer clic en una sugerencia, se muestra solo ese producto
      sugerencia.addEventListener("click", () => {
        searchInput.value = p.nombre;
        sugerenciasDiv.style.display = "none";
        productos.forEach((prod) => {
          prod.elemento.style.display = prod.nombre === p.nombre ? "block" : "none";
        });
      });

      sugerenciasDiv.appendChild(sugerencia);
    });
  } else {
    // Si no hay resultados, mostramos un mensaje
    sugerenciasDiv.innerHTML = "<div>No se encontraron resultados</div>";
  }

  sugerenciasDiv.style.display = "block"; // mostramos el panel de sugerencias
});

// ==========================
// 💻 SLIDER DE LAPTOPS (MANUAL, BUCLE INFINITO REAL)
// ==========================
const laptopSlider = document.querySelector(".laptop-slider");
const btnNext = document.querySelector(".slider-btn.next");
const btnPrev = document.querySelector(".slider-btn.prev");

// 🔁 Clonamos los elementos para crear el efecto infinito
const slides = Array.from(laptopSlider.children);
slides.forEach(slide => {
  const clone = slide.cloneNode(true);
  laptopSlider.appendChild(clone);
});

// 📏 Tamaño de una tarjeta (ancho aproximado)
const cardWidth = slides[0].offsetWidth + 20; // incluye margen/gap
let currentScroll = 0;

// 🎯 Función para mover el slider
function moveSlider(amount) {
  currentScroll += amount;
  laptopSlider.scrollTo({ left: currentScroll, behavior: "smooth" });

  // 🔁 Si llega al final (la mitad duplicada), vuelve al inicio
  if (currentScroll >= laptopSlider.scrollWidth / 2) {
    currentScroll = 0;
    setTimeout(() => laptopSlider.scrollTo({ left: currentScroll, behavior: "instant" }), 500);
  }

  // 🔁 Si retrocede más allá del inicio, salta al final de la mitad duplicada
  if (currentScroll < 0) {
    currentScroll = laptopSlider.scrollWidth / 2 - cardWidth;
    setTimeout(() => laptopSlider.scrollTo({ left: currentScroll, behavior: "instant" }), 500);
  }
}

// ▶️ Botones de navegación
btnNext.addEventListener("click", () => moveSlider(cardWidth));
btnPrev.addEventListener("click", () => moveSlider(-cardWidth));
