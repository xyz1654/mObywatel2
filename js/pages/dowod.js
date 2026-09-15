document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GENERATORY PESEL ORAZ NUMERU DOWODU (TYLKO AUTOMAT)
    // ==========================================
    
    // Generator serii i numeru dowodu (np. ABC 123456)
    function generateIdSeries() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const l1 = letters.charAt(Math.floor(Math.random() * 26));
        const l2 = letters.charAt(Math.floor(Math.random() * 26));
        const l3 = letters.charAt(Math.floor(Math.random() * 26));
        const num = Math.floor(100000 + Math.random() * 899999);
        return `${l1}${l2}${l3} ${num}`;
    }

    // Generator poprawnego matematycznie PESEL-u na podstawie daty urodzenia
    function generatePeselFromBirthdate(birthDateStr, isMale) {
        if (!birthDateStr || !birthDateStr.includes(".")) {
            birthDateStr = "15.08.1998";
        }
        const parts = birthDateStr.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const pad = (n) => (n < 10 ? "0" + n : "" + n);

        const pYear = String(year).slice(-2);
        let pMonth = month;
        if (year >= 2000 && year < 2100) {
            pMonth += 20; // W PESEL dla osób urodzonych po 2000 r. dodaje się 20 do miesiąca
        }

        const random3Digits = Math.floor(100 + Math.random() * 899);
        const genderDigit = isMale ? (Math.floor(Math.random() * 5) * 2 + 1) : (Math.floor(Math.random() * 5) * 2);

        const rawPesel = pYear + pad(pMonth) + pad(day) + String(random3Digits) + genderDigit;

        const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(rawPesel.charAt(i), 10) * weights[i];
        }
        const controlDigit = (10 - (sum % 10)) % 10;
        return rawPesel + controlDigit;
    }

    // ==========================================
    // 2. ODBIÓR DANYCH Z URL (BEZ PESELU I NR DOWODU)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString().length > 0) {
        // Ignorujemy wszelkie próby przekazania peselu i nr dowodu w linku
        const urlData = {
            name: urlParams.get('name') || urlParams.get('imie'),
            surname: urlParams.get('surname') || urlParams.get('nazwisko'),
            nationality: urlParams.get('nationality') || urlParams.get('obywatelstwo'),
            birthDate: urlParams.get('birthDate') || urlParams.get('birthdate') || urlParams.get('dataUrodzenia'),
            fatherNameMain: urlParams.get('fathername') || urlParams.get('imieOjca'),
            motherNameMain: urlParams.get('mothername') || urlParams.get('imieMatki'),
            gender: urlParams.get('gender') || urlParams.get('plec')
        };

        Object.keys(urlData).forEach(key => {
            if (urlData[key]) localStorage.setItem(key, urlData[key].toUpperCase());
        });

        // Wymuszenie wygenerowania nowego PESEL i Nr Dowodu na podstawie danych z URL
        localStorage.removeItem("pesel");
        localStorage.removeItem("idSeriesMain");

        // Czyszczenie paska adresu
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // ==========================================
    // 3. SPRAWDZENIE I INICJALIZACJA DANYCH
    // ==========================================
    function initializeData() {
        var pad = (n) => (n < 10 ? "0" + n : "" + n);
        
        let birthDate = localStorage.getItem("birthDate");
        if (!birthDate) {
            var year = Math.floor(Math.random() * (2004 - 1985 + 1)) + 1985;
            var month = Math.floor(Math.random() * 12) + 1;
            var day = Math.floor(Math.random() * 28) + 1;
            birthDate = pad(day) + "." + pad(month) + "." + year;
            localStorage.setItem("birthDate", birthDate);
        }

        let gender = localStorage.getItem("gender") || "KOBIETA";
        let isMale = gender.toUpperCase().startsWith("M");

        // Jeśli PESEL nie istnieje lub jest uszkodzony, generuj automatycznie
        if (!localStorage.getItem("pesel") || localStorage.getItem("pesel").length !== 11) {
            const autoPesel = generatePeselFromBirthdate(birthDate, isMale);
            localStorage.setItem("pesel", autoPesel);
        }

        // Jeśli Numer Dowodu nie istnieje, generuj automatycznie
        if (!localStorage.getItem("idSeriesMain")) {
            const autoId = generateIdSeries();
            localStorage.setItem("idSeriesMain", autoId);
        }

        // Domyślne wartości reszty pól
        const defaults = {
            name: isMale ? "JAKUB" : "ZUZANNA",
            surname: isMale ? "KOWALSKI" : "LEWANDOWSKA",
            nationality: "POLSKIE",
            expiryDateMain: "20.11.2031",
            issueDateMain: "20.11.2021",
            fatherNameMain: isMale ? "PIOTR" : "JAN",
            motherNameMain: isMale ? "ANNA" : "ALICJA",
            lastName: isMale ? "KOWALSKI" : "LEWANDOWSKA",
            gender: isMale ? "MĘŻCZYZNA" : "KOBIETA",
            fatherSurname: "KAMIŃSKI",
            motherSurname: "LEWANDOWSKA",
            placeOfBirth: "WARSZAWA",
            address: "UL. MARSZAŁKOWSKA 10/12",
            postalcode: "00-001 WARSZAWA",
            registrationDate: "20.11.2021"
        };

        Object.keys(defaults).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, defaults[key]);
            }
        });
    }

    // ==========================================
    // 4. WYPEŁNIANIE WIDOKU HTML
    // ==========================================
    function populateData() {
        const fields = [
            "name", "surname", "nationality", "birthDate", "pesel", 
            "idSeriesMain", "expiryDateMain", "issueDateMain", 
            "fatherNameMain", "motherNameMain", "lastName", "gender", 
            "fatherSurname", "motherSurname", "placeOfBirth", 
            "address", "postalcode", "registrationDate"
        ];

        fields.forEach(key => {
            let elId = key;
            if (["name", "surname", "nationality", "birthDate", "pesel"].includes(key)) {
                elId = "display-" + key;
            } else if (key === "fatherNameMain") elId = "fathernameMain"; 
            else if (key === "motherNameMain") elId = "mothernameMain";
            
            const element = document.getElementById(elId);
            const value = localStorage.getItem(key);
            
            if (element && value) {
                element.textContent = value.toUpperCase();
            }
        });
    }

    // ==========================================
    // 5. ŁADOWANIE ZDJĘCIA
    // ==========================================
    function loadProfileImage() {
        const imgElement = document.getElementById("profileImage");
        if (!imgElement) return;

        const variants = ["moje_zdjecie.png", "moje_zdjecie.PNG", "moje_zdjecie.jpg", "moje_zdjecie.JPG", "moje_zdjecie.jpeg"];
        let attempt = 0;
        const cacheBuster = "?v=" + new Date().getTime();

        imgElement.onerror = function() {
            attempt++;
            if (attempt < variants.length) {
                imgElement.src = variants[attempt] + cacheBuster;
            }
        };

        imgElement.src = variants[0] + cacheBuster;
        imgElement.style.opacity = "1";
    }

    // ==========================================
    // 6. OBSŁUGA AKORDEONU (ZAKŁADKA)
    // ==========================================
    const toggleBtn = document.getElementById("extra-toggle");
    const contentDiv = document.getElementById("extra-content");
    const arrowImg = document.getElementById("extra-arrow");

    if (toggleBtn && contentDiv) {
        contentDiv.style.display = "none";
        toggleBtn.addEventListener("click", function () {
            if (contentDiv.style.display === "none") {
                contentDiv.style.display = "block";
                if(arrowImg) arrowImg.style.transform = "rotate(180deg)";
            } else {
                contentDiv.style.display = "none";
                if(arrowImg) arrowImg.style.transform = "rotate(0deg)";
            }
        });
    }

    // ==========================================
    // 7. OBSŁUGA AKTUALIZACJI CZASU
    // ==========================================
    const lastUpdateEl = document.getElementById("lastUpdateData"); 
    const btnUpdate = document.getElementById("aktualizuj");
    
    function setNowDate() {
        const d = new Date();
        const pad = (n) => (n < 10 ? "0" + n : "" + n);
        return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear();
    }

    if (lastUpdateEl) {
        const savedDate = localStorage.getItem("lastUpdateDate");
        lastUpdateEl.textContent = savedDate || "--.--.----";
    }

    if (btnUpdate && lastUpdateEl) {
        btnUpdate.addEventListener("click", function (e) {
            e.preventDefault();
            const now = setNowDate();
            lastUpdateEl.textContent = now;
            localStorage.setItem("lastUpdateDate", now);
        });
    }

    // Uruchomienie procedury
    initializeData();
    populateData();
    loadProfileImage();
});

// Zegar w nagłówku
const czasEl = document.getElementById("clock") || document.querySelector(".czas");
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
