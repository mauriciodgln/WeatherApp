const contenedor = document.querySelector('.container');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const body = document.querySelector('body');

window.addEventListener('load', ()=> {
  formulario.addEventListener('submit', obtenerClima);
});

function obtenerClima(e){
  e.preventDefault();

  // Validar

  const pais = document.querySelector('#pais').value;
  const ciudad = document.querySelector('#ciudad').value;

  if(pais === '' || ciudad === '') {
    mostrarError('Ambos campos son obligatorios');
    return;
  }

  // Consultar API
  consultarAPI(pais, ciudad);

}

function mostrarError(mensaje) {

  const alerta = document.querySelector('#alerta');

  if(!alerta) {
    // Crear una alerta
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    alerta.setAttribute('id','alerta');

    alerta.innerHTML = `
    
      <strong class="font-bold">Error!</strong>
      <span class="block">${mensaje}</span>

    `;

    contenedor.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 5000);

  }
}

function consultarAPI(pais, ciudad) {

  const appId = '26e5e36b4be67342342bc94a1dc93eb4';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  spinner();

  setTimeout(() => {
    
    fetch(url)
    .then(resultado => resultado.json())
    .then(datos => {
      limpiarHTML();
      if(datos.cod === "404"){
        mostrarError('Ciudad no encontrada');
        console.clear();
      } else {
        mostrarHTML(datos)
      }
    })

  }, 1000);

}

function mostrarHTML(datos) {

  const {name, sys:{country}, main: {temp, temp_max, temp_min}, weather} = datos;
  const celsius = kelvinACelsius(temp);
  const celsiusMax = kelvinACelsius(temp_max);
  const celsiusMin = kelvinACelsius(temp_min);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.innerHTML = `${name}, ${country}`;
  nombreCiudad.classList.add('text-3xl');

  const tempActual = document.createElement('p');
  tempActual.innerHTML = `${celsius}°`;
  tempActual.classList.add('text-8xl', 'pl-4');

  const descriptionClima = document.createElement('p');
  descriptionClima.innerHTML = weather[0].description;
  descriptionClima.classList.add('text-xl', 'capitalize');

  const tempMax = document.createElement('p');
  tempMax.innerHTML = `Máx: ${celsiusMax}°`;
  tempMax.classList.add('text-xl');

  const tempMin = document.createElement('p');
  tempMin.innerHTML = `Min: ${celsiusMin}°`;
  tempMin.classList.add('text-xl');

  const divMaxMin = document.createElement('div');
  divMaxMin.classList.add('flex', 'justify-center', 'gap-4');
  divMaxMin.appendChild(tempMax);
  divMaxMin.appendChild(tempMin);

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(descriptionClima);
  resultadoDiv.appendChild(divMaxMin);

  resultado.appendChild(resultadoDiv);
}

function kelvinACelsius(temp) {
  return parseInt(temp - 273.15);
}

function limpiarHTML() {
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner() {
  
  limpiarHTML();

  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-chase');

  divSpinner.innerHTML = `
  
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>

  `;

  resultado.appendChild(divSpinner);

}