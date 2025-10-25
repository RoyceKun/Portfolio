// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

let quizQuestions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which language is used for web app styling?",
        options: [
            "HTML",
            "JavaScript",
            "CSS",
            "Python"
        ],
        correct: 2
    },
    {
        question: "What is JavaScript primarily used for?",
        options: [
            "Styling web pages",
            "Creating web page structure",
            "Adding interactivity to web pages",
            "Database management"
        ],
        correct: 2
    }
];
let currentQuestion = 0;
let quizScore = 0;
let selectedOption = null;

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTicTacToe();
    initializeMemoryGame();
    initializeQuiz();
});

// Show/hide game areas
function showGame(gameId) {
    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => {
        area.style.display = 'none';
    });
    
    // Show selected game
    document.getElementById(gameId).style.display = 'block';
}

// Tic Tac Toe Game
function initializeTicTacToe() {
    const board = document.getElementById('ticTacToeBoard');
    if (!board) return;
    
    board.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => cellClicked(i));
        board.appendChild(cell);
    }
}

function cellClicked(index) {
    if (gameBoard[index] !== '' || !gameActive) return;
    
    gameBoard[index] = currentPlayer;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) {
        cell.textContent = currentPlayer;
        cell.style.pointerEvents = 'none'; // Disable further clicks on this cell
    }
    
    if (checkWinner()) {
        const status = document.getElementById('gameStatus');
        if (status) {
            status.textContent = `Player ${currentPlayer} wins!`;
            status.style.color = 'var(--success)';
        }
        gameActive = false;
        highlightWinningCells();
        return;
    }
    
    if (gameBoard.every(cell => cell !== '')) {
        const status = document.getElementById('gameStatus');
        if (status) {
            status.textContent = "It's a draw!";
            status.style.color = 'var(--info)';
        }
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const status = document.getElementById('gameStatus');
    if (status) {
        status.textContent = `Player ${currentPlayer}'s turn`;
        status.style.color = 'var(--light)';
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function highlightWinningCells() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const winningPattern = winPatterns.find(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
    
    if (winningPattern) {
        winningPattern.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if (cell) {
                cell.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
                cell.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.7)';
            }
        });
    }
}

function resetTicTacToe() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
    });
    
    const status = document.getElementById('gameStatus');
    if (status) {
        status.textContent = "Your turn! You are X";
        status.style.color = 'var(--light)';
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    initializeTicTacToe();
    initializeMemoryGame();
    initializeQuiz();
    
    // Hide all game areas initially
    document.querySelectorAll('.game-area').forEach(area => {
        area.style.display = 'none';
    });
});

// Memory Game
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

// Quiz Game
function initializeQuiz() {
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        document.getElementById('quizQuestion').textContent = "Quiz completed!";
        document.getElementById('quizOptions').innerHTML = '';
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    document.getElementById('quizQuestion').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    selectedOption = null;
    updateQuizScore();
}

function selectOption(index) {
    // Remove selected class from all options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    document.querySelector(`.quiz-option[data-index="${index}"]`).classList.add('selected');
    selectedOption = index;
}

function submitAnswer() {
    if (selectedOption === null) {
        alert("Please select an answer!");
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    if (selectedOption === question.correct) {
        quizScore++;
    }
    
    currentQuestion++;
    displayQuestion();
}

function resetQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    displayQuestion();
}

function updateQuizScore() {
    document.getElementById('quizScore').textContent = `Score: ${quizScore}/${currentQuestion}`;
}