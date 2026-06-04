function loadCsvAndFillTable(path) {
    fetch(path)
        .then(response => response.text())
        .then(contents => createAndFillTable(contents))
}

function createAndFillTable(contents) {
    let parsedTable = Papa.parse(contents, { header: false });
    let rowCount = parsedTable.data.length
    let colCount = parsedTable.data[0].length

    const tableDiv = document.getElementById("table")
    tableDiv.replaceChildren()

    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")

    let inArray = false
    let arrayCount = 0
    let types = [0]

    for (let i = 0; i < rowCount; i++) {
        let row = document.createElement("tr")
        
        for (let o = 0; o < colCount; o++) {
            let cell = document.createElement(i >= 2 ? "td" : "th")
            cell.innerText = parsedTable.data[i][o]

            if (i === 1 && parsedTable.data[i][o].toLowerCase() === "boolean" && o !== 0) {
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.className = "bool-filter"
                checkbox.dataset.colIndex = o
                thead.querySelector(`th:nth-child(${o + 1})`).classList.add("boolean")
                cell.prepend(checkbox)

                types.push(3)
            } else if (i === 1 && o !== 0) {
                types.push(parsedTable.data[i][o].toLowerCase() === "int" ? 1 : 2)
                thead.querySelector(`th:nth-child(${o + 1})`).classList.add(parsedTable.data[i][o].toLowerCase())
            }
            if (i >= 1 && o !== 0) {
                cell.classList.add(types[o] === 1 ? "int" :
                    types[o] === 2 ? "string" : "boolean"
                )
            }

            row.appendChild(cell)
        }

        if (parsedTable.data[i][0] === "") {
            if (!inArray) {
                inArray = true
                arrayCount++

                const details = document.createElement("details")
                details.setAttribute("open", "")
                const summary = document.createElement("summary")
                summary.className = "array-toggle"
                summary.setAttribute("data-controller", arrayCount)
                details.appendChild(summary)
                
                let arrayHead = tbody.lastChild
                if (arrayHead && arrayHead.childNodes[0]) {
                    arrayHead.childNodes[0].prepend(details)
                }
            }
            row.classList.add("array" + arrayCount)
            row.dataset.arrayHidden = "false";
        } else if (inArray) {
            inArray = false
        }

        (i >= 2 ? tbody : thead).appendChild(row)
    }

    table.appendChild(thead)
    table.appendChild(tbody)
    tableDiv.appendChild(table)

    function updateRowVisibility() {
        const activeFilters = []
        thead.querySelectorAll("input.bool-filter").forEach(cb => {
            if (cb.checked) {
                activeFilters.push(parseInt(cb.dataset.colIndex, 10))
            }
        })

        tbody.querySelectorAll("tr").forEach(row => {
            const isHiddenByArray = row.dataset.arrayHidden === "true"
            
            let isHiddenByFilter = false
            for (let colIdx of activeFilters) {
                let cell = row.children[colIdx]
                if (cell && cell.innerText.toLowerCase() !== "true") {
                    isHiddenByFilter = true
                    break
                }
            }

            if (isHiddenByArray || isHiddenByFilter) {
                row.style.display = 'none'
            } else {
                row.style.display = ''
            }
        })
    }

    
    thead.querySelectorAll("input.bool-filter").forEach(checkbox => {
        checkbox.addEventListener("change", updateRowVisibility)
    })

    thead.removeAttribute("open");
    table.querySelectorAll(".array-toggle").forEach(summary => {
        summary.addEventListener("click", function (e) {
            let idx = e.target.getAttribute("data-controller")
            let willHide = e.target.parentNode.open

            tbody.querySelectorAll('.array' + idx).forEach(row => {
                row.dataset.arrayHidden = willHide ? "true" : "false"
            })

            updateRowVisibility()
        })
    })
}