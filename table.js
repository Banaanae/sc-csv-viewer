/*function loadCsvAndFillTable(path) {
    fetch(path)
        .then(response => response.text())
        .then(contents => createAndFillTable(contents))
}*/

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
            let cell = document.createElement(o === 0 || i < 2 ? "span" : "td")
            cell.innerText = parsedTable.data[i][o]
            if (cell.tagName === "SPAN")
                cell.classList.add("bg")

            if (i === 1 && getTypeOf(parsedTable.data[i][o]) === 3 && o !== 0) {
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.className = "bool-filter"
                checkbox.dataset.colIndex = o
                thead.querySelector(`th:nth-child(${o + 1})`).classList.add("boolean")
                cell.prepend(checkbox)

                types.push(3)
            } else if (i === 1 && o !== 0) {
                types.push(getTypeOf(parsedTable.data[i][o].toLowerCase()))
                thead.querySelector(`th:nth-child(${o + 1})`).classList.add(parsedTable.data[i][o].toLowerCase())
            }
            if (i >= 1 && o !== 0) {
                cell.classList.add(getClassFromId(types[o]))
            }
            
            if (cell.tagName === "SPAN") {
                let _cell = document.createElement(i >= 2 ? "td" : "th")
                _cell.appendChild(cell)
                cell = _cell
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
                    let cell = arrayHead.childNodes[0]
                    if (cell.childNodes[0])
                        cell.childNodes[0].prepend(details)
                    else
                        cell.prepend(details)
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

function getTypeOf(string) {
    string = string.toLowerCase().replaceAll(/(alt)|(array)/g, "")
    switch(string) {
        case "int":
        case "number": {
            return 1
        }
        case "string":
        case "hex": {
            return 2
        }
        case "boolean": {
            return 3
        }
        default: {
            console.error("Unknown type:", string)
            return 0
        }
    }
}

function getClassFromId(id) {
    switch (id) {
        case 1: return "int"
        case 2: return "string"
        case 3: return "boolean"
    }
}