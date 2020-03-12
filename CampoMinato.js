const CANVAS_SIZE = 700
const GRID_SIZE = 20
const cellSize = CANVAS_SIZE / GRID_SIZE
const fontSize = cellSize * 0.5
let flowersDiscovered = 0,
    placedFlags = 0,
    totalFlowers = 0

class Cell {
    constructor() {
        this.flower = false
        if (Math.random() > 0.85)
            this.flower = true
        this.n = 0 // numero di fiori attorno
        this.coperto = true
        this.bandiera = false
    }

    draw(x, y) {
        //se la cella è coperta la coloro di grigio
        if (this.coperto) {
            fill(128, 128, 128)
            rect(x * cellSize, y * cellSize, cellSize, cellSize)
                //se è coperta ed ha una bandiera sopra, disegno una bandiera
            if (this.bandiera) {
                textSize(fontSize)
                text('🚩', x * cellSize + 0.3 * cellSize, y * cellSize + 0.65 * cellSize)
            }
            //se la cella è scoperta
        } else {
            //se è un fiore (avviene quando si perde) disegno il fiore con sfondo rosa salmone
            if (this.flower) {
                fill(255, 204, 203)
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
                    //altrimenti disegno il numero con sfondo bianco
            } else {
                fill(255, 255, 255)
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
            //raffiguro il numero o il fiore, se la casella non ha fiori attorno non raffiguro niente
            fill(0)
            textSize(fontSize)
            if (this.n != 0)
                text(this.n, x * cellSize + 0.3 * cellSize, y * cellSize + 0.65 * cellSize)
        }
    }

    scopri() {
        //se la cella da scoprire non ha una bandiera allora la scopro
        if (!this.bandiera) {
            //se è un fiore ho perso
            if (this.flower) {
                //scopro tutte le caselle fatta eccezione per i fiori con una bandiera sopra
                grid.forEach(row => row.forEach(cell => cell.coperto = cell.bandiera && cell.flower))
                console.log("Hai perso!")
                var continua = false
                if (continua) setup()
            }
            this.coperto = false
            if (this.n == 0) scopriZeri(x, y)



        }
    }

}



function scopriZeri(x, y) {
    if (grid[y][x].n != 0) grid[y][x].scopri()
        //se la cella non è uno zero o è una bandiera o è scoperta mi interrompo
    if (grid[y][x].n != 0 || grid[y][x].bandiera || !grid[y][x].coperto) {
        return;
    }
    //altrimenti la scopro e avvio lo stesso controllo alle celle che toccano direttamente la suddetta (sopra, sotto, destra e sinistra)
    grid[y][x].coperto = false
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            //se la cella ha una x ed una y che si trovano all'interno della griglia e tocca direttamente la cella di partenza,
            //cosa che si verifica quando si trova nella stessa riga (y + j = y => j = 0) o nella stessa colonna (x + i = x => i = 0)
            if ((x + i >= 0 && x + i < GRID_SIZE) && (y + j >= 0 && y + j < GRID_SIZE)) {
                scopriZeri(x + i, y + j)
            }
        }
    }

}

function countFlowers() {
    //eseguo questa funzione solo all'inizio perché il numero di fiori non cambia mai
    //a differenza del numero di bandiere

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const currentCell = grid[y][x]
            if (currentCell.flower) {
                grid[y][x].n = '🌹' //la cella è un fiore, la conto
                totalFlowers++
            } else {
                let flowers = 0
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if ((x + i >= 0 && x + i < GRID_SIZE) && (y + j >= 0 && y + j < GRID_SIZE) && grid[y + j][x + i].flower)
                            flowers++
                    }
                }
                grid[y][x].n = flowers
            }
        }
    }
}

function contaBandiere(x, y) {
    const cell = grid[y][x]
    let bandiere = 0
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if ((x + i >= 0 && x + i < GRID_SIZE) && (y + j >= 0 && y + j < GRID_SIZE) && grid[y + j][x + i].bandiera)
                bandiere++
        }
    }
    return bandiere
}

function drawGrids() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            grid[y][x].draw(x, y)
        }
    }
}

function drawStats() {
    fill(0);
    textSize(30);
    textStyle(BOLD);
    text(totalFlowers - placedFlags, CANVAS_SIZE / 2, CANVAS_SIZE + 50)

}

function mousePressed() {
    if (mouseButton === LEFT) {
        x = Math.floor(mouseX / cellSize)
        y = Math.floor(mouseY / cellSize)
        cell = grid[y][x]
            //se la cella premuta è già scoperta procedo a scoprire tute le celle che le stanno attorno
        if (!cell.coperto && contaBandiere(x, y) == cell.n) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if ((x + i >= 0 && x + i < GRID_SIZE) && (y + j >= 0 && y + j < GRID_SIZE)) {
                        if (grid[y + j][x + i].n == 0)
                            scopriZeri(x + i, y + j)
                        else grid[y + j][x + i].scopri()
                    }
                }
            }
        } else {
            //se è uno 0 coperto chiamo la funzione scopri zeri
            if (cell.n == 0)
                scopriZeri(x, y)
                //altrimenti scopro la cella
            else cell.scopri()
        }

    }
    if (mouseButton === RIGHT) {
        x = Math.floor(mouseX / cellSize)
        y = Math.floor(mouseY / cellSize)
            //metto/tolgo la bandiera nella cella
        cell = grid[y][x]
        if (cell.bandiera) {
            cell.bandiera = false
            placedFlags--
            if (cell.flower)
                flowersDiscovered--
        } else {
            cell.bandiera = true
            placedFlags++
            if (cell.flower) {
                flowersDiscovered++
            }
        }
        if (flowersDiscovered == totalFlowers && flowersDiscovered == placedFlags) {
            grid.forEach(row => row.forEach(cell => cell.coperto = cell.flower))
            console.log("Hai vinto!")
            var continua = false
            if (continua) setup()
        }
    }
}

function setup() {
    placedFlags = 0
    flowersDiscovered = 0
    totalFlowers = 0
    grid = []
        //riempio il vettore di vettori di celle => grid = matrice di celle
    for (let i = 0; i < GRID_SIZE; i++) {
        let rowVector = []
        for (let j = 0; j < GRID_SIZE; j++) {
            rowVector.push(new Cell())
        }
        grid.push(rowVector)
    }
    //do i valori di n fiori attorno ad una cella alle celle e
    //ottengo il numero di fiori nella griglia
    countFlowers()
    createCanvas(CANVAS_SIZE, CANVAS_SIZE + 100);
}

function draw() {
    background(171, 205, 239);
    drawGrids()
    drawStats()

}