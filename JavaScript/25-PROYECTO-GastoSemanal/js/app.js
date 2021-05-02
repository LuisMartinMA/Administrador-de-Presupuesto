//variables y selectoresc
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
//variable let
let presupuesto;
//eventos
eventListenner();
function eventListenner() {
    //despues de cargar el documento mandara a llamar a una funcion
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);

}
//classes

class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
        
    }
    
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {

        //obtener lo gastado
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}
class UI{

    insertarPresupuesto(cantidad) {

       const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    
    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if (tipo ==='error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }


        divMensaje.textContent = mensaje;

        //insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //quitar del html
    
          setTimeout(() => {
              divMensaje.remove();
          }, 3000);
    }

    mostraGastos(gastos) {

        this.limpiarHTML();
        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;


            //agregar el html del gasto
            nuevoGasto.innerHTML = `
            ${nombre} <span class = "badge badge-primary badge-pill"> ${cantidad}</span>
            
            `;
               
            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTML

            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstElementChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if ( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if ((presupuesto / 2) > restante) {
             restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }
    
    //si el total es 0
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"').disable = true;
        }
    }
    

}

//instanciador
const ui = new UI();

//funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario)|| presupuestoUsuario<=0) {

        
        window.location.reload();
    }
    //presupuestovalido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);

}


function agregarGasto(e) {
 
    e.preventDefault();

    //leer los datos de el formulario

    const nombre = document.querySelector('#gasto').value;

    const cantidad = Number(document.querySelector('#cantidad').value);
    //validar
    if (nombre==='' ||cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else
        if (cantidad <= 0|| isNaN(cantidad)) {
            ui.imprimirAlerta('Cantidad no valida ', 'error');

            return;
        }
    
    
    
    //generar un objeto con el gasto

    const gasto = { nombre, cantidad, id: Date.now() };
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gasto agregado correctamente');
    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostraGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    //reinicio el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //elimina de la clase
    presupuesto.eliminarGasto(id);

    //elimina del html
    const { gastos, restante } = presupuesto;
    ui.mostraGastos(gastos);
     ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}