// Le pasa a la app el enlace de un correo de Melies (6-oct-2026).
//
// El correo trae https://meliesapp.com/cuenta/#<tipo>=<token>. El token va en el
// fragmento: el navegador no lo manda a ningún servidor ni en el Referer. Aquí
// se lee, se quita de la barra y del historial, y se abre
// rjstudio://correo/<tipo>?token=<token>. La página NO llama al API: quien usa
// el token es la app, con un POST, así que un antivirus de correo que «abre»
// los enlaces para revisarlos no lo gasta.
(function () {
  'use strict'
  var TITULOS = {
    verificar: 'Confirmar tu correo',
    restablecer: 'Elegir una contraseña nueva',
    ligar: 'Agregar tu contraseña a tu cuenta',
  }
  var r = /^#(verificar|restablecer|ligar)=([A-Za-z0-9_-]{43})$/.exec(window.location.hash || '')
  var titulo = document.getElementById('titulo')
  var que = document.getElementById('que')
  var boton = document.getElementById('abrir')
  if (!r) {
    titulo.textContent = 'Este enlace no está completo'
    que.textContent = 'Copia la dirección entera del correo, o pide otro desde la app.'
    return
  }
  var app = 'rjstudio://correo/' + r[1] + '?token=' + r[2]
  // Que el token no se quede en la barra ni en el historial del navegador.
  try { window.history.replaceState(null, '', window.location.pathname) } catch (e) { /* sin historial: da igual */ }
  titulo.textContent = TITULOS[r[1]] + ' en Melies'
  boton.href = app
  boton.textContent = 'Abrir en Melies'
  boton.hidden = false
  window.location.replace(app)
})()
