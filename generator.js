document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("generator-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const birthDate = document.getElementById("birthDate").value.trim();
        const placeOfBirth = document.getElementById("placeOfBirth").value.trim();
        const gender = document.getElementById("gender").value;
        const issueDate = document.getElementById("issueDateMain").value.trim();
        const fathername = document.getElementById("fathername").value.trim();
        const mothername = document.getElementById("mothername").value.trim();

        // Wyliczenie daty ważności (+10 lat)
        let expiryDate = "";
        if (issueDate.includes(".")) {
            const parts = issueDate.split(".");
            if (parts.length === 3) {
                const year = parseInt(parts[2], 10) + 10;
                expiryDate = `${parts[0]}.${parts[1]}.${year}`;
            }
        }

        if (name) localStorage.setItem("name", name.toUpperCase());
        if (surname) {
            const upperSurname = surname.toUpperCase();
            localStorage.setItem("surname", upperSurname);
            localStorage.setItem("lastName", upperSurname);        
            localStorage.setItem("fatherSurname", upperSurname);  
        }
        if (birthDate) {
            localStorage.setItem("birthDate", birthDate);
            localStorage.setItem("registrationDate", birthDate); 
        }
        if (placeOfBirth) localStorage.setItem("placeOfBirth", placeOfBirth.toUpperCase());
        if (gender) localStorage.setItem("gender", gender.toUpperCase());
        if (issueDate) localStorage.setItem("issueDateMain", issueDate);
        if (expiryDate) localStorage.setItem("expiryDateMain", expiryDate);
        if (fathername) localStorage.setItem("fatherNameMain", fathername.toUpperCase());
        if (mothername) localStorage.setItem("motherNameMain", mothername.toUpperCase());

        localStorage.removeItem("pesel");
        localStorage.removeItem("idSeriesMain");

        window.location.href = "index.html";
    });
});
