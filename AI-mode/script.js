// Selectors
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const aiDifficultySlider = document.getElementById('ai-difficulty');

// Audios
const winSound = new Audio('sounds/win-sound.mp3');
const loseSound = new Audio('sounds/lose-sound.mp3');
const placeMarkSound = new Audio('sounds/place-mark-sound.mp3');
const restartSound = new Audio('sounds/restart-sound.mp3');

// Constants
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let currentPlayer = 'x';
let isGameOver = false;
let aiDifficulty = 1; // Default to Medium Difficulty

// Update AI difficulty based on slider input
aiDifficultySlider.addEventListener('input', (e) => {
    aiDifficulty = parseInt(e.target.value);
});

// Handle cell click
function handleClick(event) {
    if (isGameOver) return;

    const cell = event.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    placeMark(cell, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (currentPlayer === 'o') {
            setTimeout(() => aiMove(), 500);
        }
    }
}

// Function to disable player input
function disablePlayerInput() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.classList.add('disabled'); // Add visual indicator
    });
}

// Function to enable player input
function enablePlayerInput() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true }); // Add click event back
        cell.classList.remove('disabled'); // Remove visual indicator
    });
}

// Handle cell click
function handleClick(event) {
    if (isGameOver || currentPlayer === 'o') return; // Prevent clicks if game is over or it's AI's turn

    const cell = event.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    placeMark(cell, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        disablePlayerInput(); // Disable input while AI is making a move
        setTimeout(() => {
            aiMove();
            enablePlayerInput(); // Re-enable input after AI moves
        }, 1000); // Adjust delay as needed
    }
}
// AI move function
function aiMove() {
    if (aiDifficulty === 1) { // Easy mode
        const blockingMove = findBlockingMove();
        if (blockingMove) {
            placeMark(blockingMove, 'o');
        } else {
            const randomMove = getRandomMove();
            if (randomMove) {
                placeMark(randomMove, 'o');
            }
        }
    } else if (aiDifficulty === 2) { // Hard mode
        const bestMove = getBestMove();
        if (bestMove) {
            placeMark(bestMove, 'o');
        }
    }

    if (checkWin('o')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}


// Function to find a winning move for the specified player
function findWinningMove(player) {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const combination = WINNING_COMBINATIONS[i];
        let winCell = null;
        let playerCount = 0;
        let emptyCount = 0;

        combination.forEach(index => {
            const cell = cells[index];
            if (cell.classList.contains(player)) {
                playerCount++;
            } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                winCell = cell;
                emptyCount++;
            }
        });

        if (playerCount === 2 && emptyCount === 1) {
            return winCell;  // Return the cell that will win/block
        }
    }
    return null;
}


// Existing code for other functions like getBestMove, minimax, getRandomMove, etc.



// Getbsmve using Minimax algorithm
function getBestMove() {
    const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < availableCells.length; i++) {
        const cell = availableCells[i];
        cell.classList.add('o');
        const score = minimax(cells, 0, false);
        cell.classList.remove('o');

        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }

    return bestMove;
}

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    const scores = { 'x': -10, 'o': 10, 'draw': 0 };

    if (checkWin('o')) return scores['o'];
    if (checkWin('x')) return scores['x'];
    if (isDraw()) return scores['draw'];

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        const cell = board[i];
        if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
            cell.classList.add(isMaximizing ? 'o' : 'x');
            const score = minimax(board, depth + 1, !isMaximizing);
            cell.classList.remove(isMaximizing ? 'o' : 'x');

            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }

    return bestScore;
}

// Get random move for medium difficulty
function getRandomMove() {
    const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
}

// Place mark on the cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.setAttribute('data-symbol', currentClass.toUpperCase());
    setTimeout(() => {
        cell.classList.add('show');
		placeMarkSound.play();

    }, 100);
}

// Swap turns
function swapTurns() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

// Check win condition
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

// Check for a draw
function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

// End game
function endGame(draw) {
    isGameOver = true;
    if (draw) {
        showMessage('It\'s a Draw!');
        loseSound.play(); // Play lose sound on draw
    } else {
        if (currentPlayer === 'x') {
            showMessage('You Win!');
            winSound.play(); // Play win sound when the player wins
        } else {
            showMessage('AI Wins!');
            loseSound.play(); // Play lose sound when the AI wins
        }
    }

    setTimeout(() => {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleClick);
        });
    }, 1000);
}


// Show message to the user
function showMessage(message) {
    messageElement.textContent = message;
    messageElement.classList.add('visible');

    setTimeout(() => {
        messageElement.classList.remove('visible');
    }, 2000);
}

// Restart the game
function restartGame() {
	
	restartSound.play();
	
    cells.forEach(cell => {
        cell.classList.add('fade-out');
    });

    setTimeout(() => {
        cells.forEach(cell => {
            cell.classList.remove('fade-out');
            cell.classList.remove('x', 'o', 'show');
            cell.setAttribute('data-symbol', '');
            cell.style.fontSize = '0';
        });

        isGameOver = false;
        currentPlayer = 'x';
        messageElement.textContent = '';

        cells.forEach(cell => {
            cell.addEventListener('click', handleClick);
        });
    }, 500);
	
}

const cursor = document.querySelector('.cursor');

// Event listeners
restartButton.addEventListener('click', restartGame);
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});


let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Cursor Animation Function
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1; // Smooth follow
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor); // Continue the animation loop
}

// Change color on click
document.addEventListener('mousedown', () => {
    cursor.style.backgroundColor = '#ff6600'; // Briefly change color on click
    setTimeout(() => {
        cursor.style.backgroundColor = '#00ffcc'; // Revert to default color after 300ms
    }, 300);
});



function detectDevice() {
            const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
                             ('ontouchstart' in window) ||
                             window.innerWidth <= 800;

            if (isMobile) {
                document.body.classList.add('mobile');
                removeCursor();
                
            } else {
                document.body.classList.add('pc');
                
            }
        }

function removeCursor() {
    var cursor = document.querySelector('.cursor');
    var cursor_click = document.querySelector('.click-effect')
    
    cursor.remove();
    cursor_click.remove();
}
// Function to find a move that blocks the player from winning
function findBlockingMove() {
    return findWinningMove('x'); // Block player's winning move
}
const slider = document.getElementById('ai-difficulty');
const difficultyText = document.getElementById('difficulty-text');

slider.addEventListener('input', () => {
    difficultyText.textContent = slider.value === '1' ? 'Easy' : 'Hard';
});
