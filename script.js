let symbols = ['🌟', '🍎', '🐱', '🌈', '🚀', '🎈', '🍕', '🐶'];
let cards = [];
let grid = document.getElementById('grid');
let flippedCards = [];
let matches = 0;
let timer = 10;
let timerInterval;

function startGame() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }

    // Hide login container
    document.getElementById('login-container').style.display = 'none';

    // Display game container
    document.getElementById('game-container').style.display = 'flex';

    // Reset the game
    resetGame();

    // Shuffle the cards
    let cards = [...symbols, ...symbols];
    cards.sort(() => Math.random() - 0.5);

    // Create cards and append them to the grid
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });

    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
    // Clear the grid and reset variables
    grid.innerHTML = '';
    flippedCards = [];
    matches = 0;
    timer = 10;
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = `Time: ${timer} seconds`;
    document.getElementById('scoreboard').textContent = '';
}

function flipCard() {
    if (timer === 0 || flippedCards.length >= 2) {
        // If time is over or two cards are already flipped, return early
        return;
    }

    const card = this;
    card.classList.add('open');
    card.textContent = card.dataset.symbol; // Show the symbol
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Cards match, remove them from the page
        card1.style.visibility = 'hidden';
        card2.style.visibility = 'hidden';
        flippedCards = [];
        matches++;

        if (matches === symbols.length) {
            // All matches made, display the scoreboard
            clearInterval(timerInterval);
            displayScore();
        }
    } else {
        // Cards do not match, flip them back and hide the symbols
        card1.classList.remove('open');
        card2.classList.remove('open');
        card1.textContent = '';
        card2.textContent = '';
        flippedCards = [];
    }
}

function updateTimer() {
    timer--; // Decrement the timer
    // Display the timer value
    document.getElementById('timer').textContent = `Time: ${timer} seconds`;

    if (timer === 0 && matches !== symbols.length) {
        clearInterval(timerInterval);
        document.getElementById('scoreboard').textContent = `Game over! Your score: ${matches} pairs.`;
    }
}

function displayScore() {
    document.getElementById('scoreboard').textContent = `Congratulations! You completed the game in ${10 - timer} seconds, ${document.getElementById('username').value}! Your score: ${matches} pairs.`;
}
