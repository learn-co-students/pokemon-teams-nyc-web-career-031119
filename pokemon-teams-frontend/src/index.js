const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded',() =>  {
  //FEATURE: render pokemon

  //identify elements to modify
  const trainerContainer = document.getElementById('trainerContainer');

  //render trainer card
  function renderTrainer(t) {
    let trainerCard = document.createElement('div');
    trainerCard.innerHTML = `
    <div class="card" data-id=${t.id}><p>${t.name}</p>
      <button class='add' data-trainer-id=${t.id}>Add Pokemon</button>
      <ul id="pkmnList${t.id}">
      </ul>
    </div>`;

    trainerContainer.appendChild(trainerCard);

    let trainerPkmn = t.pokemons.forEach((pokemon) => {
      let pkmnList = document.getElementById(`pkmnList${t.id}`);
      pkmnList.innerHTML += `
      <li>${pokemon.nickname} (${pokemon.species})
      <button class="release" id=${pokemon.id}>Release</button>
      </li>
      `
    });
  };

  function addPkmn(e) {
    trainerId = e.target.dataset.trainerId
    fetch(POKEMONS_URL,{
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        trainer_id: `${trainerId}`
      })
    })
    .then(res => res.json())
    .then(pokemon => {
      let ul = e.target.nextElementSibling
      let liCount = ul.getElementsByTagName('li').length
      if(liCount > 5){
        window.alert('no can do, pls release an pokemon')
      } else {
        ul.innerHTML += `
        <li>${pokemon.nickname} (${pokemon.species})
        <button class="release" id=${pokemon.id}>Release</button>
        </li>
        `
      }
    })
  };

  function releasePkmn(e) {
    fetch(POKEMONS_URL + `/${e.target.id}`,{
      method: "DELETE"})
      .then(res => res.json())
      .then(pkmn => {
        const row = document.getElementById(`${pkmn.id}`).parentNode
        row.remove()
      })
  };

  //identify buttons
  window.addEventListener('click', (e) => {
    if(e.target.className === 'add'){
      addPkmn(e);
    } else if(e.target.className === 'release') {
      releasePkmn(e);
    }
  });

  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(data => data.forEach((t) => {
      renderTrainer(t)
    }));

});
