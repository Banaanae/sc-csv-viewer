function loadCsvAndFillTable(path) {
    fetch(path)
        .then(response => response.text())
        .then(contents => createAndFillTable(contents));
}

function createAndFillTable(contents) {
    let parsedTable = parseTable(contents)
    let rowCount = parsedTable.data.length
    let colCount = parsedTable.data[0].length

    const tableDiv = document.getElementById("table")
    tableDiv.replaceChildren()

    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")

    let inArray = false
    let arrayCount = 0

    for (let i = 0; i < rowCount; i++) {
        let row = document.createElement("tr")
        for (let o = 0; o < colCount; o++) {
            console.log(i, o, parsedTable.data[i][o])
            let cell = document.createElement(i >= 2 ? "td" : "th")
            cell.innerText = parsedTable.data[i][o]
            row.appendChild(cell)
        }

        if (parsedTable.data[i][0] === "") {
            if (!inArray) {
                inArray = true
                arrayCount++

                const details = document.createElement("details")
                details.setAttribute("open", "")
                const summary = document.createElement("summary")
                details.appendChild(summary)
                summary.setAttribute("controller", arrayCount)
                summary.addEventListener("click", function (e) {
                    let idx = e.target.getAttribute("controller")
                    if (!e.target.parentNode.open) {
                        document.querySelectorAll('.array' + idx).forEach(el => {
                            el.style.display = '';
                        });
                    } else {
                        document.querySelectorAll('.array' + idx).forEach(el => {
                            el.style.display = 'none';
                        });
                    }
                })
                let arrayHead = tbody.lastChild
                arrayHead.childNodes[0].prepend(details)
            }
            row.classList.add("array" + arrayCount)
        } else if (inArray) {
            inArray = false
        }

        (i >= 2 ? tbody : thead).appendChild(row)
    }
    table.appendChild(thead)
    table.appendChild(tbody)
    tableDiv.appendChild(table)
}
