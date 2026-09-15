document.addEventListener("DOMContentLoaded", function () {

    function generateIdSeries() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const l1 = letters.charAt(Math.floor(Math.random() * 26));
        const l2 = letters.charAt(Math.floor(Math.random() * 26));
        const l3 = letters.charAt(Math.floor(Math.random() * 26));
        const num = Math.floor(100000 + Math.random() * 899999);
        return `${l1}${l2}${l3} ${num}`;
    }

    function generatePeselFromBirthdate(birthDateStr, isMale) {
        if (!birthDateStr || !birthDateStr.includes(".")) {
            birthDateStr = "15.08.2008";
        }
        const parts = birthDateStr.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const pad = (n) => (n < 10 ? "0" + n : "" + n);

        const pYear = String(year).slice(-2);
        let pMonth = month;
        if (year >= 2000 && year < 2100) {
            pMonth += 20;
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

    function initializeData() {
        let birthDate = localStorage.getItem("birthDate") || "15.08.2008";
        let gender = localStorage.getItem("gender") || "MĘŻCZYZNA";
        let isMale = gender.toUpperCase().startsWith("M");
        let userSurname = localStorage.getItem("surname") || "KOWALSKI";

        if (!localStorage.getItem("pesel") || localStorage.getItem("pesel").length !== 11) {
            const autoPesel = generatePeselFromBirthdate(birthDate, isMale);
            localStorage.setItem("pesel", autoPesel);
        }

        if (!localStorage.getItem("idSeriesMain")) {
            const autoId = generateIdSeries();
            localStorage.setItem("idSeriesMain", autoId);
        }

        const defaults = {
            name: "JAN",
            surname: userSurname,
            nationality: "POLSKIE",
            expiryDateMain: "20.05.2034",
            issueDateMain: "20.05.2024",
            fatherNameMain: "PIOTR",
            motherNameMain: "ANNA",
            lastName: userSurname,
            gender: isMale ? "MĘŻCZYZNA" : "KOBIETA",
            fatherSurname: userSurname,
            motherSurname: "KOWALSKA",
            placeOfBirth: "GDYNIA",
            address: "UL. MORSKA 10/12",
            postalcode: "81-001 GDYNIA",
            registrationDate: birthDate
        };

        Object.keys(defaults).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, defaults[key]);
            }
        });
    }

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
            } else {
                console.warn("Nie znaleziono pliku ze zdjęciem w folderze głównym!");
            }
        };

        imgElement.src = variants[0] + cacheBuster;
        imgElement.style.opacity = "1";
    }

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

    // Obsługa przycisku aktualizacji danych
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

    if (btnUpdate) {
        btnUpdate.addEventListener("click", function (e) {
            e.preventDefault();
            const now = setNowDate();
            if (lastUpdateEl) {
                lastUpdateEl.textContent = now;
            }
            localStorage.setItem("lastUpdateDate", now);
        });
    }

    initializeData();
    populateData();
    loadProfileImage();
});

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
