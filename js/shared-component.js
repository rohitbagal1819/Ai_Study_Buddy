// shared-components.js - Include this file in all HTML pages

// Initialize sidebar and dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeDarkMode();
    initializeNavigation();
});

// Create and inject sidebar HTML
function initializeSidebar() {
    const sidebarHTML = `
        <div class="logo">
            <div class="logo-icon">📚</div>
            <div class="logo-text">StudyBuddy</div>
        </div>
        
        <a href="./dashboard.html" class="nav-item" data-page="dashboard">
            <span class="nav-icon">📊</span>
            <span class="nav-text">Dashboard</span>
        </a>
        <a href="./notes.html" class="nav-item" data-page="notes">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Notes</span>
        </a>
        <a href="./upload.html" class="nav-item" data-page="upload">
            <span class="nav-icon">📤</span>
            <span class="nav-text">File Upload</span>
        </a>
        <a href="./quizze.html" class="nav-item" data-page="quizze">
            <span class="nav-icon">❓</span>
            <span class="nav-text">Quizzes</span>
        </a>
        <a href="./flashcard.html" class="nav-item" data-page="flashcard">
            <span class="nav-icon">🧠</span>
            <span class="nav-text">Flashcards</span>
        </a>
        <a href="./timer.html" class="nav-item" data-page="flashcard">
            <span class="nav-icon">⏱️</span>
            <span class="nav-text">Timer</span>
        </a>
        
        <div class="nav-divider"></div>
        
        <a href="#" class="nav-item" data-page="help">
            <span class="nav-icon">?</span>
            <span class="nav-text">Help</span>
        </a>
        <a href="#" class="nav-item" id="darkModeBtn">
            <span class="nav-icon">🌙</span>
            <span class="nav-text" id="darkModeText">Light Mode</span>
        </a>
        <a href="#" class="nav-item" data-page="settings">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Settings</span>
        </a>
        
        <div class="nav-divider"></div>
        
        <a href="./login.html" class="nav-item logout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Logout</span>
        </a>
    `;
    
    // Find existing sidebar or create one
    let sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        const container = document.querySelector('.container');
        if (container) {
            sidebar = document.createElement('aside');
            sidebar.className = 'sidebar';
            sidebar.id = 'sidebar';
            container.insertBefore(sidebar, container.firstChild);
        } else {
            document.body.insertAdjacentHTML('afterbegin', `<aside class="sidebar" id="sidebar"></aside>`);
            sidebar = document.getElementById('sidebar');
        }
    }
    
    // Populate sidebar content if empty
    if (sidebar && sidebar.children.length === 0) {
        sidebar.innerHTML = sidebarHTML;
    }
    
    // Create overlay if it doesn't exist
    if (!document.getElementById('overlay')) {
        document.body.insertAdjacentHTML('beforeend', '<div class="overlay" id="overlay"></div>');
    }
    
    // Add menu toggle button to header if it doesn't exist
    const header = document.querySelector('.header');
    if (header && !document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.id = 'menuToggle';
        menuToggle.innerHTML = '☰';
        
        const headerLeft = header.querySelector('.header-left') || header.querySelector('.header-title');
        if (headerLeft && headerLeft.parentElement) {
            headerLeft.parentElement.insertBefore(menuToggle, headerLeft);
        }
    }
    
    // Setup sidebar toggle
    setupSidebarToggle();
}

// Setup sidebar toggle functionality
function setupSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mainContent = document.querySelector('.main-content');
    
    if (!menuToggle || !sidebar || !overlay) return;
    
    // Toggle sidebar
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('collapsed');
        overlay.classList.toggle('active');
        
        if (mainContent) {
            mainContent.classList.toggle('expanded');
        }
    });
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
        overlay.classList.remove('active');
        if (mainContent) {
            mainContent.classList.remove('expanded');
        }
    });
    
    // Close sidebar on mobile when clicking nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('collapsed');
                overlay.classList.remove('active');
            }
        });
    });
}

// Initialize navigation active state
function initializeNavigation() {
    const currentPage = getCurrentPage();
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === currentPage) {
            item.classList.add('active');
        }
    });
}

// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'dashboard';
}

// Initialize dark mode
function initializeDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const darkModeText = document.getElementById('darkModeText');
    
    if (!darkModeBtn || !darkModeText) return;
    
    // Check saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeText.textContent = 'Light Mode';
        darkModeBtn.querySelector('.nav-icon').textContent = '🌙';
    }
    
    // Toggle dark mode
    darkModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        darkModeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        darkModeBtn.querySelector('.nav-icon').textContent = isDark ? '🌙' : '☀️';
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
    });
}

// Profile popup functionality
function initializeProfilePopup() {
    const userProfile = document.getElementById('userProfile');
    const profilePopup = document.getElementById('profilePopup');
    
    if (!userProfile || !profilePopup) return;
    
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopup.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        profilePopup.classList.remove('active');
    });
}

// Call profile popup initialization after DOM loads
document.addEventListener('DOMContentLoaded', initializeProfilePopup);