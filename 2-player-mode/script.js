const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const cursor = document.querySelector('.cursor');

// Audios
const winSound = new Audio('sounds/win-sound.mp3');
const loseSound = new Audio('sounds/lose-sound.mp3');
const placeMarkSound = new Audio('sounds/place-mark-sound.mp3');
const restartSound = new Audio('sounds/restart-sound.mp3');

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

// Tic-Tac-Toe Game Logic
function handleClick(event) {
    if (isGameOver) return;

    const cell = event.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return; // Ignore already marked cells

    const currentClass = currentPlayer;

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.setAttribute('data-symbol', currentClass.toUpperCase()); // Add the symbol as a data attribute
	placeMarkSound.play();

    setTimeout(() => {
        cell.classList.add('show'); // Trigger the smooth appearance

    }, 100); // Delay to start the animation
}

function swapTurns() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw) {
    isGameOver = true;
    if (draw) {
        showMessage('It\'s a Draw!');
		loseSound.play();

    } else {
        showMessage(`${currentPlayer.toUpperCase()} Wins!`);
		winSound.play();
		
    }

    setTimeout(() => {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleClick);
        });
    }, 1000);
}
// Existing code

function showMessage(message) {
    messageElement.textContent = message;
    messageElement.classList.add('visible'); // Add class to trigger the transition

    setTimeout(() => {
        messageElement.classList.remove('visible'); // Remove class after a delay to hide the message
    }, 2000); // Message stays visible for 2 seconds before fading out
}

// Existing code


function restartGame() {
	// Play audio
	restartSound.play();
    // Apply fade-out effect to cells
    cells.forEach(cell => {
        cell.classList.add('fade-out'); // Add fade-out class to start fading
    });

    // Wait for the fade-out animation to complete before resetting
    setTimeout(() => {
        cells.forEach(cell => {
            cell.classList.remove('fade-out'); // Remove fade-out class to reset opacity
            cell.classList.remove('x', 'o', 'show');
            cell.setAttribute('data-symbol', ''); // Clear the symbol data attribute
            cell.style.fontSize = '0'; // Hide the symbol initially
        });

        // Restart game state
        isGameOver = false;
        currentPlayer = 'x';
        messageElement.textContent = '';

        cells.forEach(cell => {
            cell.addEventListener('click', handleClick);
        });
    }, 500); // Duration should match the CSS transition duration for fade-out
}


restartButton.addEventListener('click', restartGame);
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

function detectDevice() {
            const isMobile = window.innerWidth <= 800;

            if (isMobile) {
                document.body.classList.add('mobile');
                animateCursor();
                
                
            } else {
                document.body.classList.add('pc');
                
            }
        }

function removeCursor() {
    var cursor = document.querySelector('.cursor');
    var cursor_click = document.querySelector('.click-effect')
    
    if(cursor){
        cursor.remove();
    }
    
    if(cursor_click){
        cursor_click.remove();
    }
}