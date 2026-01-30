// Timer functionality with flip animations
class Timer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;
        this.currentTheme = 'classic';
        this.timerStyle = 'flip'; // 'flip' or 'plane'
        
        this.initializeElements();
        this.initializeEventListeners();
        this.setTimer(25, 0); // Default 25 minutes
    }

    initializeElements() {
        // Timer elements
        this.minutesTens = document.getElementById('minutesTens');
        this.minutesOnes = document.getElementById('minutesOnes');
        this.secondsTens = document.getElementById('secondsTens');
        this.secondsOnes = document.getElementById('secondsOnes');
        
        // Plain timer
        this.plainTime = document.getElementById('plainTime');
        this.flipTimer = document.getElementById('flipTimer');
        this.plainTimer = document.getElementById('plainTimer');
        
        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Timer container
        this.timerContainer = document.getElementById('timerContainer');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    initializeEventListeners() {
        // Control buttons
        this.startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            this.start();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            console.log('Pause button clicked');
            this.pause();
        });
        
        this.resetBtn.addEventListener('click', () => {
            console.log('Reset button clicked');
            this.reset();
        });
        
        // Timer style options - COMPACT
        document.querySelectorAll('.style-option-compact').forEach(option => {
            option.addEventListener('click', () => {
                const style = option.dataset.style;
                console.log('Style changed to:', style);
                this.changeTimerStyle(style);
            });
        });
        
        // Theme selector - COMPACT
        document.querySelectorAll('.theme-option-compact').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                console.log('Theme changed to:', theme);
                this.changeTheme(theme);
            });
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                console.log('Preset clicked:', minutes, 'minutes');
                this.setTimer(minutes, 0);
                this.showToast(`✅ Timer set to ${minutes} minutes`, 'info');
            });
        });
        
        // Custom timer
        const setCustomBtn = document.getElementById('setCustomBtn');
        const customMinutes = document.getElementById('customMinutes');
        const customSeconds = document.getElementById('customSeconds');
        
        if (setCustomBtn) {
            setCustomBtn.addEventListener('click', () => {
                const minutes = parseInt(customMinutes.value) || 0;
                const seconds = parseInt(customSeconds.value) || 0;
                
                if (minutes === 0 && seconds === 0) {
                    this.showToast('⚠️ Please enter a valid time', 'error');
                    return;
                }
                
                if (seconds > 59) {
                    this.showToast('⚠️ Seconds must be between 0-59', 'error');
                    return;
                }
                
                this.setTimer(minutes, seconds);
                this.showToast('✅ Custom timer set successfully!', 'success');
            });
        }
    }

    changeTimerStyle(style) {
        this.timerStyle = style;
        
        // Update active option - COMPACT
        document.querySelectorAll('.style-option-compact').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.style === style) {
                option.classList.add('active');
            }
        });
        
        // Toggle display
        if (style === 'flip') {
            this.flipTimer.style.display = 'flex';
            this.plainTimer.style.display = 'none';
        } else {
            this.flipTimer.style.display = 'none';
            this.plainTimer.style.display = 'flex';
        }
        
        this.updateDisplay();
        this.showToast(`✨ Timer style changed to ${style === 'flip' ? 'Flip' : 'Plain'}`, 'info');
    }

    setTimer(minutes, seconds) {
        if (this.isRunning) {
            this.stop();
        }
        
        this.totalSeconds = minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
    }

    start() {
        if (this.remainingSeconds === 0) {
            this.showToast('⚠️ Please set a timer first', 'error');
            return;
        }
        
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
        
        this.showToast('▶️ Timer started!', 'success');
    }

    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.isPaused = true;
        
        clearInterval(this.interval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.showToast('⏸️ Timer paused', 'info');
    }

    reset() {
        this.stop();
        this.setTimer(25, 0); // Reset to default
        this.showToast('🔄 Timer reset to 25 minutes', 'info');
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.interval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    tick() {
        if (this.remainingSeconds > 0) {
            this.remainingSeconds--;
            this.updateDisplay();
        } else {
            this.complete();
        }
    }

    complete() {
        this.stop();
        this.playSound();
        this.showToast('🎉 Timer completed! Great work!', 'success');
        
        // Celebration animation
        this.celebrate();
        
        // Reset to same time for convenience
        setTimeout(() => {
            this.remainingSeconds = this.totalSeconds;
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        
        if (this.timerStyle === 'flip') {
            // Update flip cards
            const minutesTens = Math.floor(minutes / 10);
            const minutesOnes = minutes % 10;
            const secondsTens = Math.floor(seconds / 10);
            const secondsOnes = seconds % 10;
            
            this.updateDigit(this.minutesTens, minutesTens);
            this.updateDigit(this.minutesOnes, minutesOnes);
            this.updateDigit(this.secondsTens, secondsTens);
            this.updateDigit(this.secondsOnes, secondsOnes);
        } else {
            // Update plain timer
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            this.plainTime.textContent = formattedTime;
        }
    }

    updateDigit(element, newValue) {
        if (!element) return;
        
        const front = element.querySelector('.flip-card-front span');
        const back = element.querySelector('.flip-card-back span');
        
        if (!front || !back) return;
        
        const currentValue = parseInt(front.textContent);
        
        if (currentValue !== newValue) {
            // Add flipping animation
            element.classList.add('flipping');
            
            // Update back face
            back.textContent = newValue;
            
            // After animation, update front face and remove animation class
            setTimeout(() => {
                front.textContent = newValue;
                element.classList.remove('flipping');
            }, 300);
        }
    }

    changeTheme(theme) {
        // Remove all theme classes
        this.timerContainer.classList.remove('classic', 'ocean', 'sunset', 'forest', 'neon');
        
        // Add new theme class
        this.timerContainer.classList.add(theme);
        this.currentTheme = theme;
        
        // Update active theme option - COMPACT
        document.querySelectorAll('.theme-option-compact').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            }
        });
        
        const themeNames = {
            classic: 'Classic',
            ocean: 'Ocean',
            sunset: 'Sunset',
            forest: 'Forest',
            neon: 'Neon'
        };
        
        this.showToast(`🎨 Theme changed to ${themeNames[theme]}`, 'success');
    }

    playSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    celebrate() {
        // Add celebration animation to timer container
        this.timerContainer.style.animation = 'celebrate 0.6s ease-in-out';
        
        setTimeout(() => {
            this.timerContainer.style.animation = '';
        }, 600);
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Profile popup functionality
function initializeProfilePopup() {
    const userProfile = document.getElementById('userProfile');
    const profilePopup = document.getElementById('profilePopup');
    
    if (!userProfile || !profilePopup) {
        console.log('Profile elements not found');
        return;
    }
    
    console.log('Profile popup initialized');
    
    // Toggle profile popup
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Profile clicked');
        profilePopup.classList.toggle('active');
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!userProfile.contains(e.target) && !profilePopup.contains(e.target)) {
            profilePopup.classList.remove('active');
        }
    });
    
    // Prevent popup from closing when clicking inside it
    profilePopup.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Add celebration animation
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0%, 100% { 
            transform: scale(1) rotate(0deg); 
        }
        25% { 
            transform: scale(1.05) rotate(2deg); 
        }
        50% {
            transform: scale(1.05) rotate(-2deg);
        }
        75% { 
            transform: scale(1.05) rotate(2deg); 
        }
    }
`;
document.head.appendChild(style);

// Initialize timer and profile popup when page loads
let timer;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize timer
    timer = new Timer();
    console.log('Timer initialized');
    
    // Initialize profile popup
    initializeProfilePopup();
    
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        console.log('All systems ready');
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only if not typing in an input
    if (e.target.matches('input, textarea')) return;
    
    if (e.code === 'Space') {
        e.preventDefault();
        if (timer && timer.isRunning) {
            timer.pause();
        } else if (timer) {
            timer.start();
        }
    } else if (e.code === 'Escape' || e.key === 'r' || e.key === 'R') {
        if (timer) {
            timer.reset();
        }
    }
});

// Prevent page from closing when timer is running
window.addEventListener('beforeunload', (e) => {
    if (timer && timer.isRunning) {
        e.preventDefault();
        e.returnValue = 'Timer is still running. Are you sure you want to leave?';
        return e.returnValue;
    }
});

console.log('Timer script loaded successfully');