document.getElementById("generator-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    const gender = document.getElementById("gender").value;
    const fathername = document.getElementById("fathername").value.trim();
    const mothername = document.getElementById("mothername").value.trim();

    const queryParams = new URLSearchParams({
        name: name,
        surname: surname,
        birthDate: birthDate,
        gender: gender,
        fathername: fathername,
        mothername: mothername
    });

    window.location.href = "index.html?" + queryParams.toString();
});

