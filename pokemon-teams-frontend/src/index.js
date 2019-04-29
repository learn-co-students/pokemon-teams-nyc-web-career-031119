const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


//Load all pokemon & trainers //

document.addEventListener("DOMContentLoaded", ()=>{
  fetch('http://localhost:3000/trainers')
    .then(res => res.json())
    .then(data => data.forEach(function(trainer){
      const main = document.querySelector("main")

      main.innerHTML +=
      `<div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
        <button class="addPokemon" data-trainer-id=${trainer.id}>Add Pokemon</button>
        <ul id=${trainer.id}>
        </ul>
      </div>`
    trainer.pokemons.forEach(function(pokemon){

      const ulList = document.getElementById(`${trainer.id}`)
      // debugger
      ulList.innerHTML +=
    `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`
    })
    }))
    // end load pokemon & trainers //

    // add pokemon //

    document.addEventListener("click", function(e){

      let trainer = e.target.dataset.trainerId
      // console.log('clickity')
      if (e.target.className === "addPokemon")
      // console.log(e.target)
      fetch(`http://localhost:3000/pokemons`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trainer_id": trainer})
      })
      .then(res => res.json())
      .then(pokemon => {
      let element = document.getElementById(pokemon.trainer_id)
      element.innerHTML +=
          `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`
        })
    })
    //end add pokemon //

    //remove pokemon //

    document.addEventListener("click", function(e){
      // console.log('jinkies')
      let pokeId = e.target.dataset.pokemonId
      if (e.target.className === "release"){

      fetch(`http://localhost:3000/pokemons/${pokeId}`, {
        method: "DELETE"
      }).then(res => res.json())
        .then(e.target.parentElement.remove())
      // document.getEleme
      }
    })
    //end remove pokemon //
})
