document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        createAndFillTable(contents)
    }

    reader.readAsText(file);
})

document.getElementById("collapse").addEventListener("click", function () {
    document.querySelectorAll("details[open] summary").forEach((e) => {
        e.click()
    })
})

document.getElementById("expand").addEventListener("click", function () {
    document.querySelectorAll("details:not([open]) summary").forEach((e) => {
        e.click()
    })
})

document.getElementById("showNumbers").addEventListener("change", function (c) {
    document.querySelectorAll(".int").forEach((e) => {
        e.style.display = c.target.checked ? "" : "none"
    })
})

document.getElementById("showStrings").addEventListener("change", function (c) {
    document.querySelectorAll(".string").forEach((e) => {
        e.style.display = c.target.checked ? "" : "none"
    })
})

document.getElementById("showBools").addEventListener("change", function (c) {
    document.querySelectorAll(".boolean").forEach((e) => {
        e.style.display = c.target.checked ? "" : "none"
    })
})