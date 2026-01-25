// Flashcards data
        let decks = [];
        let currentDeck = null;
        let currentCardIndex = 0;
        let cardCount = 1;
        let selectedColor = 'blue';

        // Hardcoded predefined decks
        const predefinedDecks = [
            {
                id: 1,
                name: 'Basic Arithmetic',
                subject: 'Math',
                color: 'blue',
                progress: 50,
                mastered: 2,
                total: 4,
                due: 2,
                lastStudied: 'Today',
                cards: [
                    { front: '2 + 2', back: '4' },
                    { front: '5 - 3', back: '2' },
                    { front: '3 * 4', back: '12' },
                    { front: '10 / 2', back: '5' }
                ]
            },
            {
                id: 2,
                name: 'Biology Terms',
                subject: 'Science',
                color: 'green',
                progress: 33,
                mastered: 1,
                total: 3,
                due: 2,
                lastStudied: 'Yesterday',
                cards: [
                    { front: 'What is DNA?', back: 'Deoxyribonucleic acid' },
                    { front: 'What is a cell?', back: 'Basic unit of life' },
                    { front: 'What is photosynthesis?', back: 'Process by which plants make food' }
                ]
            },
            {
                id: 3,
                name: 'World History',
                subject: 'History',
                color: 'orange',
                progress: 25,
                mastered: 1,
                total: 4,
                due: 3,
                lastStudied: 'Last Week',
                cards: [
                    { front: 'When was World War I?', back: '1914-1918' },
                    { front: 'Who was the first US President?', back: 'George Washington' },
                    { front: 'What year did India gain independence?', back: '1947' },
                    { front: 'Who discovered America?', back: 'Christopher Columbus' }
                ]
            },
            {
                id: 4,
                name: 'Basic Spanish Vocabulary',
                subject: 'Languages',
                color: 'pink',
                progress: 75,
                mastered: 3,
                total: 4,
                due: 1,
                lastStudied: 'Today',
                cards: [
                    { front: 'Hello', back: 'Hola' },
                    { front: 'Thank you', back: 'Gracias' },
                    { front: 'Yes', back: 'Sí' },
                    { front: 'No', back: 'No' }
                ]
            }
        ];

        // Load decks on init
        function loadDecks() {
            decks = [...predefinedDecks];
        }

        // Render decks
        function renderDecks() {
            const grid = document.getElementById('decksGrid');
            grid.innerHTML = '';

            if (decks.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🃏</div>
                        <h3>No Decks Yet</h3>
                        <p>Create your first flashcard deck to get started!</p>
                        <button class="create-deck-btn" onclick="document.getElementById('createDeckBtn').click()">
                            <span>➕</span>Create Your First Deck
                        </button>
                    </div>
                `;
                return;
            }

            decks.forEach(deck => {
                const deckCard = document.createElement('div');
                deckCard.className = 'deck-card';
                deckCard.innerHTML = `
                    <div class="deck-header ${deck.color}"></div>
                    <div class="deck-body">
                        <div class="deck-subject">${deck.subject}</div>
                        <div class="deck-title">${deck.name}</div>
                        <div class="deck-progress">
                            <div class="progress-label">
                                <span>Progress</span>
                                <span>${deck.mastered}/${deck.total} mastered</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${deck.progress}%"></div>
                            </div>
                        </div>
                        <div class="deck-footer">
                            <div class="deck-meta">
                                <div>🕐 ${deck.due} due</div>
                                <div>Last: ${deck.lastStudied}</div>
                            </div>
                            <button class="study-btn" onclick="openDeck(${deck.id})">
                                <span>▶</span>Study Now
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(deckCard);
            });
        }

        // Update stats
        function updateStats() {
            document.getElementById('totalDecks').textContent = decks.length;
            document.getElementById('totalCards').textContent = decks.reduce((sum, d) => sum + d.total, 0);
            document.getElementById('cardsDue').textContent = decks.reduce((sum, d) => sum + d.due, 0);
            document.getElementById('mastered').textContent = decks.reduce((sum, d) => sum + d.mastered, 0);
        }

        // Open deck viewer
        function openDeck(deckId) {
            currentDeck = decks.find(d => d.id === deckId);
            if (!currentDeck || !currentDeck.cards || currentDeck.cards.length === 0) {
                alert('This deck has no cards yet!');
                return;
            }

            currentCardIndex = 0;
            document.getElementById('decksPage').style.display = 'none';
            document.getElementById('viewerPage').classList.add('active');
            
            loadCard();
            createDots();
        }

        // Load current card
        function loadCard() {
            if (!currentDeck || !currentDeck.cards || currentDeck.cards.length === 0) return;
            
            const card = currentDeck.cards[currentCardIndex];
            document.getElementById('viewerDeckName').textContent = currentDeck.name;
            document.getElementById('currentCardNum').textContent = currentCardIndex + 1;
            document.getElementById('totalCardsNum').textContent = currentDeck.cards.length;
            document.getElementById('cardFront').textContent = card.front;
            document.getElementById('cardBack').textContent = card.back;
            
            document.getElementById('flashcard').classList.remove('flipped');
            
            const progress = ((currentCardIndex + 1) / currentDeck.cards.length) * 100;
            document.getElementById('viewerProgressFill').style.width = `${progress}%`;
            
            updateDots();
            
            document.getElementById('prevBtn').disabled = currentCardIndex === 0;
            document.getElementById('nextBtn').disabled = currentCardIndex === currentDeck.cards.length - 1;
        }

        // Create navigation dots
        function createDots() {
            const dotsContainer = document.getElementById('navDots');
            dotsContainer.innerHTML = '';
            
            if (!currentDeck || !currentDeck.cards) return;
            
            currentDeck.cards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === currentCardIndex) dot.classList.add('active');
                dot.onclick = () => goToCard(index);
                dotsContainer.appendChild(dot);
            });
        }

        // Update dots
        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCardIndex);
            });
        }

        // Go to specific card
        function goToCard(index) {
            if (index >= 0 && currentDeck && currentDeck.cards && index < currentDeck.cards.length) {
                currentCardIndex = index;
                loadCard();
            }
        }

        // Previous card
        function previousCard() {
            if (currentCardIndex > 0) {
                goToCard(currentCardIndex - 1);
            }
        }

        // Next card
        function nextCard() {
            if (currentDeck && currentDeck.cards && currentCardIndex < currentDeck.cards.length - 1) {
                goToCard(currentCardIndex + 1);
            }
        }

        // Exit viewer
        function exitViewer() {
            document.getElementById('viewerPage').classList.remove('active');
            document.getElementById('decksPage').style.display = 'block';
        }

        // Setup event listeners
        function setupEventListeners() {
            // Sidebar toggle

            // Dark mode toggle

            // Profile popup

            // Flip card
            const flashcard = document.getElementById('flashcard');
            flashcard.addEventListener('click', () => {
                flashcard.classList.toggle('flipped');
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (document.getElementById('viewerPage').classList.contains('active')) {
                    if (e.key === 'ArrowRight') {
                        nextCard();
                    } else if (e.key === 'ArrowLeft') {
                        previousCard();
                    } else if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('flashcard').classList.toggle('flipped');
                    } else if (e.key === 'Escape') {
                        exitViewer();
                    }
                }
            });

            // Modal controls
            const createDeckBtn = document.getElementById('createDeckBtn');
            const modalOverlay = document.getElementById('modalOverlay');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const cancelBtn = document.getElementById('cancelBtn');

            createDeckBtn.addEventListener('click', () => {
                modalOverlay.classList.add('active');
            });

            closeModalBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });

            cancelBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });

            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
            });

            // Color picker
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedColor = this.dataset.color;
                });
            });

            // Add card
            document.getElementById('addCardBtn').addEventListener('click', () => {
                cardCount++;
                const container = document.getElementById('cardsContainer');
                const cardItem = document.createElement('div');
                cardItem.className = 'card-item';
                cardItem.innerHTML = `
                    <div class="card-item-header">
                        <span>Card ${cardCount}</span>
                        <button type="button" class="remove-card-btn" onclick="this.closest('.card-item').remove()">×</button>
                    </div>
                    <div class="card-inputs">
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: block;">Front</label>
                            <textarea class="form-input form-textarea" placeholder="Question or term..." required></textarea>
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: block;">Back</label>
                            <textarea class="form-input form-textarea" placeholder="Answer or definition..." required></textarea>
                        </div>
                    </div>
                `;
                container.appendChild(cardItem);
            });

            // Form submit
            document.getElementById('deckForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('deckName').value.trim();
                const subject = document.getElementById('deckSubject').value;
                
                const cardItems = document.querySelectorAll('.card-item');
                const cards = [];
                
                cardItems.forEach(item => {
                    const inputs = item.querySelectorAll('textarea');
                    const front = inputs[0].value.trim();
                    const back = inputs[1].value.trim();
                    
                    if (front && back) {
                        cards.push({ front, back });
                    }
                });
                
                if (cards.length === 0) {
                    alert('Please add at least one card!');
                    return;
                }
                
                const newDeck = {
                    id: Date.now(),
                    name,
                    subject,
                    color: selectedColor,
                    progress: 0,
                    mastered: 0,
                    total: cards.length,
                    due: cards.length,
                    lastStudied: 'Never',
                    cards
                };
                
                decks.unshift(newDeck);
                
                document.getElementById('deckForm').reset();
                document.getElementById('cardsContainer').innerHTML = `
                    <div class="card-item">
                        <div class="card-item-header">
                            <span>Card 1</span>
                        </div>
                        <div class="card-inputs">
                            <div>
                                <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: block;">Front</label>
                                <textarea class="form-input form-textarea" placeholder="Question or term..." required></textarea>
                            </div>
                            <div>
                                <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: block;">Back</label>
                                <textarea class="form-input form-textarea" placeholder="Answer or definition..." required></textarea>
                            </div>
                        </div>
                    </div>
                `;
                cardCount = 1;
                selectedColor = 'blue';
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                document.querySelector('.color-blue').classList.add('selected');
                
                modalOverlay.classList.remove('active');
                
                renderDecks();
                updateStats();
                
                alert(`Deck "${name}" created successfully with ${cards.length} cards!`);
            });

            // Search
            document.getElementById('deckSearch').addEventListener('input', function() {
                const query = this.value.toLowerCase();
                document.querySelectorAll('.deck-card').forEach(card => {
                    const title = card.querySelector('.deck-title')?.textContent.toLowerCase() || '';
                    const subject = card.querySelector('.deck-subject')?.textContent.toLowerCase() || '';
                    
                    card.style.display = (title.includes(query) || subject.includes(query)) ? 'block' : 'none';
                });
            });

            // Chat button
            document.querySelector('.chat-button').addEventListener('click', () => {
                alert('AI Assistant chat opening soon!');
            });
        }

        // Initialize
        loadDecks();
        renderDecks();
        updateStats();
        setupEventListeners();