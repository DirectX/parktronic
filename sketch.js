let width = 1024;
let height = 768;
let carWidth = 192;
let carHeight = 387;
let tyreWidth = 30;
let tyreHeight = 60;
let carImages = [];
let carParams = [];
const CAR_X = 0;
const CAR_Y = 1;
const CAR_ANGLE = 2;
const CAR_SPEED = 3;
const CAR_ACCEL = 4;
const CAR_STEER = 5;
const CAR_FRONT_AXIS_OFFSET = 6;
const CAR_REAR_AXIS_OFFSET = 7;

let carRender = [];
const CAR_LEFT_WHEEL_ANGLE = 0;
const CAR_RIGHT_WHEEL_ANGLE = 1;
const CAR_REAR_AXIS_OFFSET_PX = 2;

function setup() {
    createCanvas(width, height);
    textSize(20);
    textAlign(LEFT, TOP);
    imageMode(CENTER);
    rectMode(CENTER);

    for (let i = 1; i <= 5; i++) {
        carImages.push(loadImage(`/assets/cars/car-0${i}.png`));
        carParams.push([width / 2, height / 2, 0.0, 0.0, 0.0, 0.0, 0.6, 0.58]);
        carRender.push([0.0, 0.0, carHeight / 2 * carParams[i - 1][CAR_REAR_AXIS_OFFSET]]);
    }
}

function draw() {
    background(200);
    
    drawCar(0, mouseX, mouseY, mouseX * PI  / 180);
    moveCar(0);

    resetMatrix();
    fill(30);
    noStroke();
    text(`Speed: ${carParams[0][CAR_SPEED]}`, 10, 10);
    text(`Steering: ${carParams[0][CAR_STEER]}`, 10, 40);
    text(`Controls: j, l, i, k`, 10, 70);
    // if (mouseIsPressed) {
    //     fill(0);
    // } else {
    //     fill(255);
    // }
    // ellipse(mouseX, mouseY, 80, 80);
}

function keyPressed() {
    switch (key) {
        case 'j':
            if (carParams[0][CAR_STEER] > -45.0)
                carParams[0][CAR_STEER] -= 5;
            break;
        case 'l':
            if (carParams[0][CAR_STEER] < 45.0)
                carParams[0][CAR_STEER] += 5;
            break;
        case 'i':
            carParams[0][CAR_SPEED] += 0.2;
            break;
        case 'k':
            carParams[0][CAR_SPEED] -= 0.2;
            break; 
        }
  }

function drawCar(index) {
    let carRearOffsetPx = carRender[index][CAR_REAR_AXIS_OFFSET_PX];
    console.log(carRearOffsetPx);

    translate(carParams[index][CAR_X], carParams[index][CAR_Y]);
    rotate(radians(carParams[index][CAR_ANGLE]));
    image(carImages[index], 0, 0, carWidth, carHeight); //x - 192 / 2, y - 364 / 2, 192, 364);
    
    fill('rgba(255, 255, 255, 0.5)');
    strokeWeight(4);
    stroke(0);
    rect(carWidth / 2 - tyreWidth, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], tyreWidth, tyreHeight);
    rect(-carWidth / 2 + tyreWidth, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], tyreWidth, tyreHeight);
    translate(carWidth / 2 - tyreWidth, -carHeight / 2 * carParams[index][CAR_FRONT_AXIS_OFFSET]);
    rotate(carRender[index][CAR_LEFT_WHEEL_ANGLE]);
    rect(0, 0, tyreWidth, tyreHeight);
    rotate(-carRender[index][CAR_LEFT_WHEEL_ANGLE]);
    translate(-carWidth + tyreWidth * 2, 0);
    rotate(carRender[index][CAR_RIGHT_WHEEL_ANGLE]);
    rect(0, 0, tyreWidth, tyreHeight);
    resetMatrix();
}

function moveCar(index) {
    let carBase = carHeight * (carParams[index][CAR_REAR_AXIS_OFFSET] + carParams[index][CAR_FRONT_AXIS_OFFSET]) / 2.0;

    let steeringAngle = radians(carParams[index][CAR_STEER]);
    let leftWheelAngle = 0.0;
    let rightWheelAngle = 0.0;
    let dx = 0.0;
    let dy = 0.0;

    if (abs(steeringAngle) > 0.001) {
        let r = carBase / tan(steeringAngle);
        let rL = r - (carWidth - tyreWidth) / 2;
        let rR = r + (carWidth - tyreWidth) / 2;
        leftWheelAngle = atan(carBase / rL);
        rightWheelAngle = atan(carBase / rR);
    }

    carRender[index][CAR_LEFT_WHEEL_ANGLE] = leftWheelAngle;
    carRender[index][CAR_RIGHT_WHEEL_ANGLE] = rightWheelAngle;

    carParams[index][CAR_ANGLE] = carParams[index][CAR_ANGLE] + carParams[index][CAR_STEER] * 0.01 * carParams[index][CAR_SPEED];
    carParams[index][CAR_SPEED] = carParams[index][CAR_SPEED] + carParams[index][CAR_ACCEL];
    carParams[index][CAR_X] = carParams[index][CAR_X] + carParams[index][CAR_SPEED] * sin(radians(carParams[index][CAR_ANGLE]))
    carParams[index][CAR_Y] = carParams[index][CAR_Y] - carParams[index][CAR_SPEED] * cos(radians(carParams[index][CAR_ANGLE]))
    //translate(x - 192 / 2, y - 364 / 2);
    //rotate(phi);
    //imageMode(CENTER);
    //image(carImages[index], carParams[index][0], carParams[index][1], carWidth, carHeight); //x - 192 / 2, y - 364 / 2, 192, 364);
}