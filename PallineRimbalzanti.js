let size = 500
let speed = 7

class Ball {
    constructor(x, y) {
        this.position = createVector(x, y)
        this.vel = createVector(random(-speed, speed), (-speed, speed))
        this.r = random(20, 40)
        this.moves = false
    }

    draw() {
        circle(this.position.x, this.position.y, this.r)
            //il colore è dato dalla distanza fra il cerchio ed il mouse
        let distance = constrain(sqrt(pow(this.position.x - mouseX, 2) - pow(this.position.y - mouseY, 2)),
            0, 255)
        fill(255 - distance, 0, distance)
            //fill(distance, distance, distance)
    }
    move() {
        if (this.moves) {
            this.position.add(this.vel)
            if (this.position.x < 0 + 0.5 * this.r || this.position.x > size - 0.5 * this.r) {
                this.vel.x *= -1
                    //this.r += (noise(this.r) - 0.5) * 30
            }
            if (this.position.y < 0 + 0.5 * this.r || this.position.y > size - 0.5 * this.r) {
                this.vel.y *= -1
                    //this.r += (noise(this.r) - 0.5) * 30
            }
        }

    }

    setMoves(n) {
        this.moves = n
    }
}

function setup() {
    createCanvas(size, size)
    balls = []
}

function draw() {
    background(0);
    balls.forEach(ball => ball.move())
    balls.forEach(ball => ball.draw())
}

function mousePressed() {
    if (mouseButton === LEFT) {
        balls.push(new Ball(mouseX, mouseY))
        balls[balls.length - 1].draw()
    }
    if (mouseButton === RIGHT) {
        balls.forEach(ball => ball.setMoves(1))
    }
    if (mouseButton === CENTER) {
        balls.length = 0
    }
}

function doubleClicked() {
    if (mouseButton == RIGHT) {
        balls.forEach(ball => ball.setMoves(0))
    }
}