let width = 1024;
let height = 768;
let img;

function setup() {
    createCanvas(width, height);
    img = loadImage('car.png');
}

function draw() {
    background(255);
    
    drawCar(mouseX, mouseY, mouseX * PI  / 180);
    // if (mouseIsPressed) {
    //     fill(0);
    // } else {
    //     fill(255);
    // }
    // ellipse(mouseX, mouseY, 80, 80);
}

function drawCar(x, y, phi) {
    translate(x - 192 / 2, y - 364 / 2);
    rotate(phi);
    imageMode(CENTER);
    image(img, x - 192 / 2, y - 364 / 2, 192, 364);
}