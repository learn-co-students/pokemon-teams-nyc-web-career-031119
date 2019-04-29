const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const main = document.querySelector("main")


function fetchTrainers() {
  fetch("http://localhost:3000/trainers")
  .then(res => res.json())
  .then(function(json) {
    console.log(json)
    json.forEach(function(el){
      main.innerHTML += `<div class="card" data-id=${el.id}><p>${el.name}</p>
        <button class="add-pkmn" data-trainer-id="${el.id}">Add Pokemon</button>
        <ul id=${el.id}>
        </ul>
      </div>`
      const ul = document.getElementById(`${el.id}`)
      el.pokemons.forEach(function(pkmn){
        ul.innerHTML += `<li id="pkmn-${pkmn.id}">${pkmn.nickname} (${pkmn.species}) <button class="release" data-pokemon-id="${pkmn.id}">Release</button></li>`
      })
    })
  })
}

fetchTrainers()

main.addEventListener("click", function(e){
  if (e.target.className === "add-pkmn"){
    const trainer = {trainer_id: ` ${e.target.dataset.trainerId}`}
    fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(trainer)
    })
    .then(res => res.json())
    .then(function(json){
      const ul = document.getElementById(`${json.trainer_id}`)
      ul.innerHTML += `<li id="pkmn-${json.id}">${json.nickname} (${json.species}) <button class="release" data-pokemon-id="${json.id}">Release</button></li>`
    })
    .catch(function(error){
      alert("too many pokemon!")
    })
  }
})

main.addEventListener("click", function(e){
  if (e.target.className === "release"){
    const pkmnId = e.target.dataset.pokemonId

    fetch(`http://localhost:3000/pokemons/${pkmnId}`, {method: "DELETE"})
    .then(res => res.json())
    .then(function(json){
      console.log(json);
      const customID = `pkmn-${json.id}`
      const pkmn = document.querySelector(`#${customID}`)
      pkmn.remove()
      
    })
  }
})
