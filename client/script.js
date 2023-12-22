let symbols = {
    'animals': ['🐱', '🐶', '🦊', '🐘', '🐼', '🦁', '🐯', '🦓', '🐪', '🦒', '🐕', '🐅', '🐨', '🐻', '🦔', '🐹', '🐰', '🦝', '🦙', '🐮', '🐷', '🐽', '🦛', '🐘', '🦍', '🦏', '🐪', '🐆', '🦓', '🦒', '🐊', '🐢', '🦎'],
    'recycle': ['🍷', '🥂', '🥤', '🍸', '🍹', '🍺', '🍻', '🥛', '🍼', '🧊', '📄', '📃', '📑', '📜', '📰', '🗞️', '📖', '📚', '📔', '📒', '🔩', '🛠️', '⚙️', '🔧', '🔨', '🔗', '⛓️', '⚖️', '🔗', '🛢️', '🍏', '🍌', '🍎', '🍐', '🍊', '🍋', '🍓', '🍈', '🍒', '🍑']
};
let cards = [];
let grid = document.getElementById('grid');
let flippedCards = [];
let matches = 0;
let currentLevel = 0;
let cardCounts = [4, 8, 16, 24, 28, 36];
let countdownInterval;
let timerSeconds = 0;
let bestScoreAchieved = false;
let selectedCardType;

const trashTypes = ['glass', 'paper', 'metal', 'organic'];

const trashCounts = {
    glass: 0,
    paper: 0,
    metal: 0,
    organic: 0,
};

const congrats = document.querySelector("#congratsSection");
function startGame() {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('Please enter your name.');
        return;
    }

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    selectedCardType = document.getElementById('card-type').value;
    if (selectedCardType === 'animals') {
        document.querySelector('.image-container').style.display = 'none';
    } else {
        document.querySelector('.image-container').style.display = 'flex';
    }

    currentLevel = 0;

    const countdownElement = document.getElementById('countdown');

    countdownInterval = setInterval(() => {
        timerSeconds++
        countdownElement.textContent = timerSeconds;

    }, 1000);
    startLevel();
}

function resetGame() {
    location.reload();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startLevel() {
    currentLevel++;
    grid.innerHTML = '';
    selectedCardType = document.getElementById('card-type').value;

    let currentCardCount = cardCounts[currentLevel - 1];
    let symbolsCopy = symbols[selectedCardType].slice();
    let levelSymbols = [];

    for (let i = 0; i < currentCardCount / 2; i++) {
        const randomIndex = Math.floor(Math.random() * symbolsCopy.length);
        levelSymbols.push(symbolsCopy[randomIndex]);

        symbolsCopy.splice(randomIndex, 1);
    }

    let levelCards = [...levelSymbols, ...levelSymbols];
    levelCards = shuffleArray(levelCards);

    const columns = Math.sqrt(currentCardCount);
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    levelCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}


function flipCard() {
    if (flippedCards.length >= 2) {
        return;
    }

    const card = this;
    card.classList.add('open');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        const trashType = getTrashType(card1.dataset.symbol);
        trashCounts[trashType]++;

        // Update labels for each pair found
        updateTrashLabels();

        flippedCards = [];
        matches++;

        if (matches === cardCounts[currentLevel - 1] / 2) {
            if (currentLevel === cardCounts.length) {
                winGame();
            } else {
                matches = 0;
                startLevel();
            }
        }
    } else {
        card1.classList.remove('open');
        card2.classList.remove('open');
        card1.textContent = '';
        card2.textContent = '';
        flippedCards = [];
    }
}


async function winGame() {
    clearInterval(countdownInterval);
    const username = document.getElementById('username').value;
    try {
        const lowestScoresResponse = await fetch('https://codewatcher-function.azurewebsites.net/api/GetLowestScore');
        const lowestScores = await lowestScoresResponse.json();

        const isNewLowestScore = lowestScores.some(score => timerSeconds < score.score);

        if (isNewLowestScore) {
            bestScoreAchieved = true;
            document.getElementById('canvas').style.display = 'block';
        }

        await fetch('https://codewatcher-function.azurewebsites.net/api/SaveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, score: timerSeconds }),
        });

        const message = (bestScoreAchieved) => {
            if (bestScoreAchieved) {
                return `Congratulations! You completed all levels and achieved the best score, ${username}! \nYour score: ${timerSeconds}.`;
            } else {
                return `Congratulations! You completed all levels, ${username}!\nYour score: ${timerSeconds}.`;
            }
        };

        const congratulatoryMessage = message(bestScoreAchieved);
        document.getElementById('scoreboard').textContent = congratulatoryMessage;

    } catch (error) {
        console.error('Error saving score or getting lowest score:', error);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener('DOMContentLoaded', () => {
    getScores();
});

async function getScores() {
    try {

        const response = await fetch('https://codewatcher-function.azurewebsites.net/api/GetScores');

        console.log("response: ", response);
        const scores = await response.json();

        const scoreList = document.getElementById('score-list');

        scores.forEach((score, index) => {
            const scoreItem = document.createElement('tr');

            const rankCell = document.createElement('td');

            rankCell.textContent = index + 1;
            rankCell.style.fontWeight = 'bold';

            const usernameCell = document.createElement('td');
            usernameCell.classList.add('username');
            usernameCell.textContent = score.username;

            const scoreCell = document.createElement('td');
            scoreCell.classList.add('score');
            scoreCell.textContent = score.score;
            scoreCell.style.fontWeight = 'bold';

            scoreItem.appendChild(rankCell);
            scoreItem.appendChild(usernameCell);
            scoreItem.appendChild(scoreCell);

            scoreList.appendChild(scoreItem);
        });
    } catch (error) {
        console.error('Error getting scores:', error);
    }
}

function getTrashType(symbol) {
    const symbolToTrashMap = {
        'glass': ['🍷', '🥂', '🥤', '🍸', '🍹', '🍺', '🍻', '🥛', '🍼', '🧊'],
        'paper': ['📄', '📃', '📑', '📜', '📰', '🗞️', '📖', '📚', '📔', '📒'],
        'metal': ['🔩', '🛠️', '⚙️', '🔧', '🔨', '🔗', '⛓️', '⚖️', '🔗', '🛢️'],
        'organic': ['🍏', '🍌', '🍎', '🍐', '🍊', '🍋', '🍓', '🍈', '🍒', '🍑'],
    };

    for (const [trashType, symbols] of Object.entries(symbolToTrashMap)) {
        if (symbols.includes(symbol)) {
            return trashType;
        }
    }

    return null;
}

function updateTrashLabels() {
    for (const trashType of trashTypes) {
        const label = document.getElementById(`${trashType}-count`);
        if (label) {
            label.textContent = trashCounts[trashType];
        }
    }
}