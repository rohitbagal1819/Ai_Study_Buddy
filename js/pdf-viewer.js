function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

const fileId = getQueryParam("fileId");

const pdfFrame = document.getElementById("pdfFrame");
const fileNameEl = document.getElementById("fileName");
const backBtn = document.getElementById("backBtn");
const downloadBtn = document.getElementById("downloadBtn");

// load drive data
const driveData = JSON.parse(localStorage.getItem("studyDriveData")) || {
  folders: [],
  recentFiles: []
};

// ✅ find file by id (search recent + folders)
function findFileById(id) {
  // 1) recent files
  const recent = (driveData.recentFiles || []).find((f) => f.id === id);
  if (recent) return recent;

  // 2) all folders
  for (const folder of driveData.folders || []) {
    const found = (folder.files || []).find((f) => f.id === id);
    if (found) return found;
  }

  return null;
}

const fileObj = findFileById(fileId);

if (!fileObj) {
  fileNameEl.textContent = "File not found";
  alert("File not found or removed!");
} else {
  fileNameEl.textContent = fileObj.name;

  const ext = fileObj.name.split(".").pop().toLowerCase();

  // ✅ PDF preview works
  if (ext === "pdf") {
    pdfFrame.src = fileObj.base64;
  } else {
    // for docx / pptx browser can't preview directly
    pdfFrame.srcdoc = `
      <div style="font-family:sans-serif;padding:30px;">
        <h2>Preview not supported for this file type (${ext})</h2>
        <p>Please download to open.</p>
      </div>
    `;
  }

  // download
  downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = fileObj.base64;
    a.download = fileObj.name;
    a.click();
  });
}

backBtn.addEventListener("click", () => {
  window.history.back();
});
