// The next thing I need to do is make it so I can add the pokemon to a team or make it so I can view the pokemon in the pokedex. 
// Make the pokemon team page using local storage and show extra details for each of the 6 pokemon. Make it so the view in pokedex button
// actually takes you to the pokedex page and displays the pokemon from landing and not bulbasaur. 
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const pokemonCount = 151;
var pokedex = {}; // same structure you're already using

// Generate an integer between min and max (inclusive)
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addToTeam(pokemonId) {
    let team = JSON.parse(localStorage.getItem("team")) || [];

    if (team.length >= 6) {
        alert("Your team already has 6 Pokémon!");
        return;
    }

    team.push(pokemonId);  // allow duplicates
    localStorage.setItem("team", JSON.stringify(team));
    alert("Pokémon added to your team!");
}


window.onload = async function () {
    // Pick 2 random Pokémon numbers
    let random1 = getRandomNum(1, pokemonCount);
    let random2 = getRandomNum(1, pokemonCount);

    // Fetch both Pokémon
    await getPokemon(random1);
    await getPokemon(random2);

    // Display them
    displayPokemon("pokemonA", random1);
    displayPokemon("pokemonB", random2);
};

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num;

    let res = await fetch(url);
    let pokemon = await res.json();

    let name = pokemon["name"];
    let types = pokemon["types"];
    let img = pokemon["sprites"]["front_default"];

    // Species info for description
    res = await fetch(pokemon["species"]["url"]);
    let speciesData = await res.json();

    let desc = speciesData["flavor_text_entries"]
        .find(entry => entry.language.name === "en")
        ?.flavor_text || "No description available.";

    pokedex[num] = {
        name: name,
        img: img,
        types: types,
        desc: desc
    };
}

function displayPokemon(sectionId, id) {
    // This function fills in a section of the landing page with a Pokémon
    document.querySelector(`#${sectionId} .pokemon-img`).src = pokedex[id].img;

    // Clear previous types
    let typesDiv = document.querySelector(`#${sectionId} .pokemon-types`);
    typesDiv.innerHTML = "";

    // Add type boxes
    pokedex[id].types.forEach(t => {
        let span = document.createElement("span");
        span.innerText = t.type.name.toUpperCase();
        span.classList.add("type-box");
        span.classList.add(t.type.name);
        typesDiv.append(span);
    });

    // Add description + name
    document.querySelector(`#${sectionId} .pokemon-name`).innerText =
        pokedex[id].name.toUpperCase();

    document.querySelector(`#${sectionId} .pokemon-description`).innerText =
        pokedex[id].desc;

    document.querySelector(`#${sectionId} .addToTeam`).onclick = () => addToTeam(id);

    document.querySelector(`#${sectionId} .pokedexView`).onclick = () => {
        localStorage.setItem("viewPokemon", id);
        window.location.href = "/pokedex/index.html";
        };
}
