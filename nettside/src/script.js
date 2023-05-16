const tilgjengeligeDatasettElement = document.getElementById("tilgjengelige-datasett")
const lasterTekst = document.getElementById("laster")
const timerPerUkedag = document.getElementById("timer-per-ukedag")
const timerPerUkedagTabell = document.getElementById("timer-per-ukedag-tabell")
const inntektPerUkedag = document.getElementById("inntekt-per-ukedag")
const inntektPerUkedagTabell = document.getElementById("inntekt-per-ukedag-tabell")
const filInput = document.getElementById("fil-input")

const TIMEPRIS = 145
const TIMEPRIS_HELG = 220

let timerPerUkedagChart = null
let inntektPerUkedagChart = null

filInput.onchange = () => {
    const fil = filInput.files[0]
    const filLeser = new FileReader()
    filLeser.readAsText(fil)

    filLeser.onload = (e) => {
        const datasett = parseCSV(e.target.result)

        lasterTekst.style.display = "none"
        kalkulerTimerPrUkedag(datasett)
        kalkulerInntektPrUkedag(datasett)
    }
}

function kalkulerTimerPrUkedag(datasett) {
    const ukeDager = new Array(7).fill(0)

    datasett.forEach((linje) => {
        ukeDager[new Date(linje.Dato).getDay()] += parseFloat(linje.Timer)
    })

    ukeDager.push(ukeDager[0])
    ukeDager.shift()

    timerPerUkedagChart && timerPerUkedagChart.destroy()
    timerPerUkedagChart = new Chart(timerPerUkedag, {
        type: "bar",
        data: {
            labels: ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
            datasets: [{
                label: "Timer per ukedag",
                data: ukeDager,
            }]
        },
    })

    timerPerUkedagTabell.innerHTML = ""
    
    const tabellHode = document.createElement("tr")
    const tabellHodeDag = document.createElement("th")
    tabellHodeDag.innerText = "Ukedag"
    const tabellHodeTimer = document.createElement("th")
    tabellHodeTimer.innerText = "Timer"
    tabellHode.appendChild(tabellHodeDag)
    tabellHode.appendChild(tabellHodeTimer)

    timerPerUkedagTabell.appendChild(tabellHode)

    ukeDager.forEach((ukeDag, index) => {
        const rad = document.createElement("tr")
        const dag = document.createElement("td")
        dag.innerText = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"][index]

        const timer = document.createElement("td")
        timer.innerText = ukeDag

        rad.appendChild(dag)
        rad.appendChild(timer)

        timerPerUkedagTabell.appendChild(rad)
    })
}

function kalkulerInntektPrUkedag(datasett) {
    const ukeDager = new Array(7).fill(0)

    datasett.forEach((linje) => {
        const ukeDag = new Date(linje.Dato).getDay()
        let helg = false
        if (ukeDag <= 0 || ukeDag >= 5) {
          helg = true
        }

        ukeDager[ukeDag] += helg ?
            linje.Timer * TIMEPRIS_HELG :
            linje.Timer * TIMEPRIS
    })

    ukeDager.push(ukeDager[0])
    ukeDager.shift()

    inntektPerUkedagChart && inntektPerUkedagChart.destroy()
    inntektPerUkedagChart = new Chart(inntektPerUkedag, {
        type: "bar",
        data: {
            labels: ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
            datasets: [{
                label: "Inntekt per ukedag",
                data: ukeDager,
            }]
        },
    })

    inntektPerUkedagTabell.innerHTML = ""
    const tabellHode = document.createElement("tr")
    const tabellHodeDag = document.createElement("th")
    tabellHodeDag.innerText = "Ukedag"
    const tabellHodeTimer = document.createElement("th")
    tabellHodeTimer.innerText = "Inntekt"
    tabellHode.appendChild(tabellHodeDag)
    tabellHode.appendChild(tabellHodeTimer)

    inntektPerUkedagTabell.appendChild(tabellHode)

    ukeDager.forEach((ukeDag, index) => {
        const rad = document.createElement("tr")
        const dag = document.createElement("td")
        dag.innerText = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"][index]

        const inntekt = document.createElement("td")
        inntekt.innerText = ukeDag

        rad.appendChild(dag)
        rad.appendChild(inntekt)

        inntektPerUkedagTabell.appendChild(rad)
    })
}

function parseCSV(input) {
    const linjer = input.split("\n")
    const felter = linjer[1]
        .split(";")
        .map((str) => str.replace(/ /g, ''))
        .map((str) => str.replace(/\r/g, ''))

    const csvSomObjekt = []

    linjer.splice(0, 2)

    linjer.forEach((linje) => {
        let linjeObjekt = {}

        felter.forEach((felt, index) => {
            const linjeFelt = linje
                .split(";")
                .map((str) => str.replace(/ /g, ''))
                .map((str) => str.replace(/\r/g, ''))

            linjeObjekt[felt] = linjeFelt[index]
        })

        csvSomObjekt.push(linjeObjekt)
    })

    return csvSomObjekt
}
