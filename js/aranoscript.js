// URL de la API de TheCocktailDB
const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

// Elementos del DOM
const buscarInput = document.querySelector('#buscarInput');
const buscarBtn = document.querySelector('#buscarBtn');
const randomBtn = document.querySelector('#randomBtn');
const contenedorCocktails = document.querySelector('#contenedorCocktails');
const mensajesDiv = document.querySelector('#mensajes');
const tituloResultados = document.querySelector('#tituloResultados');
const modalDetalles = new bootstrap.Modal(document.getElementById('modalDetalles'));
const modalCuerpo = document.querySelector('#modalCuerpo');
const inicioLink = document.querySelector('#inicioLink');
const aleatorioLink = document.querySelector('#aleatorioLink');

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada - Buscador de Cócteles');
    cargarCocktailsPopulares();
    
    // Eventos
    buscarBtn.addEventListener('click', buscarCocktails);
    
    buscarInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarCocktails();
        }
    });
    
    randomBtn.addEventListener('click', buscarAleatorio);
    
    inicioLink.addEventListener('click', function(e) {
        e.preventDefault();
        cargarCocktailsPopulares();
    });
    
    aleatorioLink.addEventListener('click', function(e) {
        e.preventDefault();
        buscarAleatorio();
    });
});

// Mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajesDiv.innerHTML = `
        <div class="mensaje mensaje-${tipo}">
            ${texto}
        </div>
    `;
    
    setTimeout(function() {
        mensajesDiv.innerHTML = '';
    }, 3000);
}

// Buscar cócteles
async function buscarCocktails() {
    const termino = buscarInput.value.trim();
    
    if (!termino) {
        mostrarMensaje('Escribe un nombre para buscar', 'error');
        buscarInput.focus();
        return;
    }
    
    // Mostrar cargando
    contenedorCocktails.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border" style="width: 3rem; height: 3rem; color: #FF6B35" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fs-5" style="color: #FF6B35">Buscando cócteles...</p>
        </div>
    `;
    
    try {
        const respuesta = await fetch(API_URL + 'search.php?s=' + encodeURIComponent(termino));
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }
        
        const datos = await respuesta.json();
        
        if (datos.drinks && datos.drinks.length > 0) {
            mostrarCocktails(datos.drinks);
            tituloResultados.textContent = `Resultados para: ${termino}`;
            mostrarMensaje(`Encontrados ${datos.drinks.length} cócteles`, 'exito');
        } else {
            contenedorCocktails.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="fs-4" style="color: #FF6B35">No se encontraron cócteles</p>
                    <p style="color: #FF8E53">Intenta con otro nombre</p>
                </div>
            `;
            mostrarMensaje('No hay resultados para tu búsqueda', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        contenedorCocktails.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4" style="color: #FF6B35">Error al buscar</p>
                <p style="color: #FF8E53">Por favor, intenta más tarde</p>
            </div>
        `;
        mostrarMensaje('Error de conexión', 'error');
    }
}

// Cóctel aleatorio
async function buscarAleatorio() {
    // Mostrar cargando
    contenedorCocktails.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border" style="width: 3rem; height: 3rem; color: #FF6B35" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fs-5" style="color: #FF6B35">Obteniendo cóctel aleatorio...</p>
        </div>
    `;
    
    try {
        const respuesta = await fetch(API_URL + 'random.php');
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }
        
        const datos = await respuesta.json();
        
        if (datos.drinks && datos.drinks.length > 0) {
            mostrarCocktails(datos.drinks);
            tituloResultados.textContent = 'Cóctel Aleatorio';
            buscarInput.value = datos.drinks[0].strDrink;
            mostrarMensaje('¡Cóctel aleatorio cargado!', 'exito');
        }
    } catch (error) {
        console.error('Error:', error);
        contenedorCocktails.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4" style="color: #FF6B35">Error al cargar</p>
                <p style="color: #FF8E53">No se pudo obtener el cóctel</p>
            </div>
        `;
        mostrarMensaje('Error de conexión', 'error');
    }
}

// Cargar cócteles populares
async function cargarCocktailsPopulares() {
    // Mostrar cargando
    contenedorCocktails.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border" style="width: 3rem; height: 3rem; color: #FF6B35" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fs-5" style="color: #FF6B35">Cargando cócteles populares...</p>
        </div>
    `;
    
    try {
        const respuesta = await fetch(API_URL + 'search.php?s=margarita');
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }
        
        const datos = await respuesta.json();
        
        if (datos.drinks && datos.drinks.length > 0) {
            const cocktails = datos.drinks.slice(0, 8);
            mostrarCocktails(cocktails);
            tituloResultados.textContent = 'Cócteles Populares';
            mostrarMensaje('Cócteles populares cargados', 'exito');
        }
    } catch (error) {
        console.error('Error:', error);
        contenedorCocktails.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4" style="color: #FF6B35">Error al cargar</p>
                <p style="color: #FF8E53">No se pudieron cargar los cócteles</p>
            </div>
        `;
        mostrarMensaje('Error de conexión', 'error');
    }
}

// Mostrar cócteles
function mostrarCocktails(cocktails) {
    contenedorCocktails.innerHTML = '';
    
    cocktails.forEach(cocktail => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
        
        const esAlcoholico = cocktail.strAlcoholic === 'Alcoholic';
        const tipoTexto = esAlcoholico ? 'Alcohólico' : 'Sin alcohol';
        
        col.innerHTML = `
            <div class="cocktail-card h-100">
                <img src="${cocktail.strDrinkThumb}" 
                     alt="${cocktail.strDrink}" 
                     class="cocktail-img">
                <div class="cocktail-body d-flex flex-column">
                    <h3 class="cocktail-nombre">${cocktail.strDrink}</h3>
                    <p class="cocktail-categoria">${cocktail.strCategory || 'Sin categoría'}</p>
                    <span class="cocktail-tipo">${tipoTexto}</span>
                    <button class="btn-detalles mt-auto" data-id="${cocktail.idDrink}">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
        
        contenedorCocktails.appendChild(col);
    });
    
    // Añadir eventos a botones
    const botones = document.querySelectorAll('.btn-detalles');
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            verDetalles(id);
        });
    });
}

// Ver detalles
async function verDetalles(id) {
    try {
        const respuesta = await fetch(API_URL + 'lookup.php?i=' + id);
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }
        
        const datos = await respuesta.json();
        
        if (datos.drinks && datos.drinks[0]) {
            mostrarModal(datos.drinks[0]);
        } else {
            mostrarMensaje('No se encontraron detalles', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar detalles', 'error');
    }
}

// Mostrar modal
function mostrarModal(cocktail) {
    let ingredientesHTML = '';
    
    for (let i = 1; i <= 15; i++) {
        const ingrediente = cocktail['strIngredient' + i];
        const medida = cocktail['strMeasure' + i];
        
        if (ingrediente && ingrediente.trim()) {
            ingredientesHTML += `
                <li class="mb-2">
                    <span style="color: #FF6B35">${ingrediente}</span>
                    ${medida ? `<span style="color: #FF8E53"> - ${medida.trim()}</span>` : ''}
                </li>
            `;
        }
    }
    
    if (!ingredientesHTML) {
        ingredientesHTML = '<li style="color: #FF8E53">No hay información de ingredientes</li>';
    }
    
    const esAlcoholico = cocktail.strAlcoholic === 'Alcoholic';
    const tipoTexto = esAlcoholico ? 'Alcohólico' : 'Sin alcohol';
    
    modalCuerpo.innerHTML = `
        <div class="row">
            <div class="col-md-6 text-center">
                <img src="${cocktail.strDrinkThumb}" 
                     alt="${cocktail.strDrink}" 
                     class="img-fluid rounded mb-3 border border-3"
                     style="border-color: #FF6B35 !important; max-height: 300px;">
                
                <div class="mt-3">
                    <span class="badge" style="background: ${esAlcoholico ? '#FF6B35' : '#FF8E53'}; font-size: 1rem; padding: 8px 15px;">
                        ${tipoTexto}
                    </span>
                    <p class="mt-2">
                        <strong style="color: #FF6B35">Vaso:</strong> 
                        <span style="color: white">${cocktail.strGlass || 'No especificado'}</span>
                    </p>
                </div>
            </div>
            
            <div class="col-md-6">
                <h3 style="color: #FF6B35">${cocktail.strDrink}</h3>
                
                <p class="mb-3">
                    <strong style="color: #FF8E53">Categoría:</strong> 
                    <span style="color: white">${cocktail.strCategory || 'Sin categoría'}</span>
                </p>
                
                <h5 style="color: #FF6B35; margin-top: 20px;">Ingredientes:</h5>
                <ul class="list-unstyled">
                    ${ingredientesHTML}
                </ul>
                
                <h5 style="color: #FF6B35; margin-top: 20px;">Instrucciones:</h5>
                <p style="color: white">${cocktail.strInstructions || 'No hay instrucciones disponibles.'}</p>
                
            </div>
        </div>
    `;
    
    modalDetalles.show();
}