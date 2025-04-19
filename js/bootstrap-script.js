document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingoCard');
    const newCardButton = document.getElementById('newCard');
    const resetMarksButton = document.getElementById('resetMarks');
    const newCardAfterWinButton = document.getElementById('newCardAfterWin');
    const copyResultsButton = document.getElementById('copyResults');
    
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
                celebrateWin('row', row);
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
                celebrateWin('column', col);
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
            celebrateWin('diagonal', 1);
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
            celebrateWin('diagonal', 2);
        }
    }

    // Function to celebrate a win
    function celebrateWin(winType, winIndex) {
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
            
            // Canadian colors for confetti (red and white)
            const colors = ['#D91D25', '#FFFFFF', '#000000'];
            
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
        
        // Generate the Wordle-style grid and list of events
        generateBingoResults(winType, winIndex);
        
        // Show Bootstrap modal
        winnerModal.show();
    }

    // Function to generate Wordle-style grid and list of events
    function generateBingoResults(winType, winIndex) {
        const cells = Array.from(document.querySelectorAll('.bingo-cell'));
        const resultsGrid = document.getElementById('resultsGrid');
        const eventsList = document.getElementById('eventsList');
        const resultContent = document.getElementById('resultContent');
        
        // Clear previous content
        resultsGrid.innerHTML = '';
        eventsList.innerHTML = '';
        
        // Track which cells are part of the winning line
        const winningCells = new Set();
        const freeIndex = 12; // Center free space
        
        // Determine winning cells based on win type
        if (winType === 'row') {
            for (let col = 0; col < 5; col++) {
                winningCells.add(winIndex * 5 + col);
            }
        } else if (winType === 'column') {
            for (let row = 0; row < 5; row++) {
                winningCells.add(row * 5 + winIndex);
            }
        } else if (winType === 'diagonal') {
            if (winIndex === 1) {
                // Top-left to bottom-right
                for (let i = 0; i < 5; i++) {
                    winningCells.add(i * 5 + i);
                }
            } else {
                // Top-right to bottom-left
                for (let i = 0; i < 5; i++) {
                    winningCells.add(i * 5 + (4 - i));
                }
            }
        }
        
        // Create the emoji grid
        let emojiGrid = '';
        let markedEvents = [];
        
        for (let row = 0; row < 5; row++) {
            let emojiRow = '';
            for (let col = 0; col < 5; col++) {
                const index = row * 5 + col;
                const cell = cells[index];
                
                // Check if this cell is marked (either explicitly or is the free space)
                const isMarked = index === freeIndex || cell.classList.contains('marked');
                
                // Add the appropriate emoji
                emojiRow += isMarked ? '🟥' : '⬜️';
                
                // Add to the list of marked events if this is part of the winning line
                if (winningCells.has(index) && isMarked) {
                    if (index === freeIndex) {
                        markedEvents.push("FREE (Center Space)");
                    } else {
                        markedEvents.push(cell.textContent);
                    }
                }
            }
            emojiGrid += emojiRow + '<br>';
        }
        
        // Determine win type display text
        let winTypeText = '';
        if (winType === 'row') {
            winTypeText = `Row ${winIndex + 1}`;
        } else if (winType === 'column') {
            winTypeText = `Column ${winIndex + 1}`;
        } else if (winType === 'diagonal') {
            winTypeText = winIndex === 1 ? 'Diagonal (Top-left to Bottom-right)' : 'Diagonal (Top-right to Bottom-left)';
        }
        
        // Update the results display
        resultsGrid.innerHTML = emojiGrid;
        
        // Add the list of events
        const eventHeader = document.createElement('h5');
        eventHeader.textContent = 'Events You Marked:';
        eventHeader.classList.add('mt-3', 'mb-2');
        eventsList.appendChild(eventHeader);
        
        const eventUl = document.createElement('ul');
        eventUl.classList.add('list-group');
        
        markedEvents.forEach(event => {
            const eventLi = document.createElement('li');
            eventLi.classList.add('list-group-item');
            eventLi.textContent = event;
            eventUl.appendChild(eventLi);
        });
        
        eventsList.appendChild(eventUl);
        
        // Set the content for copying
        const pageUrl = window.location.href;
        const timestamp = new Date().toLocaleString();
        resultContent.value = `Canadian Election Night Bingo - ${timestamp}\n\n${winTypeText} BINGO!\n\n${emojiGrid.replace(/<br>/g, '\n')}\n\nEvents Marked:\n${markedEvents.map(event => `• ${event}`).join('\n')}\n\nPlay your own election bingo: ${pageUrl}`;
    }

    // Function to copy results to clipboard
    function copyResultsToClipboard() {
        const resultContent = document.getElementById('resultContent');
        resultContent.select();
        document.execCommand('copy');
        
        // Show copied confirmation
        const copyButton = document.getElementById('copyResults');
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="bi bi-check-lg me-2"></i>Copied!';
        copyButton.classList.remove('btn-primary');
        copyButton.classList.add('btn-success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.classList.remove('btn-success');
            copyButton.classList.add('btn-primary');
        }, 2000);
    }

    // Event listeners
    newCardButton.addEventListener('click', generateBingoCard);
    resetMarksButton.addEventListener('click', resetMarks);
    newCardAfterWinButton.addEventListener('click', () => {
        winnerModal.hide();
        generateBingoCard();
    });
    copyResultsButton.addEventListener('click', copyResultsToClipboard);
    
    // When modal is hidden, clear confetti
    winnerModalEl.addEventListener('hidden.bs.modal', () => {
        confetti.reset();
    });

    // Generate initial card
    generateBingoCard();
});