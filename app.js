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
};

// Hilfsfunktionen
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createRoleCard(role) {
    const div = document.createElement('div');
    div.className = `role-card ${role.type}`;
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = role.name;
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

function generateRoles() {
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
    
    // Dorfbewohner-Verteilung
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

    // Sortiere und zeige Rollen
    selectedRoles.forEach(role => {
        const roleCard = createRoleCard(role);
        
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

// Event Listener
document.getElementById('generateButton').addEventListener('click', generateRoles);

// Initial setup
document.getElementById('playerCount').value = 5;