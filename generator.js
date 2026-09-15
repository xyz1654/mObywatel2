document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("generator-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const birthDate = document.getElementById("birthDate").value.trim();
        const gender = document.getElementById("gender").value;
        const fathername = document.getElementById("fathername").value.trim();
        const mothername = document.getElementById("mothername").value.trim();

        if (name) localStorage.setItem("name", name.toUpperCase());
        if (surname) localStorage.setItem("surname", surname.toUpperCase());
        if (birthDate) localStorage.setItem("birthDate", birthDate);
        if (gender) localStorage.setItem("gender", gender.toUpperCase());
        if (fathername) localStorage.setItem("fatherNameMain", fathername.toUpperCase());
        if (mothername) localStorage.setItem("motherNameMain", mothername.toUpperCase());

        localStorage.removeItem("pesel");
        localStorage.removeItem("idSeriesMain");

        window.location.href = "index.html";
    });
});
