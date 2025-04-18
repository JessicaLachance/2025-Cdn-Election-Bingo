document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingoCard');
    const newCardButton = document.getElementById('newCard');
    const resetMarksButton = document.getElementById('resetMarks');
    const winnerModal = document.getElementById('winnerModal');
    const closeModalButton = document.getElementById('closeModal');
    
    // Ballot SVG for the free space
    const ballotSvg = `
    <svg class="ballot-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18,2 L6,2 C4.9,2 4,2.9 4,4 L4,20 C4,21.1 4.9,22 6,22 L18,22 C19.1,22 20,21.1 20,20 L20,4 C20,2.9 19.1,2 18,2 Z M6,4 L18,4 L18,8 L6,8 L6,4 Z M6,10 L18,10 L18,11 L6,11 L6,10 Z M6,13 L18,13 L18,14 L6,14 L6,13 Z M6,16 L13,16 L13,17 L6,17 L6,16 Z" fill="currentColor"/>
    </svg>
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
        // Start confetti
        const confettiSettings = { 
            target: 'confetti-canvas',
            max: 200,
            size: 1.5,
            animate: true,
            props: ['circle', 'square', 'triangle', 'line'],
            colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
            clock: 25
        };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        
        // Show modal
        winnerModal.style.display = 'flex';
        
        // Set timeout to stop confetti after 5 seconds
        setTimeout(() => {
            confetti.clear();
        }, 5000);
    }

    // Event listeners
    newCardButton.addEventListener('click', generateBingoCard);
    resetMarksButton.addEventListener('click', resetMarks);
    closeModalButton.addEventListener('click', () => {
        winnerModal.style.display = 'none';
    });

    // Generate initial card
    generateBingoCard();
});