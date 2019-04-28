const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function() {
    const main = document.querySelector('main')

   //load trainer team / pokemon data from the db on load
   fetch(TRAINERS_URL)
    .then(function(response){
      return response.json()
    })
    .then(function(json){
      return loadTrainers(json)
    })

          // fetch(TRAINERS_URL)
          // .then(response => response.json())
          // .then(json => loadTrainers(json));

   //this callback function is called after the request to the API for all trainers
  function loadTrainers(json) {
    json.forEach(function(trainer){
      main.innerHTML +=
      `<div class="card" data-id=${trainer.id.toString()}><p>${trainer.name}</p>
          <button class="add-pkmn-button" data-trainerID=${trainer.id.toString()}>Add Pokemon</button>
          <ul >
            ${populatePokemon(trainer.pokemons)}
          </ul>
        </div>
      `
    })
  }

   //helper function for loadTrainers() to build the <li>s of all their current pkmn
   function populatePokemon(pokemons) {
     let pokemon_list = "";
     for (let poke of pokemons){//iterates through trainer API
       pokemon_list += `<li>${poke.nickname}<button class="release" data-pokemonID="${poke.id}">Release</button></li>`//adds list of pokemon and a button
     }
     return pokemon_list //puts it out into main block
   }


   //main event listener, listening for actionable clicks
   main.addEventListener('click', function(event){
     // event.preventDefault()
     //ADDING A POKEMON to trainer list
     if(event.target.className === "add-pkmn-button"){
       trainerID = event.target.dataset.trainerid;
       fetch(POKEMONS_URL,{
           method: "POST",
           headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({"trainer_id": trainerID})
        })
      .then(function(response){
      return response.json();
      })
      .then(function(json){
        return addPokemon(json)
      })
      .catch(error => console.error("Error Here:", error));

      function addPokemon(json) {
        console.log(json);
        if (json.error){
          alert(json.error)
          console.error(pkmn)
        } else {
         trainerUL = event.target.parentNode.querySelector('ul');
         trainerUL.innerHTML += `<li>${json.nickname} (${json.species})<button class="release" data-pokemonID=${json.id.toString()}>Release</button></li>`
        }

      }
   } else if (event.target.className === 'release') {
     //releases the pokemon by removing pokemon from trainer list
     let pokemonID = event.target.dataset.pokemonid;
     let releaseURL = POKEMONS_URL + `/${pokemonID}`
     fetch(releaseURL,{
       method: "DELETE",
       headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({"id": pokemonID})
     })
     .then(function(response){
     return response.json();
     })
     .then(function(pkmn){
       console.log(pkmn)
       if (pkmn.error){
         alert(pkmn.error)
         console.error(pkmn)
       } else {
         trainerLI = event.target.parentNode;
         trainerLI.remove();
       }
     })
     .catch(error => console.error("Error Here:", error));
   }
  })

})
