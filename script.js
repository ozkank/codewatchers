let symbols = ['🌟', '🍎', '🐱', '🌈', '🚀', '🎈', '🍕', '🐶','🌟', '🍎', '🐱', '🌈', '🚀', '🎈', '🍕', '🐶','🎈', '🍕', '🐶'];
let cards = [];
let grid = document.getElementById('grid');
let flippedCards = [];
let matches = 0;
let currentLevel = 0;
let cardCounts = [4];
let countdownInterval;
let timerSeconds = 0;

function startGame() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    currentLevel = 0;

    const countdownElement = document.getElementById('countdown');

    // Remove the "let" keyword here to use the global variable
    countdownInterval = setInterval(() => {
        timerSeconds++
        countdownElement.textContent = timerSeconds;
        
    }, 1000);
    startLevel();
}
function startLevel() {
    currentLevel++;

    let currentCardCount = cardCounts[currentLevel - 1];
    let levelSymbols = symbols.slice(0, currentCardCount / 2);
    let levelCards = [...levelSymbols, ...levelSymbols];
    levelCards.sort(() => Math.random() - 0.5);

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
        card1.style.visibility = 'hidden';
        card2.style.visibility = 'hidden';
        flippedCards = [];
        matches++;

        if (matches === cardCounts[currentLevel - 1] / 2) {
            if (currentLevel < cardCounts.length) {
                startLevel();
            } else {
                displayScore();
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

function displayScore() {
    clearInterval(countdownInterval); 
    const message = 'Congratulations! You completed all levels, ' + document.getElementById('username').value + '!\nYour final score: ' + timerSeconds + '.';
    document.getElementById('scoreboard').textContent = message;
}
