function parseTable(string) {
    const result = Papa.parse(string, { header: false });
    console.log(result)

    return result
}