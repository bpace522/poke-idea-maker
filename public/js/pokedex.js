import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const pokemonCount = 151;
var pokedex = {}; // {1 : {"name" : "bulbasaur", "img" : url, "type" : ["grass", "poison"], "desc" : "..."}}

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

window.onload = async function() {

    let focusPokemon = this.localStorage.getItem("viewPokemon");
    if (focusPokemon) {
        focusPokemon = parseInt(focusPokemon);
    }
    // getPokemon(1);
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
        //<div id="1" class="pokemon-name>BULBASAUR"</div>
        let pokemon = document.createElement("div");
        pokemon.id = i;
        pokemon.innerText = i.toString() + ". " + pokedex[i]["name"].toUpperCase();
        pokemon.classList.add("pokemon-name");
        pokemon.addEventListener("click", updatePokemon);
        this.document.getElementById("pokemon-list").append(pokemon);
    }

    let firstToShow = focusPokemon || 1;
    updatePokemon.call({ id: firstToShow});

    console.log(pokedex);
}

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    // console.log(pokemon);

    let pokemonName = pokemon["name"];
    let pokemonType = pokemon["types"];
    let pokemonImg = pokemon["sprites"]["front_default"];
    
    res = await fetch(pokemon["species"]["url"]);
    let pokemonDesc = await res.json();
    // console.log(pokemonDesc);
    pokemonDesc = pokemonDesc["flavor_text_entries"][9]["flavor_text"];

    pokedex[num] = {"name" : pokemonName, "img" : pokemonImg, "types": pokemonType, "desc" : pokemonDesc};
}

function updatePokemon() {
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

    //clear previous types
    let typesDiv = document.getElementById("pokemon-types");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }

    //udpate types
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]); //adds background color and font color
        typesDiv.append(type);
    }

    //update description
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];

    document.querySelector(`.addToTeam`).onclick = () => addToTeam(this.id);
}