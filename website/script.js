// Yapılandırma
const CONFIG = {
    password: 'sushi',
    dates: {
        relationship: '2024-01-01', // İlişki başlangıç tarihi
        meeting: '2024-01-01',      // İlk tanışma tarihi
        anniversary: '2024-06-15'    // Yıldönümü
    },
    dailyMessages: [
        "Seninle her gün daha güzel ❤️",
        "Sen benim en güzel şansımsın 🍀",
        "Gözlerinin içine baktığımda, dünyam aydınlanıyor ✨",
        "Seninle geçen her an çok değerli 💖",
        "Seni çok seviyorum aşkım 💝",
        "Sen benim en güzel hayalimsin 💫",
        "Seninle her şey daha güzel 💕",
        "Kalbimin tek sahibi sensin 💘",
        " POPONU ISIRIRIM 💗",
        "Sen benim mutluluk kaynağımsın 💓"
     
    ],
    memories: [
        {
            title: "İlk Buluşmamız",
            date: "26 Eylül 2024",
            image: "elos2.jpg",
            description: "Unutulmaz bir gün..."
        },
        // Diğer anılar buraya eklenecek
    ]
};

// Sayfa yönetimi
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'timer-page') updateCountdown();
    if (pageId === 'messages-page') loadMessages();
}

// Giriş kontrolü
function checkPassword() {
    const password = document.getElementById('password').value;
    if (password === CONFIG.password) {
        showPage('main-menu');
        initializeApp();
    } else {
        alert('Yanlış şifre aşkım, bir daha dene ❤️');
        document.getElementById('password').value = '';
    }
}

// Sayaç fonksiyonları
function updateCountdown() {
    const now = new Date().getTime();
    const start = new Date(CONFIG.dates.relationship).getTime();
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('relationship-days').textContent = padNumber(days);
    document.getElementById('relationship-hours').textContent = padNumber(hours);
    document.getElementById('relationship-minutes').textContent = padNumber(minutes);
    document.getElementById('relationship-seconds').textContent = padNumber(seconds);

    document.getElementById('first-meet-date').textContent = formatTurkishDate(CONFIG.dates.meeting);
    document.getElementById('first-date').textContent = formatTurkishDate(CONFIG.dates.relationship);
}

// Mesajlaşma sistemi
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '';

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-card';
        messageElement.innerHTML = `
            <p>${msg.content}</p>
            <small>${formatTurkishDate(msg.date)}</small>
        `;
        messageList.appendChild(messageElement);
    });

    // Günlük mesajı göster
    const randomMessage = CONFIG.dailyMessages[
        Math.floor(Math.random() * CONFIG.dailyMessages.length)
    ];
    document.getElementById('daily-message').innerHTML = `
        <h3>Günün Mesajı</h3>
        <p>${randomMessage}</p>
    `;
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (content) {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.unshift({
            content: content,
            date: new Date().toISOString()
        });
        localStorage.setItem('messages', JSON.stringify(messages));
        
        input.value = '';
        loadMessages();
    }
}

// Oyunlar
// Oyunlar için yapılandırma
const GAMES = {
    memory: {
        cards: [
            {emoji: "❤️", text: "Aşk"},
            {emoji: "💑", text: "Çift"},
            {emoji: "💘", text: "Kalp"},
            {emoji: "💝", text: "Hediye"},
            {emoji: "💖", text: "Sevgi"},
            {emoji: "💗", text: "Mutluluk"}
        ]
    },
    quiz: {
        questions: [
            {
                question: "İlk tanıştığımız tarih nedir?",
                options: ["1 Ocak 2024", "5 Ocak 2024", "10 Ocak 2024", "15 Ocak 2024"],
                correct: 0
            },
            {
                question: "En sevdiğim renk hangisi?",
                options: ["Mavi", "Kırmızı", "Mor", "Pembe"],
                correct: 3
            },
            {
                question: "Benim burç elementim nedir?",
                options: ["Ateş", "Toprak", "Hava", "Su"],
                correct: 0
            }
        ]
    },
    word: {
        words: ["SEVGI", "MUTLULUK", "ASK", "KALP", "SARILMAK"],
        hints: [
            "En güzel duygu",
            "Seninleyken hissettiğim",
            "Kalbimin tek sahibi",
            "Aşkın sembolü",
            "En çok istediğim şey"
        ]
    }
};

// Hafıza Oyunu
function startMemoryGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    
    const cards = GAMES.memory.cards;
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
    
    gameArea.innerHTML = `
        <div class="memory-game">
            ${gameCards.map((card, index) => `
                <div class="memory-card" data-index="${index}">
                    <div class="card-inner">
                        <div class="card-front">❓</div>
                        <div class="card-back">
                            <div>${card.emoji}</div>
                            <div>${card.text}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    let flippedCards = [];
    let matchedPairs = 0;

    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [card1, card2] = flippedCards;
                    const match = gameCards[card1.dataset.index].emoji === gameCards[card2.dataset.index].emoji;

                    setTimeout(() => {
                        if (!match) {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                        } else {
                            matchedPairs++;
                            if (matchedPairs === cards.length) {
                                alert('Tebrikler! Tüm eşleşmeleri buldun! ❤️');
                                startMemoryGame();
                            }
                        }
                        flippedCards = [];
                    }, 1000);
                }
            }
        });
    });
}

// Quiz Oyunu
// Quiz Oyunu
function startQuiz() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
        const question = GAMES.quiz.questions[currentQuestion];
        gameArea.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">
                    <div class="progress-bar" style="width: ${(currentQuestion / GAMES.quiz.questions.length) * 100}%"></div>
                </div>
                <h3>Soru ${currentQuestion + 1}/${GAMES.quiz.questions.length}</h3>
                <p class="quiz-question">${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button onclick="selectAnswer(${index})" class="quiz-option">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-score">
                    Doğru: <span class="correct-count">${score}</span> | 
                    Yanlış: <span class="wrong-count">${currentQuestion - score}</span>
                </div>
            </div>
        `;
    }

    window.selectAnswer = function(index) {
        const question = GAMES.quiz.questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        // Tüm butonları devre dışı bırak
        options.forEach(opt => opt.disabled = true);
        
        // Doğru ve yanlış cevapları göster
        options[question.correct].classList.add('correct');
        if (index !== question.correct) {
            options[index].classList.add('wrong');
        }

        // Skoru güncelle
        if (index === question.correct) {
            score++;
            showFeedback('Doğru! 🎉', 'success');
        } else {
            showFeedback('Yanlış! 😢', 'error');
        }

        // 1.5 saniye sonra diğer soruya geç
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < GAMES.quiz.questions.length) {
                showQuestion();
            } else {
                showQuizResult();
            }
        }, 1500);
    };

    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `quiz-feedback ${type}`;
        feedback.textContent = message;
        document.querySelector('.quiz-container').appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 1500);
    }

    function showQuizResult() {
        const percentage = Math.round((score / GAMES.quiz.questions.length) * 100);
        const message = getQuizMessage(percentage);
        const emoji = getQuizEmoji(percentage);

        gameArea.innerHTML = `
            <div class="quiz-result">
                <h2>Test Sonucun ${emoji}</h2>
                <div class="result-circle">
                    <div class="percentage">${percentage}%</div>
                    <div class="score-details">
                        ${score} doğru, ${GAMES.quiz.questions.length - score} yanlış
                    </div>
                </div>
                <p class="result-message">${message}</p>
                <div class="result-actions">
                    <button onclick="startQuiz()" class="glow-button">
                        Tekrar Dene
                    </button>
                </div>
            </div>
        `;
    }

    function getQuizMessage(percentage) {
        if (percentage === 100) return "Mükemmel! Beni çok iyi tanıyorsun! Sen gerçekten özelsin! ❤️";
        if (percentage >= 80) return "Harika! Neredeyse her şeyi biliyorsun! Seninle gurur duyuyorum! 💖";
        if (percentage >= 60) return "Güzel! Ama daha da iyi olabilir! Beni daha çok tanımaya ne dersin? 💕";
        if (percentage >= 40) return "Fena değil, biraz daha çaba göster! Birlikte daha çok vakit geçirmeliyiz! 💝";
        return "Daha çok öğrenmemiz gereken şeyler var! Haydi birlikte keşfedelim! 💓";
    }

    function getQuizEmoji(percentage) {
        if (percentage === 100) return "🏆";
        if (percentage >= 80) return "🌟";
        if (percentage >= 60) return "😊";
        if (percentage >= 40) return "🤔";
        return "💪";
    }

    showQuestion();
}

// Kelime Oyunu
function startWordGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    let currentWord = 0;
    let guessedLetters = new Set();

    function updateDisplay() {
        const word = GAMES.word.words[currentWord];
        gameArea.innerHTML = `
            <div class="word-game">
                <div class="word-hint">
                    İpucu: ${GAMES.word.hints[currentWord]}
                </div>
                <div class="word-display">
                    ${word.split('').map(letter => 
                        `<span class="letter">${guessedLetters.has(letter) ? letter : '_'}</span>`
                    ).join('')}
                </div>
                <div class="word-input">
                    <input type="text" maxlength="1" placeholder="Bir harf gir..."
                           onkeyup="guessLetter(event)">
                </div>
            </div>
        `;
    }

    window.guessLetter = function(event) {
        if (event.key === 'Enter') {
            const letter = event.target.value.toUpperCase();
            if (letter) {
                guessedLetters.add(letter);
                updateDisplay();
                event.target.value = '';
                
                const word = GAMES.word.words[currentWord];
                if ([...word].every(l => guessedLetters.has(l))) {
                    if (currentWord < GAMES.word.words.length - 1) {
                        currentWord++;
                        guessedLetters.clear();
                        setTimeout(updateDisplay, 500);
                    } else {
                        alert('Tebrikler! Tüm kelimeleri buldun! ❤️');
                        startWordGame();
                    }
                }
            }
        }
    };

    updateDisplay();
}

// Labirent Oyunu
function startMazeGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    
    const size = 10;
    const maze = generateMaze(size);
    let playerPos = {x: 0, y: 0};
    const target = {x: size-1, y: size-1};

    function generateMaze(size) {
        const maze = Array(size).fill().map(() => Array(size).fill(1));
        const stack = [{x: 0, y: 0}];
        maze[0][0] = 0;

        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = getUnvisitedNeighbors(current, maze);

            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                maze[next.y][next.x] = 0;
                stack.push(next);
            }
        }

        maze[size-1][size-1] = 0;
        return maze;
    }

    function getUnvisitedNeighbors(pos, maze) {
        const neighbors = [];
        const directions = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];

        for (const dir of directions) {
            const newX = pos.x + dir.x * 2;
            const newY = pos.y + dir.y * 2;
            
            if (newX >= 0 && newX < maze.length && 
                newY >= 0 && newY < maze.length && 
                maze[newY][newX] === 1) {
                maze[pos.y + dir.y][pos.x + dir.x] = 0;
                neighbors.push({x: newX, y: newY});
            }
        }

        return neighbors;
    }

    function renderMaze() {
        gameArea.innerHTML = `
            <div class="maze-game">
                <div class="maze-grid">
                    ${maze.map((row, y) => `
                        <div class="maze-row">
                            ${row.map((cell, x) => `
                                <div class="maze-cell ${
                                    cell === 1 ? 'wall' : ''
                                } ${
                                    x === playerPos.x && y === playerPos.y ? 'player' : ''
                                } ${
                                    x === target.x && y === target.y ? 'target' : ''
                                }">
                                    ${x === playerPos.x && y === playerPos.y ? '👤' : 
                                      x === target.x && y === target.y ? '❤️' : ''}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div class="maze-controls">
                    <button onclick="startMazeGame()" class="glow-button">Yeniden Başla</button>
                </div>
            </div>
        `;
    }

    window.addEventListener('keydown', (e) => {
        let newX = playerPos.x;
        let newY = playerPos.y;

        switch(e.key) {
            case 'ArrowUp': newY--; break;
            case 'ArrowDown': newY++; break;
            case 'ArrowLeft': newX--; break;
            case 'ArrowRight': newX++; break;
        }

        if (newX >= 0 && newX < size && newY >= 0 && newY < size && maze[newY][newX] === 0) {
            playerPos = {x: newX, y: newY};
            renderMaze();

            if (newX === target.x && newY === target.y) {
                setTimeout(() => {
                    alert('Tebrikler! Kalbe ulaştın! ❤️');
                    startMazeGame();
                }, 300);
            }
        }
    });

    renderMaze();
}

// Kalp animasyonları
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['❤️', '💖', '💗', '💓', '💝'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 2 + 4;
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        const size = Math.random() * 20 + 10;
        heart.style.fontSize = size + 'px';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000 + 2000);
    }
    
    setInterval(createHeart, 300);
}

// Yardımcı fonksiyonlar
function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function formatTurkishDate(dateString) {
    return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Uygulama başlatma
function initializeApp() {
    createFloatingHearts();
    setInterval(updateCountdown, 1000);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});
// Anılar için yapılandırma
const MEMORIES = {
    photos: [
        {
            id: 1,
            url: "elos2.jpg", // Fotoğraf yolunu değiştirin
            title: "İlk Buluşmamız",
            date: "1 Ocak 2024",
            description: "Hayatımın en güzel günlerinden biri..."
        },
        {
            id: 2,
            url: "elos3.jpg",
            title: "İlk Yemeğimiz",
            date: "5 Ocak 2024",
            description: "O gün yediğimiz yemek hala damağımda..."
        },
        // Diğer fotoğraflar buraya eklenecek
    ],
    specialDates: [
        {
            date: "2023-09-26",
            title: "İlk Tanışma",
            icon: "👋",
            description: "Hayatımın dönüm noktası..."
        },
        {
            date: "2023-10-09",
            title: "sevgili olduk",
            icon: "💌",
            description: "O ilk mesajı hala saklıyorum..."
        },
        // Diğer özel tarihler buraya eklenecek
    ]
};

// Anılar sayfasını göster
function showMemories() {
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    
    gameArea.innerHTML = `
        <div class="memories-page">
            <div class="memories-tabs">
                <button class="tab-button active" onclick="switchMemoriesTab('photos')">
                    <i class="fas fa-camera"></i> Fotoğraflarımız
                </button>
                <button class="tab-button" onclick="switchMemoriesTab('timeline')">
                    <i class="fas fa-clock"></i> Zaman Tüneli
                </button>
            </div>
            
            <div id="photos-tab" class="memory-tab-content active">
                <div class="photo-gallery">
                    ${MEMORIES.photos.map(photo => `
                        <div class="memory-card" onclick="showPhotoDetail(${photo.id})">
                            <div class="memory-card-inner">
                                <img src="${photo.url}" alt="${photo.title}">
                                <div class="memory-card-overlay">
                                    <h3>${photo.title}</h3>
                                    <p>${photo.date}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="timeline-tab" class="memory-tab-content">
                <div class="timeline">
                    ${MEMORIES.specialDates.map(date => `
                        <div class="timeline-item">
                            <div class="timeline-icon">${date.icon}</div>
                            <div class="timeline-content">
                                <h3>${date.title}</h3>
                                <p class="timeline-date">${formatTurkishDate(date.date)}</p>
                                <p>${date.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Fotoğraf detayını göster
function showPhotoDetail(photoId) {
    const photo = MEMORIES.photos.find(p => p.id === photoId);
    
    const modal = document.createElement('div');
    modal.className = 'memory-modal';
    modal.innerHTML = `
        <div class="memory-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${photo.url}" alt="${photo.title}">
            <div class="memory-modal-info">
                <h2>${photo.title}</h2>
                <p class="memory-date">${photo.date}</p>
                <p class="memory-description">${photo.description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Sekme değiştirme
function switchMemoriesTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.memory-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}