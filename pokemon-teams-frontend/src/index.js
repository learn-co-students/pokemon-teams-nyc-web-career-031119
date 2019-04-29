const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', function () {
	const main = document.querySelector('main');

	const createTrainerCard = function (trainer) {
		const card = document.createElement('div');
		card.dataset.id = trainer.id;
		card.className = 'card';
		card.innerHTML = `
				<p>${trainer.name}</p>
        <button data-trainer-id=${trainer.id}>Add Pokemon</button>
        <ul id=${'trainer' + trainer.id}>
        </ul>`;
		return card;
	};

	const addPokes = function (trainer) {
		const ul = document.getElementById(`trainer${trainer.id}`);
		trainer.pokemons.forEach(function (poke) {
			ul.innerHTML += `<li>${poke.nickname} (${poke.species})<button class="release" data-pokemon-id=${poke.id}>Release</button></li>`
		});
	};

	fetch(TRAINERS_URL)
		.then(res => res.json())
		.then(trainers => {
			trainers.forEach(trainer => {
				main.appendChild(createTrainerCard(trainer))
				addPokes(trainer)
			})
		});

	main.addEventListener('click', function (e) {
		if (e.target.className === 'release')  {
			const pokemonId = e.target.dataset.pokemonId;
			fetch(`${BASE_URL}/pokemons/${pokemonId}`, {
				method: 'DELETE'
			})
			.then(e.target.parentElement.remove()
			)
		} else if (e.target.tagName === 'BUTTON') {
			const trainerId = parseInt(e.target.parentElement.dataset.id);
			const ul = document.getElementById(`trainer${trainerId}`);
			if (ul.childElementCount < 6) {
				fetch(POKEMONS_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						trainer_id: trainerId
					})
				})
				.then(res => res.json())
				.then(pokemon => {
					ul.innerHTML += `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`;
				})
			}
		}
	})
});
