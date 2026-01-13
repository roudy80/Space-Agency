// Space Agency Game - Main JavaScript

// ========================================
// GAME STATE
// ========================================

let gameState = {
    budget: 1000000,
    reputation: 0,
    astronauts: [],
    research: {},
    activeMissions: [],
    completedMissions: 0,
    contracts: [],
    locations: {
        leo: { unlocked: true, visited: 0, hasBase: false, crew: 0, modules: 0 },
        moon: { unlocked: false, visited: 0, hasBase: false, crew: 0, modules: 0, miningLevel: 0 },
        mars: { unlocked: false, visited: 0, hasBase: false, crew: 0, modules: 0, miningLevel: 0 },
        venus: { unlocked: false, visited: 0, hasBase: false, crew: 0, modules: 0 },
        jupiter: { unlocked: false, visited: 0, hasBase: false, crew: 0, modules: 0 }
    },
    stats: {
        totalLaunches: 0,
        successfulLaunches: 0,
        astronautsHired: 0
    }
};

// ========================================
// GAME DATA
// ========================================

const RESEARCH_TREE = {
    // Rockets
    mediumRocket: {
        name: "Medium Rocket",
        category: "Rockets",
        cost: 150000,
        description: "Unlock medium-lift rockets (5T to LEO)",
        benefit: "• Medium Rocket available\n• Launch heavier payloads",
        unlocked: false,
        prerequisites: []
    },
    heavyRocket: {
        name: "Heavy Rocket",
        category: "Rockets",
        cost: 400000,
        description: "Unlock heavy-lift rockets (20T to LEO)",
        benefit: "• Heavy Rocket available\n• Launch bases to Moon/Mars",
        unlocked: false,
        prerequisites: ['mediumRocket']
    },
    superHeavyRocket: {
        name: "Super Heavy Rocket",
        category: "Rockets",
        cost: 1500000,
        description: "Unlock super heavy rockets (50T to LEO)",
        benefit: "• Super Heavy Rocket available\n• Jupiter missions possible",
        unlocked: false,
        prerequisites: ['heavyRocket']
    },

    // Reusable
    spaceplane: {
        name: "Space Plane",
        category: "Reusable",
        cost: 2500000,
        description: "Reusable spaceplane - pay once, reuse forever",
        benefit: "• Space Plane unlocked\n• Only $50k fuel per launch\n• 3T capacity",
        unlocked: false,
        prerequisites: ['mediumRocket']
    },
    reusableRockets: {
        name: "Reusable Rockets",
        category: "Reusable",
        cost: 1000000,
        description: "Rockets can now land and be reused (50% cost savings)",
        benefit: "• All rockets 50% cheaper\n• Massive cost savings",
        unlocked: false,
        prerequisites: ['heavyRocket']
    },

    // Destinations
    moonMissions: {
        name: "Lunar Program",
        category: "Destinations",
        cost: 250000,
        description: "Unlock Moon missions",
        benefit: "• Moon destination unlocked\n• New lucrative contracts",
        unlocked: false,
        prerequisites: ['mediumRocket']
    },
    marsMissions: {
        name: "Mars Program",
        category: "Destinations",
        cost: 1000000,
        description: "Unlock Mars missions",
        benefit: "• Mars destination unlocked\n• High-value contracts",
        unlocked: false,
        prerequisites: ['heavyRocket', 'moonMissions']
    },
    venusMissions: {
        name: "Venus Program",
        category: "Destinations",
        cost: 800000,
        description: "Unlock Venus missions",
        benefit: "• Venus destination unlocked\n• Science contracts",
        unlocked: false,
        prerequisites: ['heavyRocket', 'moonMissions']
    },
    jupiterMissions: {
        name: "Jupiter Program",
        category: "Destinations",
        cost: 2500000,
        description: "Unlock Jupiter missions",
        benefit: "• Jupiter unlocked\n• Massive rewards",
        unlocked: false,
        prerequisites: ['superHeavyRocket', 'marsMissions']
    },

    // Human Spaceflight
    humanSpaceflight: {
        name: "Human Spaceflight",
        category: "Crew",
        cost: 200000,
        description: "Enable crewed missions to LEO",
        benefit: "• Crew missions to LEO\n• Higher contract rewards\n• More reputation",
        unlocked: false,
        prerequisites: []
    },
    lunarLanding: {
        name: "Lunar Landing",
        category: "Crew",
        cost: 600000,
        description: "Enable crew landings on Moon",
        benefit: "• Land crew on Moon\n• Big reputation gains\n• $2M+ contracts",
        unlocked: false,
        prerequisites: ['humanSpaceflight', 'moonMissions']
    },
    marsLanding: {
        name: "Mars Landing",
        category: "Crew",
        cost: 1500000,
        description: "Enable crew landings on Mars",
        benefit: "• Land crew on Mars\n• Huge reputation\n• $5M+ contracts",
        unlocked: false,
        prerequisites: ['lunarLanding', 'marsMissions']
    },

    // Bases
    spaceStation: {
        name: "Space Station",
        category: "Bases",
        cost: 800000,
        description: "Build permanent LEO station",
        benefit: "• Deploy space station\n• Long-term presence\n• New missions",
        unlocked: false,
        prerequisites: ['humanSpaceflight', 'mediumRocket']
    },
    moonBase: {
        name: "Lunar Base",
        category: "Bases",
        cost: 1500000,
        description: "Build permanent Moon base",
        benefit: "• Establish Moon base\n• Enable mining\n• $4M contracts",
        unlocked: false,
        prerequisites: ['lunarLanding']
    },
    marsBase: {
        name: "Mars Base",
        category: "Bases",
        cost: 3500000,
        description: "Build permanent Mars base",
        benefit: "• Establish Mars base\n• Enable mining\n• $10M contracts",
        unlocked: false,
        prerequisites: ['marsLanding']
    },

    // Mining
    lunarMining: {
        name: "Lunar Mining",
        category: "Mining",
        cost: 1000000,
        description: "Extract resources from Moon base",
        benefit: "• Passive income\n• $50k per mission\n• Returns on investment",
        unlocked: false,
        prerequisites: ['moonBase']
    },
    marsMining: {
        name: "Mars Mining",
        category: "Mining",
        cost: 2500000,
        description: "Extract resources from Mars base",
        benefit: "• High passive income\n• $50k per mission\n• Fuel independence",
        unlocked: false,
        prerequisites: ['marsBase']
    }
};

const ROCKETS = {
    small: {
        name: "Small Rocket",
        cost: 100000,
        capacity: 2,
        research: null
    },
    medium: {
        name: "Medium Rocket",
        cost: 500000,
        capacity: 5,
        research: 'mediumRocket'
    },
    heavy: {
        name: "Heavy Rocket",
        cost: 2000000,
        capacity: 20,
        research: 'heavyRocket'
    },
    superHeavy: {
        name: "Super Heavy Rocket",
        cost: 8000000,
        capacity: 50,
        research: 'superHeavyRocket'
    },
    spaceplane: {
        name: "Space Plane (Reusable)",
        cost: 50000, // Just fuel cost after research
        capacity: 3,
        research: 'spaceplane',
        reusable: true
    }
};

const DESTINATIONS = {
    leo: {
        name: "Low Earth Orbit (LEO)",
        time: 10, // seconds
        requirements: { capacity: 1 },
        research: null,
        probeCost: 50000,
        crewResearch: 'humanSpaceflight',
        baseResearch: 'spaceStation'
    },
    moon: {
        name: "Moon",
        time: 60,
        requirements: { capacity: 3 },
        research: 'moonMissions',
        probeCost: 200000,
        crewResearch: 'lunarLanding',
        baseResearch: 'moonBase'
    },
    mars: {
        name: "Mars",
        time: 180,
        requirements: { capacity: 10 },
        research: 'marsMissions',
        probeCost: 500000,
        crewResearch: 'marsLanding',
        baseResearch: 'marsBase'
    },
    venus: {
        name: "Venus",
        time: 150,
        requirements: { capacity: 8 },
        research: 'venusMissions',
        probeCost: 400000,
        crewResearch: null,
        baseResearch: null
    },
    jupiter: {
        name: "Jupiter",
        time: 300,
        requirements: { capacity: 30 },
        research: 'jupiterMissions',
        probeCost: 2000000,
        crewResearch: null,
        baseResearch: null
    }
};

// ========================================
// GAME INITIALIZATION
// ========================================

function initGame() {
    loadGame();
    initResearchTree();
    updateUI();
    generateContracts();
    setInterval(updateActiveMissions, 1000);
    setInterval(autoSave, 30000); // Auto-save every 30 seconds

    // Event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('hire-astronaut').addEventListener('click', hireAstronaut);
    document.getElementById('launch-btn').addEventListener('click', launchMission);
    document.getElementById('refresh-contracts').addEventListener('click', refreshContracts);

    document.getElementById('destination-select').addEventListener('change', updateMissionConfig);
    document.getElementById('payload-select').addEventListener('change', updateMissionConfig);
    document.getElementById('rocket-select').addEventListener('change', updateMissionConfig);
}

function initResearchTree() {
    Object.keys(RESEARCH_TREE).forEach(key => {
        if (gameState.research[key] === undefined) {
            gameState.research[key] = false;
        }
    });
}

// ========================================
// UI FUNCTIONS
// ========================================

function updateUI() {
    // Update header
    document.getElementById('budget').textContent = formatMoney(gameState.budget);
    document.getElementById('reputation').textContent = gameState.reputation + ' pts';

    // Update active tab content
    const activeTab = document.querySelector('.tab-content.active').id;

    if (activeTab === 'dashboard-tab') {
        updateDashboard();
    } else if (activeTab === 'research-tab') {
        updateResearchTree();
    } else if (activeTab === 'astronauts-tab') {
        updateAstronauts();
    } else if (activeTab === 'missions-tab') {
        updateMissionsTab();
    } else if (activeTab === 'locations-tab') {
        updateLocations();
    }
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    updateUI();
}

function updateDashboard() {
    // Contracts
    const contractsList = document.getElementById('contracts-list');
    if (gameState.contracts.length === 0) {
        contractsList.innerHTML = '<p style="color: #888;">No active contracts. Click refresh to get new ones.</p>';
    } else {
        contractsList.innerHTML = gameState.contracts.map((contract, idx) => `
            <div class="contract-item">
                <h4>${contract.title}</h4>
                <div class="requirement">${contract.description}</div>
                <div class="reward">Reward: ${formatMoney(contract.reward)} + ${contract.reputation} Rep</div>
                <button class="btn btn-primary" onclick="acceptContract(${idx})">ACCEPT</button>
            </div>
        `).join('');
    }

    // Active missions
    const activeMissions = document.getElementById('active-missions');
    if (gameState.activeMissions.length === 0) {
        activeMissions.innerHTML = '<p style="color: #888;">No active missions.</p>';
    } else {
        activeMissions.innerHTML = gameState.activeMissions.map((mission, idx) => {
            const progress = ((Date.now() - mission.startTime) / (mission.duration * 1000)) * 100;
            const timeLeft = Math.max(0, mission.duration - Math.floor((Date.now() - mission.startTime) / 1000));
            return `
                <div class="mission-item">
                    <h4>${mission.name}</h4>
                    <div>Destination: ${mission.destination}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, progress)}%"></div>
                    </div>
                    <div class="time-left">Time remaining: ${timeLeft}s</div>
                </div>
            `;
        }).join('');
    }

    // Quick stats
    const quickStats = document.getElementById('quick-stats');
    quickStats.innerHTML = `
        <div class="quick-stat">
            <div class="label">TOTAL LAUNCHES</div>
            <div class="value">${gameState.stats.totalLaunches}</div>
        </div>
        <div class="quick-stat">
            <div class="label">SUCCESS RATE</div>
            <div class="value">${gameState.stats.totalLaunches > 0 ? Math.round((gameState.stats.successfulLaunches / gameState.stats.totalLaunches) * 100) : 0}%</div>
        </div>
        <div class="quick-stat">
            <div class="label">ASTRONAUTS</div>
            <div class="value">${gameState.astronauts.length}</div>
        </div>
        <div class="quick-stat">
            <div class="label">COMPLETED</div>
            <div class="value">${gameState.completedMissions}</div>
        </div>
    `;
}

function updateResearchTree() {
    const researchTree = document.getElementById('research-tree');
    const categories = {};

    // Group by category
    Object.entries(RESEARCH_TREE).forEach(([key, research]) => {
        if (!categories[research.category]) {
            categories[research.category] = [];
        }
        categories[research.category].push({ key, ...research });
    });

    let html = '';
    Object.entries(categories).forEach(([category, items]) => {
        html += `<div style="grid-column: 1/-1; color: #ffaa00; margin-top: 20px;">▼ ${category.toUpperCase()}</div>`;
        items.forEach(item => {
            const unlocked = gameState.research[item.key];
            const available = !unlocked && canResearch(item.key);
            const locked = !unlocked && !available;

            let cssClass = 'research-item';
            if (unlocked) cssClass += ' unlocked';
            else if (available) cssClass += ' available';

            html += `
                <div class="${cssClass}" onclick="${available ? `confirmResearch('${item.key}')` : ''}">
                    <h4>${item.name}</h4>
                    <p style="color: #888; font-size: 12px; margin: 5px 0;">${item.description}</p>
                    ${item.benefit ? `<p style="color: #6bbc6b; font-size: 11px; margin: 8px 0; white-space: pre-line;">${item.benefit}</p>` : ''}
                    <div class="cost">Cost: ${formatMoney(item.cost)}</div>
                    <div class="status">
                        ${unlocked ? '✓ UNLOCKED' : locked ? '🔒 LOCKED' : '→ CLICK TO RESEARCH'}
                    </div>
                </div>
            `;
        });
    });

    researchTree.innerHTML = html;
}

function updateAstronauts() {
    const roster = document.getElementById('astronaut-roster');

    if (gameState.astronauts.length === 0) {
        roster.innerHTML = '<p style="color: #888;">No astronauts hired yet. Click the button above to hire one!</p>';
        return;
    }

    roster.innerHTML = gameState.astronauts.map(astronaut => `
        <div class="astronaut-card">
            <div style="font-size: 32px; text-align: center; margin-bottom: 10px;">${astronaut.avatar || '👨‍🚀'}</div>
            <h4>${astronaut.name}</h4>
            <div class="stat-line">Missions: ${astronaut.missions}</div>
            <div class="stat-line">Time in Space: ${astronaut.timeInSpace}s</div>
            <div class="stat-line">Visited: ${astronaut.locationsVisited.join(', ') || 'None'}</div>
            <div class="status">${astronaut.available ? '✓ Available' : '🚀 On Mission'}</div>
        </div>
    `).join('');
}

function updateMissionsTab() {
    // Update destination dropdown
    const destSelect = document.getElementById('destination-select');
    destSelect.innerHTML = Object.entries(DESTINATIONS)
        .filter(([key, dest]) => {
            if (!dest.research) return true;
            return gameState.research[dest.research];
        })
        .map(([key, dest]) => `<option value="${key}">${dest.name}</option>`)
        .join('');

    // Update rocket dropdown
    const rocketSelect = document.getElementById('rocket-select');
    rocketSelect.innerHTML = Object.entries(ROCKETS)
        .filter(([key, rocket]) => {
            if (!rocket.research) return true;
            return gameState.research[rocket.research];
        })
        .map(([key, rocket]) => `<option value="${key}">${rocket.name} - ${formatMoney(getRocketCost(key))}</option>`)
        .join('');

    // Update crew dropdown
    const crewSelect = document.getElementById('crew-select');
    crewSelect.innerHTML = '<option value="">None</option>' +
        gameState.astronauts
            .filter(a => a.available)
            .map((a, idx) => `<option value="${idx}">${a.name}</option>`)
            .join('');

    updateMissionConfig();
}

function updateMissionConfig() {
    const destination = document.getElementById('destination-select').value;
    const payload = document.getElementById('payload-select').value;
    const rocket = document.getElementById('rocket-select').value;
    const crew = document.getElementById('crew-select').value;

    const destData = DESTINATIONS[destination];
    const rocketData = ROCKETS[rocket];

    let cost = getRocketCost(rocket);
    let canLaunch = true;
    let message = '';

    // Add payload cost
    if (payload === 'probe') {
        cost += destData.probeCost;
    } else if (payload === 'crew') {
        if (!destData.crewResearch || !gameState.research[destData.crewResearch]) {
            canLaunch = false;
            message = `❌ Crew missions to ${destData.name} not yet researched`;
        } else if (crew === '') {
            canLaunch = false;
            message = '❌ Select an astronaut for crew mission';
        } else {
            cost += 100000; // Crew capsule cost
        }
    } else if (payload === 'base') {
        if (!destData.baseResearch || !gameState.research[destData.baseResearch]) {
            canLaunch = false;
            message = `❌ Base technology for ${destData.name} not yet researched`;
        } else {
            cost += 1000000; // Base module cost
        }
    }

    // Check capacity
    const requiredCapacity = payload === 'base' ? 10 : (payload === 'crew' ? 3 : 1);
    if (rocketData.capacity < requiredCapacity) {
        canLaunch = false;
        message = `❌ Rocket capacity insufficient (need ${requiredCapacity}T, have ${rocketData.capacity}T)`;
    }

    // Check budget
    if (cost > gameState.budget) {
        canLaunch = false;
        message = '❌ Insufficient budget';
    }

    document.getElementById('mission-cost').innerHTML = `
        <div>MISSION COST: ${formatMoney(cost)}</div>
        <div>DURATION: ${destData.time} seconds</div>
        ${message ? `<div style="color: #ff0000; margin-top: 10px;">${message}</div>` : ''}
    `;

    document.getElementById('launch-btn').disabled = !canLaunch;

    // Update mission preview art
    updateMissionPreview(destination, payload, rocket);
}

function updateMissionPreview(destination, payload, rocket) {
    const destData = DESTINATIONS[destination];
    const rocketData = ROCKETS[rocket];

    let payloadIcon = '';
    let description = '';

    // Generate art based on payload
    if (payload === 'probe') {
        payloadIcon = '🛰️';
        description = `Deploy satellite to ${destData.name}. Collect scientific data and transmit back to Earth.`;
    } else if (payload === 'crew') {
        payloadIcon = '👨‍🚀';
        description = `Send astronauts to ${destData.name}. Conduct experiments and return safely to Earth.`;
    } else if (payload === 'base') {
        payloadIcon = '🏠';
        description = `Deliver habitat module to ${destData.name}. Establish permanent infrastructure for future missions.`;
    }

    // Destination icon
    let destIcon = '';
    if (destination === 'leo') destIcon = '🌍';
    else if (destination === 'moon') destIcon = '🌙';
    else if (destination === 'mars') destIcon = '🔴';
    else if (destination === 'venus') destIcon = '🟡';
    else if (destination === 'jupiter') destIcon = '🪐';

    // Rocket icon based on type
    let rocketIcon = '🚀';
    if (rocket === 'spaceplane') rocketIcon = '✈️';
    else if (rocket === 'heavy' || rocket === 'superHeavy') rocketIcon = '🚀';

    document.getElementById('mission-preview').innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">${destIcon}</div>
        <div style="font-size: 36px; margin: 20px 0;">${payloadIcon}</div>
        <div style="font-size: 42px; margin-bottom: 20px;">${rocketIcon}</div>
        <div style="color: #5ba3a3; font-size: 14px; font-weight: bold; margin-bottom: 5px;">${rocketData.name}</div>
        <div class="mission-description">${description}</div>
    `;
}

function updateLocations() {
    const locationsList = document.getElementById('locations-list');

    locationsList.innerHTML = Object.entries(gameState.locations).map(([key, loc]) => {
        const destData = DESTINATIONS[key];
        const locked = destData && destData.research && !gameState.research[destData.research];

        return `
            <div class="location-card ${locked ? 'locked' : ''}">
                <h3>${destData ? destData.name : key.toUpperCase()}</h3>
                ${locked ? '<p style="color: #888;">🔒 LOCKED - Research required</p>' : `
                    <div class="location-stat">Visits: ${loc.visited}</div>
                    <div class="location-stat">Has Base: ${loc.hasBase ? '✓ Yes' : '✗ No'}</div>
                    ${loc.hasBase ? `
                        <div class="location-stat">Crew: ${loc.crew}</div>
                        <div class="location-stat">Modules: ${loc.modules}</div>
                        ${loc.miningLevel !== undefined ? `<div class="location-stat">Mining Level: ${loc.miningLevel}</div>` : ''}
                    ` : ''}
                `}
            </div>
        `;
    }).join('');
}

// ========================================
// GAME LOGIC
// ========================================

function canResearch(researchKey) {
    const research = RESEARCH_TREE[researchKey];
    if (gameState.research[researchKey]) return false;

    // Check prerequisites
    for (let prereq of research.prerequisites) {
        if (!gameState.research[prereq]) return false;
    }

    return true;
}

function confirmResearch(researchKey) {
    const research = RESEARCH_TREE[researchKey];

    if (confirm(`Research ${research.name} for ${formatMoney(research.cost)}?\n\nThis will unlock:\n${research.benefit || research.description}`)) {
        purchaseResearch(researchKey);
    }
}

function purchaseResearch(researchKey) {
    const research = RESEARCH_TREE[researchKey];

    if (!canResearch(researchKey)) {
        showNotification('Prerequisites not met', 'error');
        return;
    }

    if (gameState.budget < research.cost) {
        showNotification('Insufficient funds', 'error');
        return;
    }

    gameState.budget -= research.cost;
    gameState.research[researchKey] = true;

    // Unlock locations
    if (researchKey === 'moonMissions') gameState.locations.moon.unlocked = true;
    if (researchKey === 'marsMissions') gameState.locations.mars.unlocked = true;
    if (researchKey === 'venusMissions') gameState.locations.venus.unlocked = true;
    if (researchKey === 'jupiterMissions') gameState.locations.jupiter.unlocked = true;

    showNotification(`Researched: ${research.name}`, 'success');
    updateUI();
}

function hireAstronaut() {
    const cost = 50000;

    if (gameState.budget < cost) {
        showNotification('Insufficient funds', 'error');
        return;
    }

    const names = ['Alex', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Grey', 'Harper', 'Indigo', 'Jordan',
                   'Kelly', 'Logan', 'Morgan', 'Noel', 'Oakley', 'Parker', 'Quinn', 'Riley', 'Sage', 'Taylor'];
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.';

    const avatars = ['👨‍🚀', '👩‍🚀', '🧑‍🚀'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const astronaut = {
        name: name,
        avatar: avatar,
        missions: 0,
        timeInSpace: 0,
        locationsVisited: [],
        available: true
    };

    gameState.astronauts.push(astronaut);
    gameState.budget -= cost;
    gameState.stats.astronautsHired++;

    showNotification(`Hired ${name}`, 'success');
    updateUI();
}

function getRocketCost(rocketKey) {
    const rocket = ROCKETS[rocketKey];
    let cost = rocket.cost;

    // Apply reusable discount
    if (gameState.research['reusableRockets'] && !rocket.reusable) {
        cost = Math.floor(cost * 0.5);
    }

    return cost;
}

function launchMission() {
    const destination = document.getElementById('destination-select').value;
    const payload = document.getElementById('payload-select').value;
    const rocket = document.getElementById('rocket-select').value;
    const crewIdx = document.getElementById('crew-select').value;

    const destData = DESTINATIONS[destination];
    const rocketData = ROCKETS[rocket];

    let cost = getRocketCost(rocket);

    if (payload === 'probe') {
        cost += destData.probeCost;
    } else if (payload === 'crew') {
        cost += 100000;
    } else if (payload === 'base') {
        cost += 1000000;
    }

    if (gameState.budget < cost) {
        showNotification('Insufficient funds', 'error');
        return;
    }

    // Create mission
    const mission = {
        name: `${destData.name} ${payload} mission`,
        destination: destData.name,
        destinationKey: destination,
        payload: payload,
        rocket: rocketData.name,
        duration: destData.time,
        startTime: Date.now(),
        cost: cost,
        crewIdx: crewIdx !== '' ? parseInt(crewIdx) : null
    };

    gameState.activeMissions.push(mission);
    gameState.budget -= cost;
    gameState.stats.totalLaunches++;

    if (mission.crewIdx !== null) {
        gameState.astronauts[mission.crewIdx].available = false;
    }

    // Show launch animation
    showLaunchAnimation(rocket);

    showNotification(`🚀 Launched to ${destData.name}!`, 'success');

    // Switch to dashboard to watch the mission
    switchTab('dashboard');
}

function showLaunchAnimation(rocketType) {
    const animationEl = document.getElementById('launch-animation');
    const rocketEl = document.getElementById('launch-rocket');

    // Set rocket icon based on type
    if (rocketType === 'spaceplane') {
        rocketEl.textContent = '✈️';
    } else {
        rocketEl.textContent = '🚀';
    }

    // Reset animation
    rocketEl.classList.remove('explode');
    rocketEl.style.animation = 'none';

    // Show overlay
    animationEl.style.display = 'flex';

    // Trigger animation
    setTimeout(() => {
        rocketEl.style.animation = 'rocketLaunch 3s ease-in forwards';
    }, 10);

    // Hide after animation
    setTimeout(() => {
        animationEl.style.display = 'none';
    }, 3000);
}

function showExplosionAnimation() {
    const animationEl = document.getElementById('launch-animation');
    const rocketEl = document.getElementById('launch-rocket');

    // Change to explosion emoji
    rocketEl.textContent = '💥';

    // Reset and apply explosion animation
    rocketEl.style.animation = 'none';

    // Show overlay
    animationEl.style.display = 'flex';

    // Trigger explosion animation
    setTimeout(() => {
        rocketEl.style.animation = 'rocketExplode 1.5s ease-out forwards';
    }, 10);

    // Hide after animation
    setTimeout(() => {
        animationEl.style.display = 'none';
    }, 1500);
}

function updateActiveMissions() {
    const now = Date.now();
    const completed = [];

    gameState.activeMissions = gameState.activeMissions.filter((mission, idx) => {
        const elapsed = (now - mission.startTime) / 1000;

        if (elapsed >= mission.duration) {
            completed.push(mission);
            return false;
        }
        return true;
    });

    completed.forEach(mission => {
        completeMission(mission);
    });

    // Update dashboard if visible and there are active missions
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'dashboard-tab' && gameState.activeMissions.length > 0) {
        // Update just the active missions display without full UI refresh
        const activeMissionsEl = document.getElementById('active-missions');
        activeMissionsEl.innerHTML = gameState.activeMissions.map((mission, idx) => {
            const progress = ((Date.now() - mission.startTime) / (mission.duration * 1000)) * 100;
            const timeLeft = Math.max(0, mission.duration - Math.floor((Date.now() - mission.startTime) / 1000));
            return `
                <div class="mission-item">
                    <h4>${mission.name}</h4>
                    <div>Destination: ${mission.destination}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, progress)}%"></div>
                    </div>
                    <div class="time-left">Time remaining: ${timeLeft}s</div>
                </div>
            `;
        }).join('');
    }

    if (completed.length > 0) {
        updateUI();
    }
}

function completeMission(mission) {
    // Success chance (95% base)
    const success = Math.random() < 0.95;

    if (!success) {
        // Show explosion animation
        showExplosionAnimation();

        showNotification(`❌ ${mission.name} failed!`, 'error');
        gameState.stats.totalLaunches++; // Already incremented, but keep for tracking

        if (mission.crewIdx !== null) {
            gameState.astronauts[mission.crewIdx].available = true;
        }
        return;
    }

    gameState.completedMissions++;
    gameState.stats.successfulLaunches++;

    // Update location stats
    const loc = gameState.locations[mission.destinationKey];
    loc.visited++;

    // Update astronaut
    if (mission.crewIdx !== null) {
        const astronaut = gameState.astronauts[mission.crewIdx];
        astronaut.available = true;
        astronaut.missions++;
        astronaut.timeInSpace += mission.duration;

        if (!astronaut.locationsVisited.includes(mission.destination)) {
            astronaut.locationsVisited.push(mission.destination);
        }
    }

    // Handle base building
    if (mission.payload === 'base') {
        loc.hasBase = true;
        loc.modules++;
        showNotification(`✓ ${mission.destination} base established!`, 'success');
    } else {
        showNotification(`✓ ${mission.name} completed!`, 'success');
    }

    // Reputation gain
    const repGain = mission.payload === 'base' ? 20 : mission.payload === 'crew' ? 10 : 5;
    addReputation(repGain);

    // Check contracts
    checkContracts(mission);

    // Mining income
    if (loc.hasBase && loc.miningLevel > 0) {
        const income = loc.miningLevel * 50000;
        gameState.budget += income;
        showNotification(`Mining income: ${formatMoney(income)}`, 'info');
    }
}

function generateContracts() {
    gameState.contracts = [];

    const contractTypes = [];

    // LEO contracts - varied and more rewarding for early game
    contractTypes.push(
        { type: 'leo-sat-1', title: 'Commercial Satellite Launch', desc: 'Launch 1 communications satellite to LEO', count: 1, dest: 'leo', payload: 'probe', reward: 180000, rep: 3 },
        { type: 'leo-sat-2', title: 'GPS Constellation Deployment', desc: 'Launch 2 navigation satellites to LEO', count: 2, dest: 'leo', payload: 'probe', reward: 330000, rep: 5 },
        { type: 'leo-sat-3', title: 'Earth Observation Contract', desc: 'Deploy 3 remote sensing satellites', count: 3, dest: 'leo', payload: 'probe', reward: 480000, rep: 8 },
        { type: 'leo-crew', title: 'ISS Crew Rotation', desc: 'Deliver astronauts to International Space Station', count: 1, dest: 'leo', payload: 'crew', reward: 250000, rep: 10, needsResearch: 'humanSpaceflight' },
        { type: 'leo-station', title: 'Space Station Resupply', desc: 'Deliver supplies to LEO station', count: 2, dest: 'leo', payload: 'probe', reward: 350000, rep: 6 }
    );

    // Moon contracts
    if (gameState.research['moonMissions']) {
        contractTypes.push(
            { type: 'moon-probe', title: 'Lunar Reconnaissance Orbiter', desc: 'Send mapping probe to Moon orbit', count: 1, dest: 'moon', payload: 'probe', reward: 650000, rep: 12 },
            { type: 'moon-probe-2', title: 'Lunar Surface Mission', desc: 'Land robotic probe on Moon surface', count: 1, dest: 'moon', payload: 'probe', reward: 800000, rep: 15 },
            { type: 'moon-crew', title: 'Apollo-class Mission', desc: 'Land astronauts on lunar surface', count: 1, dest: 'moon', payload: 'crew', reward: 2000000, rep: 30, needsResearch: 'lunarLanding' },
            { type: 'moon-base', title: 'Artemis Base Program', desc: 'Establish permanent lunar outpost', count: 1, dest: 'moon', payload: 'base', reward: 4000000, rep: 40, needsResearch: 'moonBase' }
        );
    }

    // Mars contracts
    if (gameState.research['marsMissions']) {
        contractTypes.push(
            { type: 'mars-probe', title: 'Mars Reconnaissance Mission', desc: 'Send orbital surveyor to Mars', count: 1, dest: 'mars', payload: 'probe', reward: 1500000, rep: 25 },
            { type: 'mars-probe-2', title: 'Mars Rover Program', desc: 'Land robotic rover on Mars', count: 1, dest: 'mars', payload: 'probe', reward: 2000000, rep: 30 },
            { type: 'mars-crew', title: 'First Mars Landing', desc: 'Land crew on martian surface', count: 1, dest: 'mars', payload: 'crew', reward: 5000000, rep: 60, needsResearch: 'marsLanding' },
            { type: 'mars-base', title: 'Mars Colony Initiative', desc: 'Establish permanent Mars settlement', count: 1, dest: 'mars', payload: 'base', reward: 10000000, rep: 80, needsResearch: 'marsBase' }
        );
    }

    // Venus contracts
    if (gameState.research['venusMissions']) {
        contractTypes.push(
            { type: 'venus-probe', title: 'Venus Atmospheric Probe', desc: 'Send probe to study Venus atmosphere', count: 1, dest: 'venus', payload: 'probe', reward: 1800000, rep: 28 }
        );
    }

    // Jupiter contracts
    if (gameState.research['jupiterMissions']) {
        contractTypes.push(
            { type: 'jupiter-probe', title: 'Jupiter System Explorer', desc: 'Send probe to Jupiter and its moons', count: 1, dest: 'jupiter', payload: 'probe', reward: 4000000, rep: 50 }
        );
    }

    // Filter by research and randomly select 3
    const available = contractTypes.filter(c => !c.needsResearch || gameState.research[c.needsResearch]);
    const selected = [];

    for (let i = 0; i < Math.min(3, available.length); i++) {
        const idx = Math.floor(Math.random() * available.length);
        selected.push(available[idx]);
        available.splice(idx, 1);
    }

    gameState.contracts = selected.map(c => ({
        ...c,
        description: c.desc,
        progress: 0
    }));

    updateUI();
}

function refreshContracts() {
    const cost = 10000;

    if (gameState.budget < cost) {
        showNotification('Insufficient funds', 'error');
        return;
    }

    gameState.budget -= cost;
    generateContracts();
    showNotification('Contracts refreshed', 'info');
}

function acceptContract(idx) {
    const contract = gameState.contracts[idx];
    showNotification(`Contract accepted: ${contract.title}`, 'info');
    // Contract tracking happens automatically through checkContracts
}

function checkContracts(mission) {
    gameState.contracts.forEach((contract, idx) => {
        if (contract.dest === mission.destinationKey && contract.payload === mission.payload) {
            contract.progress++;

            if (contract.progress >= contract.count) {
                // Contract completed!
                gameState.budget += contract.reward;
                addReputation(contract.rep);
                showNotification(`Contract completed! +${formatMoney(contract.reward)}`, 'success');
                gameState.contracts.splice(idx, 1);

                // Generate new contract
                if (gameState.contracts.length < 3) {
                    generateContracts();
                }
            }
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function addReputation(amount) {
    const oldRep = gameState.reputation;
    gameState.reputation += amount;

    // Check for milestone bonuses (every 25 reputation)
    const oldMilestone = Math.floor(oldRep / 25);
    const newMilestone = Math.floor(gameState.reputation / 25);

    if (newMilestone > oldMilestone) {
        const bonusCount = newMilestone - oldMilestone;
        const bonus = bonusCount * 100000; // $100k per milestone
        gameState.budget += bonus;
        showNotification(`🏆 Reputation Milestone! Government funding: ${formatMoney(bonus)}`, 'success');
    }
}

function formatMoney(amount) {
    return '$' + amount.toLocaleString();
}

function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notifications.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ========================================
// SAVE/LOAD
// ========================================

function saveGame() {
    localStorage.setItem('spaceAgencySave', JSON.stringify(gameState));
    showNotification('Game saved', 'info');
}

function loadGame() {
    const saved = localStorage.getItem('spaceAgencySave');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
            showNotification('Game loaded', 'success');
        } catch (e) {
            console.error('Failed to load save:', e);
        }
    }
}

function autoSave() {
    localStorage.setItem('spaceAgencySave', JSON.stringify(gameState));
}

function resetGame() {
    if (confirm('Are you sure you want to reset? This cannot be undone!')) {
        localStorage.removeItem('spaceAgencySave');
        location.reload();
    }
}

// ========================================
// START GAME
// ========================================

window.addEventListener('DOMContentLoaded', initGame);

// Expose functions to window for onclick handlers
window.purchaseResearch = purchaseResearch;
window.confirmResearch = confirmResearch;
window.acceptContract = acceptContract;
