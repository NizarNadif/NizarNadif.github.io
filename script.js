let points

class Punto {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    move() {
        this.x = (this.x + noise(this.x)) % 700
        if (this.x < 0) {
            this.x = 400 + this.x
        }
    }

    draw() {
        circle(this.x, this.y, 5 + random(19, 20))
    }
}

function setup() {
    createCanvas(700, 700);
    points = []
    for (let i = 0; i < 10; i++) {
        points.push(new Punto(10 + 2 * i, 20 + 35 * i))
    }
    console.log(points)
}

function draw() {
    background(22);
    for (let i = 0; i < 10; i++) {
        points[i].move()
    }
    /*for (let i=0; i<10; i++){
      //circle(points[i].x, points[i].y, random(10, 20))
      points[i].draw()
    }*/

    points.filter((point) => { return (point.x > 100) && (point.x < 500) }).forEach((point) => { point.draw() })

}