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
        const address = document.getElementById("addressInput").value.trim();
        const postalcode = document.getElementById("postalCodeInput").value.trim();
        const photoInput = document.getElementById("photoFile");

        let expiryDate = "";
        if (issueDate.includes(".")) {
            const parts = issueDate.split(".");
            if (parts.length === 3) {
                expiryDate = `${parts[0]}.${parts[1]}.${parseInt(parts[2], 10) + 10}`;
            }
        }

        if (name) localStorage.setItem("name", name.toUpperCase());
        if (surname) {
            const upper = surname.toUpperCase();
            localStorage.setItem("surname", upper);
            localStorage.setItem("lastName", upper);        
            localStorage.setItem("fatherSurname", upper);  
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
        if (address) localStorage.setItem("address", address.toUpperCase());
        if (postalcode) localStorage.setItem("postalcode", postalcode.toUpperCase());

        // Jeśli wybrano zdjęcie, przekształć je na kod i zapisz w pamięci
        if (photoInput && photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem("profilePhoto", event.target.result);
                window.location.href = "dowod.html";
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            window.location.href = "dowod.html";
        }
    });
});
