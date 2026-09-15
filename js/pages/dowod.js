// --- POPRAWIONY GENERATOR DANYCH ORAZ MAPOWANIE ---
(function () {
  var pad = (n) => (n < 10 ? "0" + n : "" + n);

  // Funkcja wyliczająca prawidłową cyfrę kontrolną PESEL
  function generateValidPesel(year, month, day, isMale) {
    var pYear = String(year).slice(-2);
    var pMonth = year >= 2000 ? month + 20 : month;
    var pMonthStr = pad(pMonth);
    var pDayStr = pad(day);
    var randomDigits = pad(Math.floor(Math.random() * 99));
    var genderDigit = isMale
      ? Math.floor(Math.random() * 5) * 2 + 1
      : Math.floor(Math.random() * 5) * 2;

    var rawPesel = pYear + pMonthStr + pDayStr + randomDigits + genderDigit;
    var weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    var sum = 0;

    for (var i = 0; i < 10; i++) {
      sum += parseInt(rawPesel.charAt(i), 10) * weights[i];
    }

    var controlDigit = (10 - (sum % 10)) % 10;
    return rawPesel + controlDigit;
  }

  // Generowanie kompletnego zestawu danych
  var isMale = Math.random() > 0.5;
  var genderStr = isMale ? "MĘŻCZYZNA" : "KOBIETA";

  var maleNames = ["JAKUB", "ANTONI", "SZYMON", "JAN", "FILIP", "KACPER", "ALEKSANDER"];
  var femaleNames = ["ZOFIA", "ZUZANNA", "HANNA", "MAJA", "JULIA", "OLIWIA", "ALICJA"];
  var maleSurnames = ["KOWALSKI", "WIŚNIEWSKI", "WÓJCIK", "KOWALCZYK", "KAMIŃSKI", "LEWANDOWSKI"];
  var femaleSurnames = ["KOWALSKA", "WIŚNIEWSKA", "WÓJCIK", "KOWALCZYK", "KAMIŃSKA", "LEWANDOWSKA"];

  var cities = [
    { city: "WARSZAWA", code: "00-001", street: "UL. MARSZAŁKOWSKA 10/12" },
    { city: "KRAKÓW", code: "30-001", street: "UL. FLORIANSKA 5" },
    { city: "GDAŃSK", code: "80-001", street: "UL. DŁUGA 15/2" },
    { city: "WROCŁAW", code: "50-001", street: "UL. ŚWIDNICKA 8" },
    { city: "POZNAŃ", code: "60-001", street: "UL. PÓŁWIEJSKA 20" }
  ];

  var name = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  var surname = isMale ? maleSurnames[Math.floor(Math.random() * maleSurnames.length)] : femaleSurnames[Math.floor(Math.random() * femaleSurnames.length)];
  var fatherName = maleNames[Math.floor(Math.random() * maleNames.length)];
  var motherName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
  var fatherSurname = maleSurnames[Math.floor(Math.random() * maleSurnames.length)];
  var motherSurname = femaleSurnames[Math.floor(Math.random() * femaleSurnames.length)];
  var loc = cities[Math.floor(Math.random() * cities.length)];

  var year = Math.floor(Math.random() * (2004 - 1985 + 1)) + 1985;
  var month = Math.floor(Math.random() * 12) + 1;
  var day = Math.floor(Math.random() * 28) + 1;
  var birthDateStr = pad(day) + "." + pad(month) + "." + year;

  var validPesel = generateValidPesel(year, month, day, isMale);

  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var randomSeries = letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26));
  var randomNumber = Math.floor(100050 + Math.random() * 899900);
  var generatedIdSeries = randomSeries + " " + randomNumber;

  var issueYear = year + 18 + Math.floor(Math.random() * 3);
  var issueDateStr = pad(day) + "." + pad(month) + "." + issueYear;
  var expiryDateStr = pad(day) + "." + pad(month) + "." + (issueYear + 10);

  var defaultData = {
    name: name,
    surname: surname,
    nationality: "POLSKIE",
    birthDate: birthDateStr,
    pesel: validPesel,
    lastName: surname,
    gender: genderStr,
    fatherNameMain: fatherName,
    motherNameMain: motherName,
    fatherSurname: fatherSurname,
    motherSurname: motherSurname,
    placeOfBirth: loc.city,
    address: loc.street,
    postalcode: loc.code + " " + loc.city,
    registrationDate: issueDateStr,
    idSeriesMain: generatedIdSeries,
    issueDateMain: issueDateStr,
    expiryDateMain: expiryDateStr
  };

  Object.keys(defaultData).forEach(function (key) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultData[key]);
    }
  });
})();

document.addEventListener("DOMContentLoaded", function () {
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

  // Pełna lista mapowania pól z localStorage do HTML
  [
    { id: "display-name", key: "name", formatter: up },
    { id: "display-surname", key: "surname", formatter: up },
    { id: "display-nationality", key: "nationality", formatter: up },
    { id: "display-birthDate", key: "birthDate", formatter: formatDateDots },
    { id: "display-pesel", key: "pesel", formatter: up },
    { id: "idSeriesMain", key: "idSeriesMain", formatter: up },
    { id: "expiryDateMain", key: "expiryDateMain", formatter: formatDateDots },
    { id: "issueDateMain", key: "issueDateMain", formatter: formatDateDots },
    { id: "fathernameMain", key: "fatherNameMain", formatter: up },
    { id: "mothernameMain", key: "motherNameMain", formatter: up },
    { id: "lastName", key: "lastName", formatter: up },
    { id: "gender", key: "gender", formatter: up },
    { id: "fatherSurname", key: "fatherSurname", formatter: up },
    { id: "motherSurname", key: "motherSurname", formatter: up },
    { id: "placeOfBirth", key: "placeOfBirth", formatter: up },
    { id: "address", key: "address", formatter: up },
    { id: "postalcode", key: "postalcode", formatter: up },
    { id: "registrationDate", key: "registrationDate", formatter: formatDateDots }
  ].forEach((item) => {
    setText(item.id, localStorage.getItem(item.key), { formatter: item.formatter });
  });
});
