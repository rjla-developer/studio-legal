/* Melies — landing. Sin dependencias, sin rastreo, sin cookies.
   Todo el contenido se ve sin este archivo; esto solo lo va revelando. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  if (!("IntersectionObserver" in window)) { raiz.classList.remove("js"); return; }
  window.__melies = true;

  // 1. Lo que se revela al entrar a la pantalla (una sola vez).
  var revelar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visto"); revelar.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  document.querySelectorAll(".revela, .escalonado").forEach(function (el) { revelar.observe(el); });

  // El iris se mide por su contenedor: un elemento recortado a un punto no «se ve» para el observador.
  var iris = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.querySelectorAll(".iris").forEach(function (i) { i.classList.add("visto"); }); iris.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -18% 0px" });
  document.querySelectorAll(".iris").forEach(function (el) { iris.observe(el.parentElement); });

  // 2. El rodaje: el teléfono enseña la pantalla del paso que cruza la línea de lectura.
  var escenario = document.querySelector(".escenario");
  if (escenario) {
    var listaDePasos = document.querySelectorAll(".paso[data-paso]");
    var activar = function (paso) {
      escenario.setAttribute("data-paso", paso.getAttribute("data-paso"));
      listaDePasos.forEach(function (p) { p.classList.toggle("activo", p === paso); });
    };
    if (listaDePasos.length) activar(listaDePasos[0]);
    // La línea de lectura: justo donde se queda la tarjeta, debajo del teléfono.
    var pasos = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) activar(e.target); });
    }, { rootMargin: "-56% 0px -43% 0px" });
    listaDePasos.forEach(function (el) { pasos.observe(el); });
  }

  // 3. La cabecera se vuelve sólida y el carrete avanza con la lectura.
  var cabecera = document.querySelector(".cabecera");
  var carrete = document.querySelector(".carrete span");
  var pendiente = false;
  function pintar() {
    pendiente = false;
    var y = window.scrollY || window.pageYOffset;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    if (cabecera) cabecera.classList.toggle("solida", y > 8);
    if (carrete) carrete.style.transform = "scaleX(" + (alto > 0 ? Math.min(1, y / alto) : 0) + ")";
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; window.requestAnimationFrame(pintar); }
  }, { passive: true });
  pintar();

  // 4. Si el teléfono no está en el idioma de la página, ofrecer el otro (sin redirigir).
  var aviso = document.getElementById("otro-idioma");
  if (aviso) {
    var idiomaPagina = (raiz.getAttribute("lang") || "es").slice(0, 2);
    var idiomas = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    var hablaEste = Array.prototype.some.call(idiomas, function (l) { return String(l).slice(0, 2).toLowerCase() === idiomaPagina; });
    if (!hablaEste) aviso.hidden = false;
  }
})();
