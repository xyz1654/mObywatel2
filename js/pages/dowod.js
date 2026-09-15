document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. INTELIGENTNY GENERATOR DANYCH
    // ==========================================
    function generateSmartData() {
        if (localStorage.getItem("pesel")) return; // Jeśli dane już są, nie generuj nowych

        var pad = (n) => (n < 10 ? "0" + n : "" + n);
        var isMale = Math.random() > 0.5;
        
        var year = Math.floor(Math.random() * (2004 - 1985 + 1)) + 1985;
        var month = Math.floor(Math.random() * 12) + 1;
        var day = Math.floor(Math.random() * 28) + 1;

        // Generowanie PESEL
        var pYear = String(year).slice(-2);
        var pMonth = year >= 2000 ? month + 20 : month;
        var rawPesel = pYear + pad(pMonth) + pad(day) + pad(Math.floor(Math.random() * 99)) + (isMale ? 1 : 0);
        var weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
        var sum = 0;
        for (var i = 0; i < 10; i++) sum += parseInt(rawPesel.charAt(i), 10) * weights[i];
        var controlDigit = (10 - (sum % 10)) % 10;
        var validPesel = rawPesel + controlDigit;

        // Generator Serii Dowodu
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var randomSeries = letters.charAt(Math.floor(Math.random()*26)) + letters.charAt(Math.floor(Math.random()*26)) + letters.charAt(Math.floor(Math.random()*26));
        var validIdSeries = randomSeries + " " + Math.floor(100050 + Math.random() * 899900);

        var data = {
            name: isMale ? "JAKUB" : "ZOFIA",
            surname: isMale ? "KOWALSKI" : "KOWALSKA",
            nationality: "POLSKIE",
            birthDate: pad(day) + "." + pad(month) + "." + year,
            pesel: validPesel,
            idSeriesMain: validIdSeries,
            expiryDateMain: pad(day) + "." + pad(month) + "." + (year + 28),
            issueDateMain: pad(day) + "." + pad(month) + "." + (year + 18),
            fatherNameMain: "PIOTR",
            motherNameMain: "ANNA",
            lastName: isMale ? "KOWALSKI" : "KOWALSKA",
            gender: isMale ? "MĘŻCZYZNA" : "KOBIETA",
            fatherSurname: "KOWALSKI",
            motherSurname: "NOWAK",
            placeOfBirth: "GDYNIA",
            address: "UL. ŚWIĘTOJAŃSKA 10/12",
            postalcode: "81-300 GDYNIA",
            registrationDate: pad(day) + "." + pad(month) + "." + (year + 18)
        };

        // Zapis do localStorage
        Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
    }

    // ==========================================
    // 2. WYPEŁNIANIE DANYCH W HTML
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
            // Próba znalezienia elementu ID w HTML (dopasowanie do nazw z HTML)
            let elId = key;
            if(key === "name" || key === "surname" || key === "nationality" || key === "birthDate" || key === "pesel") {
                elId = "display-" + key;
            } else if (key === "fatherNameMain") elId = "fathernameMain"; // korekta małej litery
            else if (key === "motherNameMain") elId = "mothernameMain"; // korekta małej litery
            
            const element = document.getElementById(elId);
            const value = localStorage.getItem(key);
            
            if (element && value) {
                element.textContent = value.toUpperCase();
            }
        });

        // Wymuszenie załadowania zdjęcia (ominięcie cache)
        const profileImage = document.getElementById("profileImage");
        if (profileImage) {
            profileImage.src = "moje_zdjecie.png?v=" + new Date().getTime();
        }
    }

    // ==========================================
    // 3. OBSŁUGA AKORDEONU (ZAKŁADKA)
    // ==========================================
    const toggleBtn = document.getElementById("extra-toggle");
    const contentDiv = document.getElementById("extra-content");
    const arrowImg = document.getElementById("extra-arrow");

    if (toggleBtn && contentDiv) {
        toggleBtn.addEventListener("click", function () {
            if (contentDiv.style.display === "none" || contentDiv.style.display === "") {
                contentDiv.style.display = "block";
                if(arrowImg) arrowImg.classList.add

          
