// Warte bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Counter Funktionalität
    const playerCount = document.getElementById('playerCount');
    const decrementButton = document.getElementById('decrementButton');
    const incrementButton = document.getElementById('incrementButton');
    const generateButton = document.getElementById('generateButton');

    // Increment Button
    incrementButton.addEventListener('click', function() {
        let value = parseInt(playerCount.value);
        if (value < 15) {
            playerCount.value = value + 1;
        }
    });

    // Decrement Button
    decrementButton.addEventListener('click', function() {
        let value = parseInt(playerCount.value);
        if (value > 5) {
            playerCount.value = value - 1;
        }
    });

    // Hover-Effekte für alle Buttons
    [decrementButton, incrementButton].forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = '#452a5d';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#341E46';
        });
    });

    // Hover-Effekt für den Generate Button
    generateButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.backgroundColor = '#452a5d';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    generateButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.backgroundColor = '#341E46';
        this.style.boxShadow = 'none';
    });
});

// Rollendefinitionen
const roles = {
    townsfolk: [
        // Einmal-Info
        { name: "Waschweib", type: "townsfolk", infoType: "once" },
        { name: "Bibliothekar", type: "townsfolk", infoType: "once" },
        { name: "Detektiv", type: "townsfolk", infoType: "once" },
        { name: "Chefkoch", type: "townsfolk", infoType: "once" },
        // Mehrfach-Info
        { name: "Empath", type: "townsfolk", infoType: "multiple" },
        { name: "Wahrsagerin", type: "townsfolk", infoType: "multiple" },
        { name: "Totengräber", type: "townsfolk", infoType: "multiple" },
        // Später-Info
        { name: "Rabenhüter", type: "townsfolk", infoType: "later" },
        // Andere
        { name: "Mönch", type: "townsfolk", infoType: "other" },
        { name: "Jungfrau", type: "townsfolk", infoType: "other" },
        { name: "Dämonenjäger", type: "townsfolk", infoType: "other" },
        { name: "Soldat", type: "townsfolk", infoType: "other" },
        { name: "Bürgermeister", type: "townsfolk", infoType: "other" }
    ],
    outsider: [
        { name: "Butler", type: "outsider" },
        { name: "Trunkenbold", type: "outsider" },
        { name: "Einsiedler", type: "outsider" },
        { name: "Heilige", type: "outsider" }
    ],
    minion: [
        { name: "Giftmischer", type: "minion" },
        { name: "Spion", type: "minion" },
        { name: "Scharlachrote Frau", type: "minion" },
        { name: "Baron", type: "minion" }
    ],
    demon: [
        { name: "Kobold", type: "demon" }
    ]
};

// Verteilungstabelle
const distribution = {
    5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
    6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
    7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
    8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
    9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
    10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
    11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
    12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
    13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
    14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
    15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 }
};// Hilfsfunktionen
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Spezielle Rollenfunktionen
function getUnusedTownsfolkRole(usedRoles) {
    const usedRoleNames = usedRoles.map(role => role.name);
    const availableTownsfolk = roles.townsfolk.filter(role => !usedRoleNames.includes(role.name));
    return availableTownsfolk[Math.floor(Math.random() * availableTownsfolk.length)];
}

function getRedHerring(selectedRoles) {
    // Filtere mögliche Rote Heringe (Dorfbewohner und Außenseiter, aber kein Einsiedler)
    const possibleHerrings = selectedRoles.filter(role => 
        (role.type === 'townsfolk' || role.type === 'outsider') && 
        role.name !== 'Einsiedler' &&
        role.name !== 'Wahrsagerin'  // Wahrsagerin selbst ausschließen
    );
    return possibleHerrings[Math.floor(Math.random() * possibleHerrings.length)];
}

function createRoleCard(role, selectedRoles) {
    const div = document.createElement('div');
    div.className = `role-card ${role.type}`;
    
    const nameSpan = document.createElement('span');
    
    // Spezialfall: Trunkenbold
    if (role.name === "Trunkenbold") {
        const drunkRole = getUnusedTownsfolkRole(selectedRoles);
        if (drunkRole) {
            nameSpan.textContent = `${role.name} (erscheint als ${drunkRole.name})`;
        } else {
            nameSpan.textContent = role.name;
        }
    }
    // Spezialfall: Wahrsagerin
    else if (role.name === "Wahrsagerin") {
        const redHerring = getRedHerring(selectedRoles);
        if (redHerring) {
            nameSpan.textContent = `${role.name} (Roter Hering: ${redHerring.name})`;
        } else {
            nameSpan.textContent = role.name;
        }
    }
    // Standardfall
    else {
        nameSpan.textContent = role.name;
    }
    
    div.appendChild(nameSpan);

    if (role.infoType) {
        const typeSpan = document.createElement('span');
        typeSpan.className = 'role-type';
        typeSpan.textContent = role.infoType === 'once' ? 'Einmal-Info' :
                              role.infoType === 'multiple' ? 'Mehrfach-Info' :
                              role.infoType === 'later' ? 'Später-Info' : 'Andere';
        div.appendChild(typeSpan);
    }

    return div;
}

// Bluff-Rollen Funktion
function getBluffRoles(selectedRoles) {
    // Sammle alle nicht verwendeten Dorfbewohner und Außenseiter
    const usedRoleNames = selectedRoles.map(role => role.name);
    
    const availableBluffs = [
        ...roles.townsfolk,
        ...roles.outsider.filter(role => role.name !== "Trunkenbold") // Trunkenbold ausschließen
    ].filter(role => !usedRoleNames.includes(role.name));
    
    // Mische die verfügbaren Rollen und wähle 3 aus
    return shuffleArray(availableBluffs).slice(0, 3);
}function generateRoles() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    
    if (!distribution[playerCount]) {
        return;
    }

    let dist = {...distribution[playerCount]};
    let selectedRoles = [];
    
    // Wähle zuerst die Lakaien aus
    const shuffledMinions = shuffleArray(roles.minion);
    const selectedMinions = shuffledMinions.slice(0, dist.minion);
    selectedRoles.push(...selectedMinions);
    
    // Baron-Effekt
    const baronSelected = selectedMinions.some(role => role.name === "Baron");
    if (baronSelected) {
        dist.townsfolk -= 2;
        dist.outsider += 2;
    }
    
    // Berechne die Verteilung der Dorfbewohner-Typen
    let minOnceInfo, minMultipleInfo, minOther;
    
    if (baronSelected) {
        minMultipleInfo = 2;
        minOnceInfo = Math.floor((dist.townsfolk - minMultipleInfo) / 2);
        minOther = dist.townsfolk - minMultipleInfo - minOnceInfo;
    } else {
        minOnceInfo = Math.max(1, Math.floor(dist.townsfolk * 0.4));
        minMultipleInfo = Math.max(1, Math.floor(dist.townsfolk * 0.4));
        minOther = dist.townsfolk - minOnceInfo - minMultipleInfo;
    }
    
    // Wähle Dorfbewohner aus
    let townsfolkSelection = [];
    
    // Einmal-Info
    const onceInfo = shuffleArray(roles.townsfolk.filter(r => r.infoType === "once"));
    if (onceInfo.length < minOnceInfo) {
        return;
    }
    townsfolkSelection.push(...onceInfo.slice(0, minOnceInfo));
    
    // Mehrfach-Info
    const multipleInfo = shuffleArray(roles.townsfolk.filter(r => r.infoType === "multiple"));
    if (multipleInfo.length < minMultipleInfo) {
        return;
    }
    townsfolkSelection.push(...multipleInfo.slice(0, minMultipleInfo));
    
    // Andere
    if (minOther > 0) {
        const otherRoles = shuffleArray(roles.townsfolk.filter(r => 
            r.infoType === "other" || r.infoType === "later"
        ));
        if (otherRoles.length < minOther) {
            return;
        }
        townsfolkSelection.push(...otherRoles.slice(0, minOther));
    }

    selectedRoles.push(...townsfolkSelection);

    // Außenseiter
    if (dist.outsider > 0) {
        const shuffledOutsiders = shuffleArray(roles.outsider);
        if (shuffledOutsiders.length < dist.outsider) {
            return;
        }
        selectedRoles.push(...shuffledOutsiders.slice(0, dist.outsider));
    }

    // Dämon
    selectedRoles.push(...shuffleArray(roles.demon).slice(0, dist.demon));

    // Mische alle Rollen
    selectedRoles = shuffleArray(selectedRoles);

    // Zeige Ergebnisse
    displayResults(selectedRoles, baronSelected);
}

function displayResults(selectedRoles, baronSelected) {
    // Zeige Ergebnisbereich
    document.getElementById('results').classList.remove('hidden');

    // Leere alle Rollenlisten
    document.getElementById('onceInfoRoles').innerHTML = '';
    document.getElementById('multipleInfoRoles').innerHTML = '';
    document.getElementById('otherRoles').innerHTML = '';
    document.getElementById('outsiderRoles').innerHTML = '';
    document.getElementById('minionRoles').innerHTML = '';
    document.getElementById('demonRoles').innerHTML = '';
    document.getElementById('bluffRoles').innerHTML = '';

    // Sortiere und zeige Rollen
    selectedRoles.forEach(role => {
        const roleCard = createRoleCard(role, selectedRoles);
        
        if (role.type === 'townsfolk') {
            if (role.infoType === 'once') {
                document.getElementById('onceInfoRoles').appendChild(roleCard);
            } else if (role.infoType === 'multiple') {
                document.getElementById('multipleInfoRoles').appendChild(roleCard);
            } else {
                document.getElementById('otherRoles').appendChild(roleCard);
            }
        } else if (role.type === 'outsider') {
            document.getElementById('outsiderRoles').appendChild(roleCard);
        } else if (role.type === 'minion') {
            document.getElementById('minionRoles').appendChild(roleCard);
        } else if (role.type === 'demon') {
            document.getElementById('demonRoles').appendChild(roleCard);
        }
    });

    // Generiere und zeige Bluff-Rollen
    const bluffRoles = getBluffRoles(selectedRoles);
    bluffRoles.forEach(role => {
        const roleCard = createRoleCard(role, selectedRoles);
        document.getElementById('bluffRoles').appendChild(roleCard);
    });

    // Zeige Verteilung
    const distribution = document.getElementById('distribution');
    distribution.textContent = `Verteilung: ${selectedRoles.filter(r => r.type === 'townsfolk').length} Dorfbewohner, ` +
                             `${selectedRoles.filter(r => r.type === 'outsider').length} Außenseiter, ` +
                             `${selectedRoles.filter(r => r.type === 'minion').length} Lakaien, ` +
                             `${selectedRoles.filter(r => r.type === 'demon').length} Dämon`;

    // Zeige Baron-Effekt wenn aktiv
    const baronEffect = document.getElementById('baronEffect');
    if (baronSelected) {
        baronEffect.classList.remove('hidden');
        baronEffect.textContent = 'Baron-Effekt aktiv: • +2 Außenseiter, -2 Dorfbewohner • Mindestens 2 Mehrfach-Info Rollen garantiert';
    } else {
        baronEffect.classList.add('hidden');
    }
}

// Event Listener für den Generate-Button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateButton').addEventListener('click', generateRoles);
});