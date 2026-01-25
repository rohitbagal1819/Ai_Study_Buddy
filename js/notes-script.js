/* ==========================================
 * STUDYBUDDY - NOTES MODULE JAVASCRIPT
 * Production Ready Script
 * ========================================== */

// ==========================================
// STATE MANAGEMENT
// ==========================================

let quillEditor = null;
let selectedNoteColor = 'blue';
let currentNoteData = {
  id: null,
  title: '',
  category: '',
  content: '',
  color: 'blue',
  timestamp: new Date(),
  favorite: false
};

let notesStorage = [];

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadInitialNotes();
  setupDarkMode();
});

// ==========================================
// NOTES STORAGE & MANAGEMENT
// ==========================================

function loadInitialNotes() {
  // Sample notes data
  const initialNotes = [
    {
      id: 1,
      title: 'Introduction to Biology',
      category: 'Biology',
      content: 'Cells are the basic units of life. All living organisms are composed of cells...',
      color: 'blue',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      favorite: true
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion',
      category: 'Physics',
      content: 'First Law: An object at rest stays at rest and an object in motion stays in motion...',
      color: 'pink',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      favorite: false
    },
    {
      id: 3,
      title: 'Chemical Bonding',
      category: 'Chemistry',
      content: 'Ionic bonds are formed when electrons are transferred from one atom to another...',
      color: 'green',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      favorite: true
    },
    {
      id: 4,
      title: 'World War II Timeline',
      category: 'History',
      content: '1939: Germany invades Poland, starting World War II in Europe...',
      color: 'yellow',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      favorite: false
    },
    {
      id: 5,
      title: 'Calculus Fundamentals',
      category: 'Mathematics',
      content: 'Derivatives represent the rate of change of a function...',
      color: 'pink',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      favorite: false
    },
    {
      id: 6,
      title: 'Shakespeare\'s Hamlet',
      category: 'Literature',
      content: 'To be or not to be, that is the question...',
      color: 'cyan',
      timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
      favorite: true
    }
  ];

  notesStorage = initialNotes;
  renderNotesGrid();
}

function renderNotesGrid() {
  const grid = document.getElementById('notesGrid');
  grid.innerHTML = '';

  notesStorage.forEach(note => {
    const noteCard = createNoteCard(note);
    grid.appendChild(noteCard);
  });
}

function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = `note-card ${note.color}`;
  card.dataset.noteId = note.id;

  const timeAgo = getTimeAgo(note.timestamp);

  card.innerHTML = `
    <div class="note-header">
      <div class="note-category"><span>📁</span>${note.category}</div>
      <div class="note-actions">
        <span class="star-icon" data-favorite="${note.favorite}">${note.favorite ? '⭐' : '☆'}</span>
        <span class="more-icon">⋮</span>
      </div>
    </div>
    <div class="note-title">${escapeHtml(note.title)}</div>
    <div class="note-preview">${escapeHtml(note.content)}</div>
    <div class="note-footer"><span>🕐</span>${timeAgo}</div>
  `;

  // Event listeners for card actions
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.star-icon') && !e.target.closest('.more-icon')) {
      openNoteEditor(note);
    }
  });

  const starIcon = card.querySelector('.star-icon');
  starIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    note.favorite = !note.favorite;
    starIcon.textContent = note.favorite ? '⭐' : '☆';
    starIcon.dataset.favorite = note.favorite;
  });

  const moreIcon = card.querySelector('.more-icon');
  moreIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Delete note "${note.title}"?`)) {
      notesStorage = notesStorage.filter(n => n.id !== note.id);
      renderNotesGrid();
      showToast('Note deleted successfully!', 'success');
    }
  });

  return card;
}

// ==========================================
// EDITOR FUNCTIONALITY
// ==========================================

function initializeQuillEditor() {
  if (quillEditor) return;

  quillEditor = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Start writing your notes here...',
    modules: {
      toolbar: '#editorToolbar'
    }
  });

  quillEditor.on('text-change', updateEditorCounts);
}

function updateEditorCounts() {
  if (!quillEditor) return;

  const text = quillEditor.getText();
  const trimmedText = text.trim();
  const wordCount = trimmedText.length > 0 ? trimmedText.split(/\s+/).length : 0;
  const charCount = trimmedText.length;
  const readingTime = Math.ceil(wordCount / 200);

  document.getElementById('wordCount').textContent = wordCount;
  document.getElementById('charCount').textContent = charCount;
  document.getElementById('readingTime').textContent = readingTime;
}

function openNoteEditor(note) {
  const noteListView = document.getElementById('notesListView');
  const editorView = document.getElementById('editorView');

  currentNoteData = { ...note };

  // Initialize editor if needed
  if (!quillEditor) {
    initializeQuillEditor();
  }

  // Populate editor
  document.getElementById('editorNoteTitle').value = note.title;
  document.getElementById('subjectTag').textContent = `📁 ${note.category}`;
  document.getElementById('noteTimestamp').textContent = `Created: ${getTimeAgo(note.timestamp)}`;

  // Set editor content
  quillEditor.setContents([{ insert: note.content + '\n' }]);
  updateEditorCounts();

  // Update favorite button
  const favoriteBtn = document.getElementById('favoriteBtn');
  favoriteBtn.textContent = note.favorite ? '⭐' : '☆';

  // Switch views
  noteListView.style.display = 'none';
  editorView.style.display = 'flex';
  document.getElementById('mainHeaderTitle').textContent = note.title;
}

function closeNoteEditor() {
  const noteListView = document.getElementById('notesListView');
  const editorView = document.getElementById('editorView');

  noteListView.style.display = 'block';
  editorView.style.display = 'none';
  document.getElementById('mainHeaderTitle').textContent = 'My Notes';

  if (quillEditor) {
    quillEditor.setContents([]);
  }

  currentNoteData = {
    id: null,
    title: '',
    category: '',
    content: '',
    color: 'blue',
    timestamp: new Date(),
    favorite: false
  };
}

// ==========================================
// EVENT LISTENERS - INITIALIZATION
// ==========================================

function initializeEventListeners() {
  // Dark Mode
  setupDarkModeToggle();

  // Profile Popup
  setupProfilePopup();

  // Modal
  setupModalEvents();

  // Form Submission - CREATE NOTE
  setupCreateNoteForm();

  // Color Picker
  setupColorPicker();

  // Search
  setupSearch();

  // View Toggle
  setupViewToggle();

  // Navigation
  setupNavigation();

  // AI Tips
  setupAITips();

  // Chat Button
  setupChatButton();

  // Notifications
  setupNotifications();

  // Editor Controls
  setupEditorControls();

  // Quick Actions
  setupQuickActions();
}

// ==========================================
// DARK MODE
// ==========================================

function setupDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    updateDarkModeButton();
  }
}

function setupDarkModeToggle() {
  const darkModeBtn = document.getElementById('darkModeBtn');
  darkModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeButton();
  });
}

function updateDarkModeButton() {
  const isDark = document.body.classList.contains('dark-mode');
  const darkModeText = document.getElementById('darkModeText');
  const darkModeIcon = document.getElementById('darkModeBtn').querySelector('.nav-icon');
  darkModeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  darkModeIcon.textContent = isDark ? '☀️' : '🌙';
}

// ==========================================
// PROFILE & NAVIGATION
// ==========================================

function setupProfilePopup() {
  const userProfile = document.getElementById('userProfile');
  const profilePopup = document.getElementById('profilePopup');

  userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    profilePopup.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    profilePopup.classList.remove('active');
  });
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      const isSpecial = this.textContent.includes('Dark Mode') || 
                       this.textContent.includes('Light Mode') || 
                       this.classList.contains('logout-btn');

      if (!isSpecial) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}

// ==========================================
// MODAL & FORM
// ==========================================

function setupModalEvents() {
  const createNoteBtn = document.getElementById('createNoteBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const quickAddNote = document.getElementById('quickAddNote');

  createNoteBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
  closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  cancelBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  quickAddNote.addEventListener('click', () => modalOverlay.classList.add('active'));

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

function setupCreateNoteForm() {
  const form = document.getElementById('createNoteForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get values from form inputs - FIXED TO USE CORRECT IDs
    const category = document.getElementById('formNoteCategory').value.trim();
    const title = document.getElementById('formNoteTitle').value.trim();
    const content = document.getElementById('formNoteContent').value.trim();

    if (!category || !title || !content) {
      showToast('Please fill in all fields!', 'error');
      return;
    }

    // Create new note object
    const newNote = {
      id: notesStorage.length > 0 ? Math.max(...notesStorage.map(n => n.id)) + 1 : 1,
      title: title,
      category: category,
      content: content,
      color: selectedNoteColor,
      timestamp: new Date(),
      favorite: false
    };

    // Add to storage
    notesStorage.unshift(newNote);

    // Re-render grid
    renderNotesGrid();

    // Reset form
    form.reset();
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
    document.querySelector('.color-blue').classList.add('selected');
    selectedNoteColor = 'blue';

    // Close modal
    document.getElementById('modalOverlay').classList.remove('active');

    // Show success message
    showToast(`Note "${title}" created successfully! ✅`, 'success');
  });
}

function setupColorPicker() {
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      selectedNoteColor = this.dataset.color;
    });
  });
}

// ==========================================
// SEARCH & FILTER
// ==========================================

function setupSearch() {
  const notesSearch = document.getElementById('notesSearch');

  notesSearch.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const cards = document.querySelectorAll('.note-card');

    cards.forEach(card => {
      const title = card.querySelector('.note-title').textContent.toLowerCase();
      const content = card.querySelector('.note-preview').textContent.toLowerCase();
      const category = card.querySelector('.note-category').textContent.toLowerCase();

      const isMatch = title.includes(query) || content.includes(query) || category.includes(query);
      card.style.display = isMatch ? 'block' : 'none';
    });
  });
}

function setupViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const grid = document.getElementById('notesGrid');
      const viewType = this.dataset.view;

      if (viewType === 'list') {
        grid.classList.add('list-view');
      } else {
        grid.classList.remove('list-view');
      }
    });
  });
}

// ==========================================
// EDITOR CONTROLS
// ==========================================

function setupEditorControls() {
  document.getElementById('backToNotes').addEventListener('click', closeNoteEditor);

  document.getElementById('favoriteBtn').addEventListener('click', function() {
    currentNoteData.favorite = !currentNoteData.favorite;
    this.textContent = currentNoteData.favorite ? '⭐' : '☆';
    
    // Update in storage
    const note = notesStorage.find(n => n.id === currentNoteData.id);
    if (note) note.favorite = currentNoteData.favorite;
  });

  document.getElementById('shareBtn').addEventListener('click', () => {
    showToast(`Sharing "${currentNoteData.title}" with your study group...`, 'success');
  });

  document.getElementById('deleteNoteBtn').addEventListener('click', () => {
    if (confirm(`Delete note "${currentNoteData.title}"?`)) {
      notesStorage = notesStorage.filter(n => n.id !== currentNoteData.id);
      renderNotesGrid();
      closeNoteEditor();
      showToast('Note deleted successfully!', 'success');
    }
  });

  document.getElementById('editorNoteTitle').addEventListener('input', function() {
    currentNoteData.title = this.value;
    document.getElementById('mainHeaderTitle').textContent = this.value || 'Note';
  });
}

// ==========================================
// AI TIPS
// ==========================================

function setupAITips() {
  const tips = [
    "Revise 10 flashcards now to boost retention 💡",
    "Create a quick quiz from your Biology notes 🎯",
    "Summarize today's notes into 3 key points ✅",
    "Mark important formulas as ⭐ for exam prep.",
    "Review notes every day for better memory retention 🧠",
    "Use spaced repetition technique for learning 📚",
    "Create mind maps for complex topics 🗺️",
    "Connect related notes across subjects 🔗"
  ];

  document.getElementById('aiGenerateBtn').addEventListener('click', () => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('aiTipText').textContent = randomTip;
    showToast('AI suggestion updated! 🤖', 'success');
  });
}

// ==========================================
// CHAT & NOTIFICATIONS
// ==========================================

function setupChatButton() {
  document.querySelector('.chat-button').addEventListener('click', () => {
    showToast('Opening AI Assistant...', 'success');
  });
}

function setupNotifications() {
  document.querySelector('.notification-icon').addEventListener('click', () => {
    showToast('You have 2 notifications:\n• Biology quiz results are ready\n• Study group shared a deck', 'success');
  });
}

// ==========================================
// QUICK ACTIONS
// ==========================================

function setupQuickActions() {
  document.getElementById('startDailyQuiz').addEventListener('click', () => {
    showToast('Opening Daily Quiz... 🎯', 'success');
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getTimeAgo(timestamp) {
  const now = new Date();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;

  return timestamp.toLocaleDateString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ==========================================
// EXPORT FOR EXTERNAL USE
// ==========================================

window.NotesApp = {
  addNote: (title, category, content, color = 'blue') => {
    const newNote = {
      id: notesStorage.length > 0 ? Math.max(...notesStorage.map(n => n.id)) + 1 : 1,
      title,
      category,
      content,
      color,
      timestamp: new Date(),
      favorite: false
    };
    notesStorage.unshift(newNote);
    renderNotesGrid();
    return newNote;
  },
  getNotes: () => notesStorage,
  deleteNote: (id) => {
    notesStorage = notesStorage.filter(n => n.id !== id);
    renderNotesGrid();
  },
  updateNote: (id, updates) => {
    const note = notesStorage.find(n => n.id === id);
    if (note) {
      Object.assign(note, updates);
      renderNotesGrid();
    }
  }
};
