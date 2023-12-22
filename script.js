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
let bestScoreAchieved = false;
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

async function winGame() {
    clearInterval(countdownInterval);

  
    const username = document.getElementById('username').value;
  
    try {
        const lowestScoresResponse = await fetch('http://localhost:3000/getLowestScore');
        const lowestScores = await lowestScoresResponse.json();

        // Check if the new score is among the lowest scores
        const isNewLowestScore = lowestScores.some(score => timerSeconds < score.score);

        if (isNewLowestScore) {
            bestScoreAchieved = true;
            document.getElementById('canvas').style.display = 'block';
        }

        await fetch('http://localhost:3000/saveScore', {
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
        
        const response = await fetch('http://localhost:3000/getScores');
        const scores = await response.json();

        const scoreList = document.getElementById('score-list');

        scores.forEach((score, index) => {
            const scoreItem = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;

            const usernameCell = document.createElement('td');
            usernameCell.classList.add('username');
            usernameCell.textContent = score.username;

            const scoreCell = document.createElement('td');
            scoreCell.classList.add('score');
            scoreCell.textContent = score.score;

            scoreItem.appendChild(rankCell);
            scoreItem.appendChild(usernameCell);
            scoreItem.appendChild(scoreCell);

            scoreList.appendChild(scoreItem);
        });
    } catch (error) {
        console.error('Error getting scores:', error);
    }
}