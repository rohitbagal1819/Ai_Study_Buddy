/*********************************
 StudyBuddy - Study Drive (FINAL)
 ✅ Folder chips list
 ✅ Open folder -> show files
 ✅ Upload in folder (Base64)
 ✅ Rename folder
 ✅ Delete folder
 ✅ Recent files
 ✅ View / Download / Delete file
 ✅ LocalStorage + Migration
 ✅ Redirect to pdf-viewer.html on eye click
**********************************/

// ---------------- UI ELEMENTS ----------------
const folderBar = document.getElementById("folderBar");
const folderFilesList = document.getElementById("folderFilesList");
const folderFilesTitle = document.getElementById("folderFilesTitle");
const currentFolderLabel = document.getElementById("currentFolderLabel");

const newFolderBtn = document.getElementById("newFolderBtn");
const renameFolderBtn = document.getElementById("renameFolderBtn");
const deleteFolderBtn = document.getElementById("deleteFolderBtn");
const uploadToFolderBtn = document.getElementById("uploadToFolderBtn");
const fileInput = document.getElementById("fileInput");
const recentFilesEl = document.getElementById("recentFiles");

// ---------------- STATE ----------------
let driveData = loadDriveData();
let currentFolderId = null;

// ---------------- STORAGE ----------------
function saveDriveData() {
  localStorage.setItem("studyDriveData", JSON.stringify(driveData));
}

function loadDriveData() {
  const saved = localStorage.getItem("studyDriveData");
  return saved ? JSON.parse(saved) : { folders: [], recentFiles: [] };
}

// Migration: remove old blob url files
function migrateOldFiles() {
  driveData.folders.forEach((folder) => {
    folder.files = (folder.files || []).filter((f) => f.base64);
  });

  driveData.recentFiles = (driveData.recentFiles || []).filter((f) => f.base64);
  saveDriveData();
}
migrateOldFiles();

// helpers
function createId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 9999);
}

function getFolderById(id) {
  return driveData.folders.find((f) => f.id === id);
}

// ---------------- BASE64 ----------------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------------- FILE ICON ----------------
function getFileIcon(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg"].includes(ext)) return "🖼️";
  if (["ppt", "pptx"].includes(ext)) return "📊";
  if (["pdf"].includes(ext)) return "📕";
  if (["doc", "docx"].includes(ext)) return "📝";
  return "📄";
}

// ---------------- RENDER FOLDERS ----------------
function renderFolderBar() {
  folderBar.innerHTML = "";

  if (driveData.folders.length === 0) {
    folderBar.innerHTML = `
      <span style="color:var(--text-secondary); font-size:14px;">
        No folders. Create one.
      </span>
    `;
    return;
  }

  driveData.folders.forEach((folder) => {
    const chip = document.createElement("button");
    chip.className = "folder-chip";
    chip.textContent = folder.name;

    if (folder.id === currentFolderId) chip.classList.add("active");

    chip.addEventListener("click", (e) => {
      e.preventDefault();
      openFolder(folder.id);
    });

    folderBar.appendChild(chip);
  });
}

// ---------------- OPEN FOLDER ----------------
function openFolder(folderId) {
  currentFolderId = folderId;
  const folder = getFolderById(folderId);
  if (!folder) return;

  renameFolderBtn.style.display = "inline-flex";
  deleteFolderBtn.style.display = "inline-flex";
  uploadToFolderBtn.style.display = "inline-flex";

  currentFolderLabel.textContent = `Folder: ${folder.name}`;
  folderFilesTitle.textContent = `${folder.name} - Files`;

  renderFolderBar();
  renderFolderFiles();
}

// ---------------- RENDER FILES ----------------
function renderFolderFiles() {
  folderFilesList.innerHTML = "";

  if (!currentFolderId) {
    folderFilesList.innerHTML = `
      <p style="color:var(--text-secondary); font-size:14px;">
        Select a folder to view files.
      </p>
    `;
    return;
  }

  const folder = getFolderById(currentFolderId);
  if (!folder) return;

  folder.files = folder.files || [];

  if (folder.files.length === 0) {
    folderFilesList.innerHTML = `
      <p style="color:var(--text-secondary); font-size:14px;">
        No files yet. Click <b>Upload</b>.
      </p>
    `;
    return;
  }

  folder.files.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    fileItem.innerHTML = `
      <div class="file-icon">${getFileIcon(file.name)}</div>
      <div class="file-info">
        <div class="file-name">
          ${file.name}
          <span class="check-icon">✓</span>
        </div>
        <div class="file-meta">
          <span>${file.size}</span> • <span>${file.uploadedAt}</span>
        </div>
      </div>

      <div class="file-actions">
        <button class="action-btn view" title="View">
          <i class="fa-regular fa-eye"></i>
        </button>
        <button class="action-btn download" title="Download">
          <i class="fa-solid fa-download"></i>
        </button>
        <button class="action-btn delete" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    // view -> redirect to viewer
    fileItem.querySelector(".view").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `./pdf-viewer.html?fileId=${file.id}`;
    });

    // download
    fileItem.querySelector(".download").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!file.base64) return alert("Download not available.");

      const a = document.createElement("a");
      a.href = file.base64;
      a.download = file.name;
      a.click();
    });

    // delete
    fileItem.querySelector(".delete").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm(`Delete ${file.name}?`)) return;

      folder.files = folder.files.filter((x) => x.id !== file.id);
      driveData.recentFiles = driveData.recentFiles.filter((x) => x.id !== file.id);

      saveDriveData();
      renderFolderFiles();
      renderRecentFiles();
      renderFolderBar();
    });

    folderFilesList.appendChild(fileItem);
  });
}

// ---------------- RECENT FILES ----------------
function renderRecentFiles() {
  recentFilesEl.innerHTML = "";

  if (driveData.recentFiles.length === 0) {
    recentFilesEl.innerHTML = `
      <p style="color:var(--text-secondary); font-size:14px;">
        No recent files.
      </p>
    `;
    return;
  }

  driveData.recentFiles.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    fileItem.innerHTML = `
      <div class="file-icon">${getFileIcon(file.name)}</div>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-meta">
          <span>${file.folderName}</span> • <span>${file.uploadedAt}</span>
        </div>
      </div>

      <div class="file-actions">
        <button class="action-btn view" title="View">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
    `;

    fileItem.querySelector(".view").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `./pdf-viewer.html?fileId=${file.id}`;
    });

    recentFilesEl.appendChild(fileItem);
  });
}

// ---------------- EVENTS ----------------

// create folder
newFolderBtn.addEventListener("click", () => {
  let name = prompt("Folder name (subject):");
  if (!name) return;

  name = name.trim();
  if (!name) return;

  const exists = driveData.folders.some(
    (f) => f.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) return alert("Folder already exists!");

  const folder = {
    id: createId("folder"),
    name,
    createdAt: Date.now(),
    files: []
  };

  driveData.folders.push(folder);
  saveDriveData();
  openFolder(folder.id);
});

// upload
uploadToFolderBtn.addEventListener("click", () => {
  if (!currentFolderId) return alert("Select a folder first.");
  fileInput.click();
});

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

fileInput.addEventListener("change", async (e) => {
  const files = [...e.target.files];
  if (!files.length) return;

  if (!currentFolderId) {
    alert("Select a folder first.");
    fileInput.value = "";
    return;
  }

  const folder = getFolderById(currentFolderId);
  if (!folder) {
    alert("Folder not found!");
    fileInput.value = "";
    return;
  }

  folder.files = folder.files || [];

  for (const file of files) {
    if (file.size > 4 * 1024 * 1024) {
      alert(`${file.name} is too large for browser storage. Max 4MB recommended.`);
      continue;
    }

    const base64 = await fileToBase64(file);

    const obj = {
      id: createId("file"),
      folderId: folder.id,
      folderName: folder.name,
      name: file.name,
      size: formatFileSize(file.size),
      base64: base64,
      uploadedAt: "Just now"
    };

    folder.files.unshift(obj);
    driveData.recentFiles.unshift(obj);
    driveData.recentFiles = driveData.recentFiles.slice(0, 10);
  }

  saveDriveData();
  renderFolderFiles();
  renderRecentFiles();
  renderFolderBar();
  fileInput.value = "";
});

  saveDriveData();
  renderFolderFiles();
  renderRecentFiles();
  renderFolderBar();
  fileInput.value = "";

// rename folder
renameFolderBtn.addEventListener("click", () => {
  if (!currentFolderId) return;

  const folder = getFolderById(currentFolderId);
  if (!folder) return;

  let newName = prompt("Rename folder:", folder.name);
  if (!newName) return;

  newName = newName.trim();
  if (!newName) return;

  const exists = driveData.folders.some(
    (f) => f.name.toLowerCase() === newName.toLowerCase() && f.id !== folder.id
  );

  if (exists) return alert("That folder name already exists!");

  folder.name = newName;

  // update files inside folder
  folder.files.forEach((file) => (file.folderName = newName));

  // update recent files
  driveData.recentFiles.forEach((f) => {
    if (f.folderId === folder.id) f.folderName = newName;
  });

  saveDriveData();

  currentFolderLabel.textContent = `Folder: ${folder.name}`;
  folderFilesTitle.textContent = `${folder.name} - Files`;

  renderFolderBar();
  renderFolderFiles();
  renderRecentFiles();
});

// delete folder
deleteFolderBtn.addEventListener("click", () => {
  if (!currentFolderId) return;

  const folder = getFolderById(currentFolderId);
  if (!folder) return;

  if (!confirm(`Delete folder "${folder.name}" and all its files?`)) return;

  // remove from recent
  driveData.recentFiles = driveData.recentFiles.filter((f) => f.folderId !== folder.id);

  // remove folder
  driveData.folders = driveData.folders.filter((f) => f.id !== folder.id);

  currentFolderId = null;
  renameFolderBtn.style.display = "none";
  deleteFolderBtn.style.display = "none";
  uploadToFolderBtn.style.display = "none";

  currentFolderLabel.textContent = "Select a folder";
  folderFilesTitle.textContent = "Files";

  saveDriveData();
  renderFolderBar();
  renderFolderFiles();
  renderRecentFiles();
});

// INIT
renderFolderBar();
renderFolderFiles();
renderRecentFiles();
