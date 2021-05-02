"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//variables y selectoresc
var formulario = document.querySelector('#agregar-gasto');
var gastoListado = document.querySelector('#gastos ul'); //variable let

var presupuesto; //eventos

eventListenner();

function eventListenner() {
  //despues de cargar el documento mandara a llamar a una funcion
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
} //classes


var Presupuesto =
/*#__PURE__*/
function () {
  function Presupuesto(presupuesto) {
    _classCallCheck(this, Presupuesto);

    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  _createClass(Presupuesto, [{
    key: "nuevoGasto",
    value: function nuevoGasto(gasto) {
      this.gastos = [].concat(_toConsumableArray(this.gastos), [gasto]);
      this.calcularRestante();
    }
  }, {
    key: "calcularRestante",
    value: function calcularRestante() {
      //obtener lo gastado
      var gastado = this.gastos.reduce(function (total, gasto) {
        return total + gasto.cantidad;
      }, 0);
      this.restante = this.presupuesto - gastado;
    }
  }, {
    key: "eliminarGasto",
    value: function eliminarGasto(id) {
      this.gastos = this.gastos.filter(function (gasto) {
        return gasto.id !== id;
      });
      this.calcularRestante();
    }
  }]);

  return Presupuesto;
}();

var UI =
/*#__PURE__*/
function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, [{
    key: "insertarPresupuesto",
    value: function insertarPresupuesto(cantidad) {
      var presupuesto = cantidad.presupuesto,
          restante = cantidad.restante;
      document.querySelector('#total').textContent = presupuesto;
      document.querySelector('#restante').textContent = restante;
    }
  }, {
    key: "imprimirAlerta",
    value: function imprimirAlerta(mensaje, tipo) {
      //crear el div
      var divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert');

      if (tipo === 'error') {
        divMensaje.classList.add('alert-danger');
      } else {
        divMensaje.classList.add('alert-success');
      }

      divMensaje.textContent = mensaje; //insertar en el html

      document.querySelector('.primario').insertBefore(divMensaje, formulario); //quitar del html

      setTimeout(function () {
        divMensaje.remove();
      }, 3000);
    }
  }, {
    key: "mostraGastos",
    value: function mostraGastos(gastos) {
      this.limpiarHTML(); //iterar sobre los gastos

      gastos.forEach(function (gasto) {
        var cantidad = gasto.cantidad,
            nombre = gasto.nombre,
            id = gasto.id; //crear li

        var nuevoGasto = document.createElement('li');
        nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
        nuevoGasto.dataset.id = id; //agregar el html del gasto

        nuevoGasto.innerHTML = "\n            ".concat(nombre, " <span class = \"badge badge-primary badge-pill\"> ").concat(cantidad, "</span>\n            \n            "); //boton para borrar el gasto

        var btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.innerHTML = 'Borrar &times';

        btnBorrar.onclick = function () {
          eliminarGasto(id);
        };

        nuevoGasto.appendChild(btnBorrar); //agregar al HTML

        gastoListado.appendChild(nuevoGasto);
      });
    }
  }, {
    key: "limpiarHTML",
    value: function limpiarHTML() {
      while (gastoListado.firstElementChild) {
        gastoListado.removeChild(gastoListado.firstChild);
      }
    }
  }, {
    key: "actualizarRestante",
    value: function actualizarRestante(restante) {
      document.querySelector('#restante').textContent = restante;
    }
  }, {
    key: "comprobarPresupuesto",
    value: function comprobarPresupuesto(presupuestoObj) {
      var presupuesto = presupuestoObj.presupuesto,
          restante = presupuestoObj.restante;
      var restanteDiv = document.querySelector('.restante'); //comprobar 25%

      if (presupuesto / 4 > restante) {
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger');
      } else if (presupuesto / 2 > restante) {
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');
      } //si el total es 0


      if (restante <= 0) {
        ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
        formulario.querySelector('button[type="submit"').disable = true;
      }
    }
  }]);

  return UI;
}(); //instanciador


var ui = new UI(); //funciones

function preguntarPresupuesto() {
  var presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  } //presupuestovalido


  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault(); //leer los datos de el formulario

  var nombre = document.querySelector('#gasto').value;
  var cantidad = Number(document.querySelector('#cantidad').value); //validar

  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida ', 'error');
    return;
  } //generar un objeto con el gasto


  var gasto = {
    nombre: nombre,
    cantidad: cantidad,
    id: Date.now()
  };
  presupuesto.nuevoGasto(gasto);
  ui.imprimirAlerta('Gasto agregado correctamente'); //imprimir los gastos

  var _presupuesto = presupuesto,
      gastos = _presupuesto.gastos,
      restante = _presupuesto.restante;
  ui.mostraGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto); //reinicio el formulario

  formulario.reset();
}

function eliminarGasto(id) {
  //elimina de la clase
  presupuesto.eliminarGasto(id); //elimina del html

  var _presupuesto2 = presupuesto,
      gastos = _presupuesto2.gastos,
      restante = _presupuesto2.restante;
  ui.mostraGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}