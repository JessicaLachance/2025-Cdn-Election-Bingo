document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingoCard');
    const newCardButton = document.getElementById('newCard');
    const resetMarksButton = document.getElementById('resetMarks');
    const newCardAfterWinButton = document.getElementById('newCardAfterWin');
    
    // Create Bootstrap Modal instance
    const winnerModalEl = document.getElementById('winnerModal');
    const winnerModal = new bootstrap.Modal(winnerModalEl);
    
    // Ballot icon using Bootstrap Icons for the free space
    const ballotSvg = `
    <i class="bi bi-card-checklist ballot-icon"></i>
    <div class="free-text">FREE</div>
    `;

    // Function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Function to generate a new bingo card
    function generateBingoCard() {
        bingoCard.innerHTML = '';
        
        // Get 24 random events (we'll add the free space separately)
        const shuffledEvents = shuffleArray(bingoEvents).slice(0, 24);
        
        // Create a 5x5 grid with a free space in the center (index 12)
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');
            
            // Add the free space in the center
            if (i === 12) {
                cell.classList.add('free');
                cell.innerHTML = ballotSvg;
            } else {
                // Calculate the correct index for our events array
                const eventIndex = i < 12 ? i : i - 1;
                cell.textContent = shuffledEvents[eventIndex];
                
                // Add click handler for marking cells
                cell.addEventListener('click', () => {
                    cell.classList.toggle('marked');
                    checkForWin();
                });
            }
            
            bingoCard.appendChild(cell);
        }
    }

    // Function to reset marks on the current card
    function resetMarks() {
        const cells = document.querySelectorAll('.bingo-cell:not(.free)');
        cells.forEach(cell => {
            cell.classList.remove('marked');
        });
    }

    // Function to check for a winning combination
    function checkForWin() {
        const cells = Array.from(document.querySelectorAll('.bingo-cell'));
        const freeIndex = 12; // Center of the 5x5 grid
        
        // Check rows
        for (let row = 0; row < 5; row++) {
            const startIndex = row * 5;
            let rowWin = true;
            
            for (let col = 0; col < 5; col++) {
                const index = startIndex + col;
                const cell = cells[index];
                
                if (index !== freeIndex && !cell.classList.contains('marked')) {
                    rowWin = false;
                    break;
                }
            }
            
            if (rowWin) {
                celebrateWin();
                return;
            }
        }
        
        // Check columns
        for (let col = 0; col < 5; col++) {
            let colWin = true;
            
            for (let row = 0; row < 5; row++) {
                const index = row * 5 + col;
                const cell = cells[index];
                
                if (index !== freeIndex && !cell.classList.contains('marked')) {
                    colWin = false;
                    break;
                }
            }
            
            if (colWin) {
                celebrateWin();
                return;
            }
        }
        
        // Check diagonals
        // Top-left to bottom-right
        let diag1Win = true;
        for (let i = 0; i < 5; i++) {
            const index = i * 5 + i;
            const cell = cells[index];
            
            if (index !== freeIndex && !cell.classList.contains('marked')) {
                diag1Win = false;
                break;
            }
        }
        
        if (diag1Win) {
            celebrateWin();
            return;
        }
        
        // Top-right to bottom-left
        let diag2Win = true;
        for (let i = 0; i < 5; i++) {
            const index = i * 5 + (4 - i);
            const cell = cells[index];
            
            if (index !== freeIndex && !cell.classList.contains('marked')) {
                diag2Win = false;
                break;
            }
        }
        
        if (diag2Win) {
            celebrateWin();
        }
    }

    // Function to celebrate a win
    function celebrateWin() {
        // Start confetti using canvas-confetti
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Canadian colors for confetti (red and white with accent colors)
            const colors = ['#D91D25', '#FFFFFF', '#000000', '#008A17'];
            
            // Confetti burst from both sides
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors
            }));
            
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors
            }));
        }, 250);
        
        // Show Bootstrap modal
        winnerModal.show();
    }

    // Event listeners
    newCardButton.addEventListener('click', generateBingoCard);
    resetMarksButton.addEventListener('click', resetMarks);
    newCardAfterWinButton.addEventListener('click', () => {
        winnerModal.hide();
        generateBingoCard();
    });
    
    // When modal is hidden, clear confetti
    winnerModalEl.addEventListener('hidden.bs.modal', () => {
        confetti.reset();
    });

    // Generate initial card
    generateBingoCard();
});