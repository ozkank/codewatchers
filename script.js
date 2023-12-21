let symbols = {
    'animals': ['🐱', '🐶', '🦊', '🐘', '🐼', '🦁', '🐯', '🦓','🐱', '🐶', '🦊', '🐘', '🐼', '🦁', '🐯', '🦓','🐱', '🐶', '🦊', '🐘', '🐼', '🦁', '🐯', '🦓','🐱', '🐶', '🦊', '🐘', '🐼', '🦁', '🐯', '🦓'],
    'recycle': ['♻️', '🌍', '🚮', '🌱', '🔄', '🔁', '🗑️', '🌿']
};
let cards = [];
let grid = document.getElementById('grid');
let flippedCards = [];
let matches = 0;
let currentLevel = 0;
let cardCounts = [2,4,6];
let countdownInterval;
let timerSeconds = 0;
let selectedCardType;
const congrats = document.querySelector("#congratsSection");
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
grid.innerHTML = '';
    selectedCardType = document.getElementById('card-type').value;
    
    let currentCardCount = cardCounts[currentLevel - 1];
    let levelSymbols = symbols[selectedCardType].slice(0, currentCardCount / 2);
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
            if(currentLevel===cardCounts.length)  
            {
                winGame();
            }
            {
                matches=0;
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

function winGame() {
    clearInterval(countdownInterval); 

    document.getElementById('canvas').style.display = 'block';

    const message = 'Congratulations! You completed all levels, ' + document.getElementById('username').value + '!\nYour final score: ' + timerSeconds + '.';
    document.getElementById('scoreboard').textContent = message;
}

  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
