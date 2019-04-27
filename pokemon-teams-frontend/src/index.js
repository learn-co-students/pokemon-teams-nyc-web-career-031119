const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', function() {
  const main = document.querySelector('main');

  const createTrainerCard = function(trainer) {
    const card = document.createElement('div');
    // card.className = "card";
    // card.dataset.id = `${trainer.id}`;
    card.innerHTML = `
      <div class="card" data-id=${trainer.id.toString()}>
        <p>${trainer.name}</p>
        <button data-trainer-id=${trainer.id.toString()}>Add Pokemon</button>
        <ul id=${"trainer" + trainer.id.toString() + "pokelist"}>
        </ul>
      </div>
    `
    return card
  }

  const fillInPokeList = function(trainer) {
    const pokeList = document.getElementById(`trainer${trainer.id}pokelist`);
    const pokemons = trainer.pokemons;
    pokemons.forEach(function(pokemon) {
      pokeList.innerHTML += `
        <li id=pokeLi${pokemon.id}>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>
      `
    })
  }

  fetch(TRAINERS_URL)
  .then(res => res.json())
  .then(trainers => {
    trainers.forEach(trainer => {
      main.appendChild(createTrainerCard(trainer))
      fillInPokeList(trainer)
    })
  })

  // const createPokeRow = function(pokemon) {
  //
  // }

  function submitPokemon(trainerId) {
    let formData = {
      trainer_id: trainerId
    };

    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };

    fetch(POKEMONS_URL, configObj)
      .then(res => res.json())
      .then(pokemon => {
        const list = document.getElementById(`trainer${pokemon.trainer_id}pokelist`);
        list.innerHTML += `
          <li id=pokeLi-${pokemon.id}>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>
        `
      })
      .catch(function(error) {
        alert("This trainer already has six pokemon!");
        console.log(error.message);
      })
  }

  function releasePokemon(pokemonId) {
    fetch(POKEMONS_URL + `/${pokemonId}`, {method: "DELETE"})
      .then(res => res.json())
      .then(pokemon => {
        const pokeRow = document.getElementById(`pokeLi${pokemon.id}`);
        pokeRow.remove();
      })
      .catch(error => {
        alert(error.message);
        console.log(error.message);
      })
  }

  main.addEventListener('click', function(e) {
    if (e.target.hasAttribute("data-trainer-id")) {
      submitPokemon(e.target.dataset.trainerId)
    } else if (e.target.hasAttribute("data-pokemon-id")) {
      releasePokemon(e.target.dataset.pokemonId)
    }
  })
});
