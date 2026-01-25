// File Upload
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');

uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// Drag and Drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} is too large. Max size is 10MB.`);
            return;
        }

        uploadProgress.style.display = 'block';
        simulateUpload(file);
    });
}

function simulateUpload(file) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                addFileToList(file);
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
            }, 500);
        }
    }, 100);
}

function addFileToList(file) {
    const fileSize = (file.size / (1024 * 1024)).toFixed(1);
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-icon">📄</div>
        <div class="file-info">
            <div class="file-name">
                ${file.name}
                <span class="check-icon">✓</span>
            </div>
            <div class="file-meta">
                <span>${fileSize} MB</span>
                <span>•</span>
                <span>Just now</span>
            </div>
        </div>
        <div class="file-actions">
            <button class="action-btn view" title="View">👁️</button>
            <button class="action-btn download" title="Download">⬇️</button>
            <button class="action-btn delete" title="Delete">🗑️</button>
        </div>
    `;

    fileItem.querySelector('.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete ${file.name}?`)) {
            fileItem.style.transform = 'translateX(100%)';
            fileItem.style.opacity = '0';
            setTimeout(() => fileItem.remove(), 300);
        }
    });

    fileItem.querySelector('.view').addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Opening ${file.name}...`);
    });

    fileItem.querySelector('.download').addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Downloading ${file.name}...`);
    });

    fileList.insertBefore(fileItem, fileList.firstChild);

    fileItem.style.transform = 'translateX(-100%)';
    fileItem.style.opacity = '0';
    setTimeout(() => {
        fileItem.style.transition = 'all 0.3s';
        fileItem.style.transform = 'translateX(0)';
        fileItem.style.opacity = '1';
    }, 10);
}

// Existing file actions
document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileItem = btn.closest('.file-item');
        const fileName = fileItem.querySelector('.file-name').textContent.trim();
        if (confirm(`Delete ${fileName}?`)) {
            fileItem.style.transform = 'translateX(100%)';
            fileItem.style.opacity = '0';
            setTimeout(() => fileItem.remove(), 300);
        }
    });
});

document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileName = btn.closest('.file-item').querySelector('.file-name').textContent.trim();
        alert(`Opening ${fileName}...`);
    });
});

document.querySelectorAll('.action-btn.download').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileName = btn.closest('.file-item').querySelector('.file-name').textContent.trim();
        alert(`Downloading ${fileName}...`);
    });
});

// Chat button
document.querySelector('.chat-button').addEventListener('click', () => {
    alert('AI Assistant chat opening soon!');
});

// Notification
document.querySelector('.notification-icon').addEventListener('click', () => {
    alert('You have 2 new notifications!');
});
