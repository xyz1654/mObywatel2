document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("generator-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Powstrzymuje odświeżenie strony

        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const birthDate = document.getElementById("birthDate").value.trim();
        const gender = document.getElementById("gender").value;
        const fathername = document.getElementById("fathername").value.trim();
        const mothername = document.getElementById("mothername").value.trim();

        // Zapis do pamięci przeglądarki
        if (name) localStorage.setItem("name", name.toUpperCase());
        if (surname) localStorage.setItem("surname", surname.toUpperCase());
        if (birthDate) localStorage.setItem("birthDate", birthDate);
        if (gender) localStorage.setItem("gender", gender.toUpperCase());
        if (fathername) localStorage.setItem("fatherNameMain", fathername.toUpperCase());
        if (mothername) localStorage.setItem("motherNameMain", mothername.toUpperCase());

        // Wymuszenie ponownego przeliczenia PESEL-u i serii dowodu
        localStorage.removeItem("pesel");
        localStorage.removeItem("idSeriesMain");

        // Przejście do mDowodu
        window.location.href = "index.html";
    });
});
