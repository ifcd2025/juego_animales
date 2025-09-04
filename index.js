const listaAnimalesOriginal = ["anteater","bulldog","butterfly","cat","chameleon","clown-fish","crocodile","duck","frog","giraffe","kangaroo","lion","monkey","octopus","ostrich","pig","rabbit","racoon","ray","shark","sheep","spider","squirrel","swan","tiger","toucan","turtle"];

// Necesitamos mantener la lista original para cuando se juege de nuevo
let listaAnimalesActual;
let aciertos = 0;
let fallos = 0;
let tiempo = 0;
let reloj;
const sonido = {
    acierto: new Audio("sonidos/acierto.mp3"),
    fallo: new Audio("sonidos/fallo.mp3"),
    victoria: new Audio("sonidos/aplausos.mp3")
}

function iniciar() {
    aciertos = 0;
    fallos = 0;
    tiempo = 0;
    // Debemos eliminar un reloj antes de iniciar otro
    clearInterval(reloj);
    reloj = setInterval(incrementarTiempo, 1000);
    // Debemos hacer una copia del array original
    listaAnimalesActual = [...listaAnimalesOriginal];
    document.getElementById("aciertos").textContent = 0;
    document.getElementById("fallos").textContent = 0;
    document.getElementById("tiempo").textContent = 0;
    mostrarAnimales();
    generarPalabra();
    document.getElementById("animales").addEventListener("click", comprobarAnimal);
}

function incrementarTiempo() {
    tiempo++;
    document.getElementById("tiempo").textContent = tiempo;
}

function mostrarAnimales() {
    aleatorio(listaAnimalesActual);
    const animales = document.getElementById("animales");
    animales.textContent = "";
    for(const animal of listaAnimalesActual) {
        const div = document.createElement("div");
        animales.appendChild(div);
        div.classList.add("rounded-3", "animal", "border-1", "border", "shadow");
        div.style.backgroundImage = `url(imagenes/${animal}.svg)`;
        div.style.backgroundSize = "contain"; // Podía estar en la clase css animal
        // Guardamos el nombre del animal para poder compararlo luego cuando se pulse
        div.dataset.animal = animal;
    }
}

function generarPalabra() {
    const posicion = Math.floor(Math.random() * listaAnimalesActual.length);
    const animalElegido = document.getElementById("animalElegido");
    animalElegido.textContent = listaAnimalesActual[posicion];
    // Si queremos que la animación se pueda volver a ejecutar, hay que hacer todo esto
    animalElegido.classList.remove("animacionAnimalElegido");
    animalElegido.offsetWidth;
    animalElegido.classList.add("animacionAnimalElegido");
}

// Algoritmo de Fisher-Hayes
function aleatorio(arr) {
    let i = arr.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}

function comprobarAnimal(evt) {
    const target = evt.target;
    // Debemos comprobar si se pulso en el cuadro de un animal o en su contenedor
    // y que no haya sido ya acertado
    if(target.classList.contains("animal") && target.classList.contains("bien") == false) {
        if(target.dataset.animal == document.getElementById("animalElegido").textContent) {
            aciertos++;
            sonido.acierto.play();
            document.getElementById("aciertos").textContent = aciertos;
            target.classList.add("bien");
            // Debemos eliminar la palabra acertada de la lista
            // indexOf devuelve la posición de lo buscado en el array ( -1 si no lo encuentra)
            const posicion = listaAnimalesActual.indexOf(target.dataset.animal);
            // splice elimina elementos desde la posición indicada (1 para uno solo)
            listaAnimalesActual.splice(posicion, 1);
            comprobarVictoria();
        } else {
            fallos++;
            sonido.fallo.play();
            document.getElementById("fallos").textContent = fallos;
            // Para que se pueda reproducir la animación más de una vez
            target.classList.remove("mal");
            target.offsetWidth;
            target.classList.add("mal");
        }
        generarPalabra();
    }
}

function comprobarVictoria() {
    if(listaAnimalesActual.length == 0) {
        clearInterval(reloj);
        sonido.victoria.play();
        // Quitamos el listener para que no se pueda seguir pulsando en los animales
        document.getElementById("animales").removeEventListener("click", comprobarAnimal);
        document.getElementById("animales").offsetWidth;
        document.getElementById("animales").classList.add("animacionVictoria");
        Swal.fire({
            title: "Enhorabuena",
            html: `<div>Aciertos: ${aciertos}</div><div>Fallos: ${fallos}</div><div>Tiempo: ${tiempo}</div>`,
            icon: "success",
        })
        .then(() => {
            sonido.victoria.pause();
            sonido.victoria.currentTime = 0; // Si queremos que vuelva al comienzo
            document.getElementById("animales").classList.remove("animacionVictoria");
            reiniciar();
        });
    }
}

function reiniciar() {
    Swal.fire({
        title: "¿Comenzar de nuevo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                iniciar();
            }
    });
}

Swal.fire({
  title: "Aprende inglés",
  text: "Selecciona el animal que corresponda con la palabra mostrada",
  icon: "info"
})
.then( () => iniciar()
);



document.getElementById("reiniciar").addEventListener("click", reiniciar);

