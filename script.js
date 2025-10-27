// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// --- Removed Tic Tac Toe and Quiz game code ---
// (variables and functions related to Tic Tac Toe and Quiz have been deleted:
//  currentPlayer, gameBoard, gameActive, initializeTicTacToe, cellClicked,
//  checkWinner, highlightWinningCells, resetTicTacToe,
//  quizQuestions, initializeQuiz, displayQuestion, selectOption,
//  submitAnswer, resetQuiz, updateQuizScore, and related DOMContentLoaded calls)

// Keep or reinitialize other games / helpers below:

// Memory Game (kept)
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function initializeMemoryGame() {
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🥝', '🍑'];
    memoryCards = [...symbols, ...symbols];
    shuffleArray(memoryCards);
    
    const board = document.getElementById('memoryGameBoard');
    board.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-index', index);
        
        card.innerHTML = `
            <div class="front">?</div>
            <div class="back">${symbol}</div>
        `;
        
        card.addEventListener('click', () => flipCard(index));
        board.appendChild(card);
    });
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function flipCard(index) {
    const card = document.querySelector(`.memory-card[data-index="${index}"]`);
    
    if (card.classList.contains('flipped') || flippedCards.length >= 2) return;
    
    card.classList.add('flipped');
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
        const [firstIndex, secondIndex] = flippedCards;
        
        if (memoryCards[firstIndex] === memoryCards[secondIndex]) {
            // Match found
            flippedCards = [];
            matchedPairs++;
            
            if (matchedPairs === memoryCards.length / 2) {
                document.getElementById('memoryStatus').textContent = "Congratulations! You've matched all pairs!";
            } else {
                document.getElementById('memoryStatus').textContent = "Match found! Keep going!";
            }
        } else {
            // No match
            setTimeout(() => {
                document.querySelectorAll('.memory-card').forEach(card => {
                    if (flippedCards.includes(parseInt(card.getAttribute('data-index')))) {
                        card.classList.remove('flipped');
                    }
                });
                flippedCards = [];
                document.getElementById('memoryStatus').textContent = "Try again!";
            }, 1000);
        }
    }
}
function resetMemoryGame() {
    flippedCards = [];
    matchedPairs = 0;
    document.getElementById('memoryStatus').textContent = "Find all matching pairs!";
    initializeMemoryGame();
}
window.resetMemoryGame = resetMemoryGame;

// --- Simple Rock-Paper-Scissors ---
function playRPS(choice) {
    const choices = ['rock','paper','scissors'];
    const computer = choices[Math.floor(Math.random() * choices.length)];
    const resultEl = document.getElementById('rpsResult');
    let resultText = `You: ${choice} — Computer: ${computer} — `;
    if (choice === computer) resultText += 'Draw';
    else if (
        (choice === 'rock' && computer === 'scissors') ||
        (choice === 'paper' && computer === 'rock') ||
        (choice === 'scissors' && computer === 'paper')
    ) resultText += 'You win!';
    else resultText += 'Computer wins';
    if (resultEl) resultEl.textContent = resultText;
}
function resetRPS() {
    const resultEl = document.getElementById('rpsResult');
    if (resultEl) resultEl.textContent = 'Choose: Rock, Paper or Scissors';
}
window.playRPS = playRPS;
window.resetRPS = resetRPS;

// --- Simple Simon Says ---
let simonSequence = [];
let simonPlayerIndex = 0;
let simonPlaying = false;

function startSimon() {
    resetSimon();
    addSimonStep();
    playSimonSequence();
}
function resetSimon() {
    simonSequence = [];
    simonPlayerIndex = 0;
    simonPlaying = false;
    const status = document.getElementById('simonStatus');
    if (status) status.textContent = 'Press Start to play';
}
function addSimonStep() {
    const next = Math.floor(Math.random() * 4);
    simonSequence.push(next);
    simonPlayerIndex = 0;
}
function flashButton(idx) {
    const btn = document.querySelector(`.simon-btn[data-color="${idx}"]`);
    if (!btn) return;
    btn.classList.add('flash');
    // short audible/visual cue (optional)
    setTimeout(() => btn.classList.remove('flash'), 300);
}

async function playSimonSequence() {
    simonPlaying = true;
    const status = document.getElementById('simonStatus');
    if (status) status.textContent = 'Watch the sequence';
    for (let i = 0; i < simonSequence.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        flashButton(simonSequence[i]);
    }
    simonPlaying = false;
    if (status) status.textContent = `Your turn — repeat ${simonSequence.length} steps`;
}
function handleSimonClick(idx) {
    if (simonPlaying || simonSequence.length === 0) return;
    flashButton(idx);
    if (idx !== simonSequence[simonPlayerIndex]) {
        const status = document.getElementById('simonStatus');
        if (status) status.textContent = 'Wrong — game over';
        return;
    }
    simonPlayerIndex++;
    if (simonPlayerIndex === simonSequence.length) {
        const status = document.getElementById('simonStatus');
        if (status) status.textContent = 'Good — next round';
        addSimonStep();
        setTimeout(playSimonSequence, 700);
    }
}

// wire up simon buttons using delegated listener and initialize memory game
document.addEventListener('DOMContentLoaded', function () {
    try { initializeMemoryGame(); } catch (e) { /* ignore if function stubbed */ }

    // Delegated click handler — works even if elements are added later
    document.addEventListener('click', function (e) {
        // DEBUG: log all clicks (remove after debugging)
        // console.log('doc click:', e.target);

        const btn = e.target.closest('.simon-btn');
        if (btn && btn.hasAttribute('data-color')) {
            const idx = Number(btn.getAttribute('data-color'));
            // DEBUG: confirm handler call
            console.log('simon click', idx, 'simonPlaying=', simonPlaying, 'sequenceLen=', simonSequence.length);
            handleSimonClick(idx);
        }
    });
});

// showGame helper (keeps existing behavior)
if (typeof showGame === 'undefined') {
    function showGame(id) {
        document.querySelectorAll('.game-area').forEach(el => {
            el.style.display = (el.id === id) ? 'block' : 'none';
        });
    }
    window.showGame = showGame;
}