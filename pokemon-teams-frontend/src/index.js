const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function() {
  const main = document.querySelector('main');

  //load trainer team / pokemon data from the db on load
  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(json => loadTrainers(json));

  //this callback function is called after the request to the API for all trainers
  function loadTrainers(json) {
    json.forEach(trainer => {
      main.innerHTML +=
      `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
        <button class="add-pkmn-button" data-trainerID="${trainer.id}">Add Pokemon</button>
        <ul >
          ${populatePokemon(trainer.pokemons)}
        </ul>
      </div>`
    })
  };
  //helper function for loadTrainers() to build the <li>s of all their current pkmn
  function populatePokemon(pokemons) {
    let pokemon_lis = "";
    for (let poke of pokemons) {
      pokemon_lis += `<li>${poke.nickname} (${poke.species}) <button class="release" data-pokemonID="${poke.id}">Release</button></li>`;
    }
    return pokemon_lis;
  }

  //main event listener, listening for actionable clicks
  main.addEventListener("click", function(event) {
    if (event.target.className === "add-pkmn-button") {
      //ADDING A POKEMON to trainer list
      trainerId = event.target.dataset.trainerid;
      fetch(POKEMONS_URL, {
        method: "POST",
        headers: {
          "content-type" : "application/json",
          "accept" : "application/json"
        },
        body: JSON.stringify({"trainer_id": trainerId})
      })
      .then(response => response.json())
      .then(jsonObject => addPokemon(jsonObject))
      .catch(error => console.error("Error Here:", error) );
      //function that adds pokemon to the DOM if the request is successful
      function addPokemon(json){
        console.log(json);
        if (json.error) {
          alert(json.error);
          console.error(pkmn);
        } else {
          trainerUL = event.target.parentNode.querySelector("ul");
          trainerUL.innerHTML += `<li>${json.nickname} (${json.species}) <button class="release" data-pokemonID="${json.id}">Release</button></li>`;
        }
      }
    } else if (event.target.className === "release") {
      //releases the pokemon by removing pokemon from trainer list
      let pokemonID = event.target.dataset.pokemonid;
      let releaseURL = POKEMONS_URL + `/${pokemonID}`;
      fetch((releaseURL), {
        method: "DELETE",
        headers: {
          "content-type" : "application/json",
          "accept" : "application/json"
        },
        body: JSON.stringify({"id": pokemonID})
      })
      .then(response => response.json())
      .then(pkmn => {
        console.log(pkmn);
        if (pkmn.error) {
          alert(pkmn.error);
          console.error(pkmn);
        } else {
          trainerLI = event.target.parentNode;
          trainerLI.remove();
        }
      })
      .catch(error => console.error("Error Here:", error) );
    }
  });

});
