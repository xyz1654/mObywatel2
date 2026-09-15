setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

// Stała obsługa zdjęcia profilowego ze sztywną ścieżką do assets
async function applyProfileImage() {
  try {
    var profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    profileImage.src = "assets/moje_zdjecie.png";
    profileImage.style.opacity = "1";
    profileImage.style.display = "block";
  } catch (err) {
    console.error("Błąd ładowania zdjęcia:", err);
  }
}

let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

function closeCamera() {
  try {
    document.body.classList.remove("camera-open", "camera-opening");
  } catch (_) {}
  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach((track) => track.stop());
    } catch (_) {}
    cameraStream = null;
  }
  if (cameraVideoEl) {
    try {
      cameraVideoEl.pause();
      cameraVideoEl.srcObject = null;
    } catch (_) {}
  }
  if (cameraContainerEl) {
    try {
      cameraContainerEl.style.display = "none";
    } catch (_) {}
  }
}

async function openCamera() {
  if (!cameraContainerEl) cameraContainerEl = document.getElementById("camera-container");
  if (!cameraVideoEl) cameraVideoEl = document.getElementById("camera-view");
  if (!cameraContainerEl || !cameraVideoEl) {
    window.location.href = "qr.html?scan=1";
    return;
  }
  try {
    document.body.classList.add("camera-opening", "camera-open");
    cameraContainerEl.style.display = "block";
  } catch (_) {}

  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach((track) => track.stop());
    } catch (_) {}
    cameraStream = null;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    closeCamera();
    alert("Twoja przeglądarka nie wspiera dostępu do aparatu.");
    return;
  }

  try {
    var stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
    } catch (_) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }
    cameraVideoEl.srcObject = stream;
    cameraStream = stream;
    cameraVideoEl.play().catch(() => {});
  } catch (error) {
    alert("Nie można uzyskać dostępu do aparatu.");
    closeCamera();
  } finally {
    document.body.classList.remove("camera-opening");
  }
}

window.addEventListener("load", function () {
  try { if (typeof checkInstallation === "function") checkInstallation(); } catch (e) {}
  applyProfileImage();
});

document.addEventListener("DOMContentLoaded", function () {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");
  window.openCamera = openCamera;
  window.closeCamera = closeCamera;

  var notificationTimer = null;
  var hideToast = function () {
    var n = document.getElementById("notification");
    if (!n) return;
    if (notificationTimer) clearTimeout(notificationTimer);
    n.classList.remove("show");
    n.style.display = "none";
  };

  var showToast = function (msg, durationMs) {
    var n = document.getElementById("notification");
    if (!n) return;
    var textEl = n.querySelector(".notification-text");
    if (msg && textEl) textEl.textContent = msg;
    n.style.display = "block";
    setTimeout(() => n.classList.add("show"), 10);
    if (notificationTimer) clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => hideToast(), durationMs || 3000);
  };

  var closeBtn = document.querySelector("#notification .notification-close");
  if (closeBtn) closeBtn.addEventListener("click", () => hideToast());

  applyProfileImage();

  // Formatowanie danych
  var up = (s) => (s ? String(s).toLocaleUpperCase("pl") : s);
  var formatDateDots = function (val) {
    if (!val) return val;
    var s = String(val).trim();
    var m = s.match(/^(\d{4})[-./](\d{2})[-./](\d{2})$/);
    if (m) return m[3] + "." + m[2] + "." + m[1];
    return s.replace(/-/g, ".");
  };

  var setText = function (id, value, options) {
    options = options || {};
    var el = document.getElementById(id);
    if (!el) return;
    var formatted = typeof options.formatter === "function" ? options.formatter(value) : value;
    if (formatted != null && String(formatted).trim() !== "") {
      el.textContent = String(formatted).trim();
    }
  };

  [
    { id: "display-name", key: "name", formatter: up },
    { id: "display-surname", key: "surname", formatter: up },
    { id: "display-nationality", key: "nationality", formatter: up },
    { id: "display-birthDate", key: "birthDate", formatter: formatDateDots },
    { id: "display-pesel", key: "pesel", formatter: up },
    { id: "lastName", key: "lastName", formatter: up },
    { id: "gender", key: "gender", formatter: up },
    { id: "fatherSurname", key: "fatherSurname", formatter: up },
    { id: "motherSurname", key: "motherSurname", formatter: up },
    { id: "placeOfBirth", key: "placeOfBirth", formatter: up },
    { id: "address", key: "address", formatter: up },
    { id: "postalcode", key: "postalcode" },
    { id: "registrationDate", key: "registrationDate", formatter: formatDateDots }
  ].forEach((item) => {
    setText(item.id, localStorage.getItem(item.key), { formatter: item.formatter });
  });

  // Obsługa Kopiowania
  var copyToClipboard = function (text, msg) {
    if (!text || text === "Brak danych") {
      showToast("Brak danych do skopiowania");
      return;
    }
    navigator.clipboard.writeText(text).then(() => showToast(msg || "Skopiowano do schowka"));
  };

  var btnMain = document.getElementById("kopiujMain");
  if (btnMain) {
    btnMain.addEventListener("click", function () {
      var t = document.getElementById("idSeriesMain")?.textContent || "";
      copyToClipboard(t.replace("Kopiuj", "").trim(), "Skopiowano serię i numer mDowodu");
    });
  }

  // Obsługa Aktualizacji
  var pad = (n) => (n < 10 ? "0" + n : "" + n);
  var getNowDate = function () {
    var d = new Date();
    return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear();
  };

  var lastUpdateEl = document.getElementById("sukadziwkakurwa");
  var btnUpdate = document.getElementById("aktualizuj");

  var savedDate = localStorage.getItem("lastUpdateDate");
  if (savedDate && lastUpdateEl) lastUpdateEl.textContent = savedDate;

  if (btnUpdate && lastUpdateEl) {
    btnUpdate.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var now = getNowDate();
      lastUpdateEl.textContent = now;
      localStorage.setItem("lastUpdateDate", now);
      showToast("Dokument został zaktualizowany");
    });
  }

  // Obsługa Rozwijania "Twoje dodatkowe dane"
  const lo = document.querySelector("#extra-toggle");
  const content = document.querySelector("#extra-content");
  const arrow = document.querySelector("#extra-arrow");

  if (lo && content) {
    let isOpen = false;
    content.style.display = "none";

    lo.addEventListener("click", function () {
      isOpen = !isOpen;
      if (isOpen) {
        content.style.display = "block";
        lo.style.borderRadius = "12px 12px 0px 0px";
        if (arrow) arrow.src = "assets/icons/ab007_chevron_up.svg";
      } else {
        content.style.display = "none";
        lo.style.borderRadius = "12px";
        if (arrow) arrow.src = "assets/icons/ab008_chevron_down.svg";
      }
    });
  }
});

// Zegar na żywo
const czasEl = document.querySelector(".czas");
function updateClockNow() {
  const now = new Date();
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  if (czasEl) {
    czasEl.textContent = `Czas: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  }
}
if (czasEl) {
  updateClockNow();
  setInterval(updateClockNow, 1000);
}

