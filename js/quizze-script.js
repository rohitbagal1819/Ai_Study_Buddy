let currentQuestionIndex = 1;
let totalQuestionsCount = 5;
let answeredQuestions = 0;
let flaggedQuestions = 0;
let timerSeconds = 1794; // 29:54

// Profile Popup
const userProfile = document.getElementById('userProfile');
const profilePopup = document.getElementById('profilePopup');
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    profilePopup.classList.toggle('active');
});
document.addEventListener('click', () => profilePopup.classList.remove('active'));

// Start Quiz
function startQuiz(quizId) {
    document.getElementById('quizListPage').classList.add('hidden');
    document.getElementById('quizAttemptPage').classList.add('active');
    startTimer();
}

// Exit Quiz
function exitQuiz() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        document.getElementById('quizListPage').classList.remove('hidden');
        document.getElementById('quizAttemptPage').classList.remove('active');
        stopTimer();
    }
}

// Timer
let timerInterval;
function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds--;
        const mins = Math.floor(timerSeconds / 60);
        const secs = timerSeconds % 60;
        document.getElementById('timerDisplay').textContent = 
            `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (timerSeconds <= 0) {
            stopTimer();
            alert('Time is up!');
            exitQuiz();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Select Answer
function selectAnswer(element, option) {
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    
    const navBtn = document.querySelector(`.question-nav-btn:nth-child(${currentQuestionIndex})`);
    if (navBtn && !navBtn.classList.contains('answered')) {
        answeredQuestions++;
        navBtn.classList.add('answered');
        document.getElementById('answeredCount').textContent = answeredQuestions;
        updateProgress();
    }
}

// Toggle Flag
function toggleFlag() {
    const flagBtn = document.querySelector('.flag-btn');
    if (flagBtn.textContent === '🚩') {
        flagBtn.textContent = '🏳️';
        flaggedQuestions++;
    } else {
        flagBtn.textContent = '🚩';
        flaggedQuestions--;
    }
    document.getElementById('flaggedCount').textContent = flaggedQuestions;
}

// Go to Question
function goToQuestion(num) {
    currentQuestionIndex = num;
    document.getElementById('currentQuestion').textContent = num;
    
    document.querySelectorAll('.question-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.question-nav-btn')[num - 1].classList.add('active');
    
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Placeholder for loading new question content
    // In a real app, update questionText and answerOptions here
    
    updateProgress();
}

// Update Progress
function updateProgress() {
    const progress = (answeredQuestions / totalQuestionsCount) * 100;
    document.getElementById('progressFillQuiz').style.width = progress + '%';
}

// Chat button
document.querySelector('.chat-button').addEventListener('click', () => {
    alert('AI Assistant chat opening soon!');
});

// Notification
document.querySelector('.notification-icon').addEventListener('click', () => {
    alert('You have 2 new notifications!');
});
