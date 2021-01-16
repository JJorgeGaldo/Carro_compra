
/* 3- Con esto leemos la info de cada producto y de dónde los vamos a situar*/
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")

const templateCard = document.getElementById("template-card").content /* El content es lo que nos da acceso a los elementos */
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content

const fragment = document.createDocumentFragment() /* creamos el fragment para incluirle la info y poder pintar el template en el DOM */
let carrito = {}

/* 1- Creamos un eventListener para que se ejecute el script una vez la página se haya cargado */
document.addEventListener("DOMContentLoaded",
    function(){
        fetchData()
});

/* 5- para detectar cada botón de compra, añadimos un evento click y nos aprovechamos del Event Delegation. El evento lo generamos sobre cards, que contiene a todos los elementos de cada producto individual, y sobre ese evento después seleccionamos lo que nos interese y aplicamos una acción para todos los elementos de manera globalThis, sin tener que ir uno a uno modificando comportamientos */
cards.addEventListener("click", e => {
    addCarrito(e)
})


/*2 -Recopilamos la información de la API Json y lo mostramos por consola
   Enviamos la info de la BD del json (data) a pintarCards para mostrarlo en la web  */

const fetchData = async() => {
    try{
        const res = await fetch ('../api.json')
        const data = await res.json()
        console.log(data)
        pintarCards(data)
    }catch (error){
        console.log(error)
    }
    
}

/* 4- Recogemos la info del json y la renderizamos con el template del HTML utilizando frament
   Con esto trabajamos la información en paralelo y la pintamos toda junta una sola vez en el DOM una vez esté lista, evitando el llamado reflow (hacer algo repetitivo en el DOM). Fragment trabaja sobre una memoria volatil evitando sobrecargar al DOM  */
const pintarCards = data => { 

    data.forEach(producto =>{ /* Accedemos a cada elemento del esqueleto creado para actualizarlo con la info de cada producto de la BD de json */
        templateCard.querySelector("h5").textContent = producto.title /* modificamos el nombre de cada producto */
        templateCard.querySelector("p").textContent = producto.precio /* modificamos el precio de cada producto */
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl) /* modificamos la imagen de cada producto */
        templateCard.querySelector(".btn-dark").dataset.id = producto.id

        const clone = templateCard.cloneNode(true) /* Variable intermedia que se va incluyendo en la variable fragment, para después poder pegar de una sola vez el fragment en el DOM */
        fragment.appendChild(clone) /* Incluimos el clone de esta vuelta en el fragment */
    })
    cards.appendChild(fragment) /* pintamos la info y estructura del fragment (el template de html) en el div correcto que sí que se mostrará en la web */
}

/* 6- función para aqregar al carrito. Se le pasa como parámetro el evento creado a cards más arriba */
const addCarrito = e => {
    /* console.log(e.target)
    console.log(e.target.classList.contains("btn-dark")) */
    if (e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement) /* Esto envía la información para crear el objeto con todos sus atributos */
    }
    e.stopPropagation() /* Para evitar que este evento se expanda más alla de esta constante */
}

/* 7- creamos una función para manipular el objeto de carro que va a recibir toda la info del producto sobre el que se pinche en agregar. Esto lo  */
const setCarrito = objeto =>{
    //console.log(objeto)
    const producto = {/* Creamos el objeto con toda la info recibida */
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }
    
    if(carrito.hasOwnProperty(producto.id)){ /* comprueba si el elemento sobre el que hemos pinchado está actuamente en el carrito, y si es así le añade uno a cantidad, no lo pinta otra vez */
        producto.cantidad =carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto} /* se crea una copia de producto para el carrito. IINVESTIGAR ESTO DE LOS ... NO ENTIENDO MUY BIEN. Creo que se llama sprite operator */
    pintarCarrito()
}

/* 8- función que pinta el carro en función de los objetos que hayaos añadido */
const pintarCarrito = () =>{
    console.log(carrito)
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.precio * producto.cantidad

        const clone = templateCarrito.cloneNode(true)
        
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}