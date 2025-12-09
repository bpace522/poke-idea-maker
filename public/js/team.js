import { loadHeaderFooter } from "./utils.mjs";

const teamContainer = document.getElementById("team-container");

window.onload = async function () {
    loadHeaderFooter();
    let team = JSON.parse(localStorage.getItem("team")) || [];

    if (team.length === 0) {
        teamContainer.innerHTML = "<p>Your team is empty!</p>";
        return;
    }

    for (let pokemonId of team) {
        const pokemon = await loadPokemon(pokemonId);
        displayPokemonCard(pokemon);
    }
};


async function loadPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const species = await speciesRes.json();
    const desc = species.flavor_text_entries.find(
        entry => entry.language.name === "en"
    )?.flavor_text || "No description available.";

    return {
        id,
        name: data.name,
        img: data.sprites.other["official-artwork"].front_default,
        types: data.types.map(t => t.type.name),
        stats: data.stats,
        abilities: data.abilities,
        height: data.height,
        weight: data.weight,
        desc
    };
}


function displayPokemonCard(p) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.style.height = "auto";
    card.style.padding = "20px";

    card.innerHTML = `
        <img src="${p.img}" class="pokemon-img">

        <h2>${p.name.toUpperCase()}</h2>

        <div class="pokemon-types">
            ${p.types
                .map(t => `<span class="type-box ${t}">${t.toUpperCase()}</span>`)
                .join("")}
        </div>

        <h3>Abilities</h3>
        <ul class="ability-list">
            ${p.abilities
                .map(a => `<li>${a.ability.name.toUpperCase()}</li>`)
                .join("")}
        </ul>

        <h3>Base Stats</h3>
        <div class="stats-box">
            ${p.stats
                .map(s => `<p>${s.stat.name.toUpperCase()}: <strong>${s.base_stat}</strong></p>`)
                .join("")}
        </div>

        <p><strong>Height:</strong> ${p.height / 10} m</p>
        <p><strong>Weight:</strong> ${p.weight / 10} kg</p>

        <div class="pokemon-description">${p.desc}</div>

        <button class="remove-btn">Remove Pokémon</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
        removeFromTeam(p.id);
        card.remove();
    });

    teamContainer.appendChild(card);
}


function removeFromTeam(id) {
    let team = JSON.parse(localStorage.getItem("team")) || [];
    const index = team.indexOf(id);
    if (index !== -1) team.splice(index, 1);
    localStorage.setItem("team", JSON.stringify(team));
}
