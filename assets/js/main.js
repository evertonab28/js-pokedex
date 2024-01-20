const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 8;
let offset = 0;

const pokemonsByNumber = {};

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.forEach(pokemon => {
            pokemonsByNumber[pokemon.number] = pokemon;
        });

        const newHtml = pokemons.map(pokemon =>
            `<li class="pokemon ${pokemon.type}" onclick="openModalByNumber('${pokemon.number}')">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
              <ol class="types">
                  ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
              </ol>
              <img src="${pokemon.photo}" alt="${pokemon.name}">
          </div>
      </li>`
        ).join('');

        document.getElementById('pokemonList').innerHTML += newHtml;
    });
}

function openModalByNumber(pokemonNumber) {
    const pokemon = pokemonsByNumber[pokemonNumber];
    if (pokemon) {
        openModal(pokemon);
    } else {
        console.error(`Pokemon ${pokemonNumber} não encontrado.`);
    }
}

function openModal(pokemon) {
    const modal = document.getElementById('pokemonModal');

    const maxStats = {
        'hp': 255,
        'attack': 190,
        'defense': 230,
        'special-attack': 194,
        'special-defense': 230,
        'speed': 180,
    };

    modal.innerHTML = `
    <div class="modal-content ${pokemon.type}">
        <div><span class="close" onclick="closeModal()"><p>&times;</p></span></div>
        
        <div class=modal-header>    
            <div class="modal-pokemon-name-type">
                <h1 class=modal-name>${pokemon.name}</h1>
                <ol class="types">
                    ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div class="modal-number">
                <p>#${pokemon.number}</p>
            </div>
            
        </div>
        <img src="${pokemon.photo}" alt="${pokemon.name}" />

        <div class="modal-details">
    <div class="stats-container">
        ${pokemon.stats.map(stat => `
            <div class="stat-row">
                <div class="stat-name">${formatStatName(stat.nameStat)}</div>
                <div class="stat-value">${stat.baseStat}</div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${calculateBarWidth(stat.baseStat, maxStats[stat.nameStat])}%; background: ${determineBarColor(stat.baseStat, maxStats[stat.nameStat])};"></div>
                </div>
            </div>
        `).join('')}
    </div>
</div>

    `;
    modal.style.display = 'block';
}

function formatStatName(statName) {
    const replacements = {
        'special-attack': 'Sp. Attack',
        'special-defense': 'Sp. Defense',
    };

    if (replacements[statName]) {
        return replacements[statName];
    } else {
        return statName.charAt(0).toUpperCase() + statName.slice(1);
    }
}

function calculateBarWidth(baseStat, maxStat) {
    return ((baseStat / maxStat) * 100).toFixed();
}

function determineBarColor(baseStat, maxStat) {
    const percentage = (baseStat / maxStat) * 100;
    if (percentage >= 60) {
        return 'linear-gradient(143deg, rgba(0,80,0,1) 0%, rgba(12,152,38,1) 51%, rgba(0,255,102,1) 100%)';
    } else if (percentage >= 30 && percentage < 60) {
        return 'linear-gradient(143deg, rgba(215,209,0,1) 0%, rgba(226,219,0,1) 51%, rgba(255,247,0,1) 100%)'; 
    } else {
        return 'linear-gradient(143deg, rgba(186,0,0,1) 0%, rgba(215,0,0,1) 51%, rgba(255,0,0,1) 100%)';
    }
}

function closeModal() {
    document.getElementById('pokemonModal').style.display = 'none';
}

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }
})