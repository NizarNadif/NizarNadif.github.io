let dimension = 400
    // draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

class Ball {
    constructor(x, y) {
        this.position = createVector(x, y)
        this.vel = createVector(random(-4, 4), (-4, 4))
        this.r = random(5, 50)
    }

    draw() {
        circle(this.position.x, this.position.y, this.r)
        let MousePos = createVector(mouseX - 50, mouseY - 50)
        drawArrow(this.position, MousePos, 'blue')
    }
    move() {
        this.position.add(this.vel)
        if (this.position.x < 0 + 0.5 * this.r || this.position.x > 400 - 0.5 * this.r) {
            this.vel.x *= -1
                //this.r += (noise(this.r) - 0.5) * 30
            fill(random(255), random(255), random(255))
        }
        if (this.position.y < 0 + 0.5 * this.r || this.position.y > 400 - 0.5 * this.r) {
            this.vel.y *= -1
                //this.r += (noise(this.r) - 0.5) * 30
            fill(random(255), random(255), random(255))
        }

    }
}

let b

function setup() {
    createCanvas(dimension, dimension)
    b = new Ball(50, 60)
    console.log(b)
}

function draw() {
    background(220);
    b.move()
    b.draw()

}