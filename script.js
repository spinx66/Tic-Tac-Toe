document.addEventListener('DOMContentLoaded', () => {
    const singlePlayerButton = document.getElementById('single-player');
    const twoPlayerButton = document.getElementById('two-player');

    singlePlayerButton.addEventListener('click', () => {
        // Redirect to the single-player game page
        window.location.href = 'AI-mode/index.html';
    });

    twoPlayerButton.addEventListener('click', () => {
        // Redirect to the two-player game page
        window.location.href = '2-player-mode/index.html';
    });
});

