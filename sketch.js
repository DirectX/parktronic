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
const CAR_ROTATION_FRONT_RADIUS_PX = 3;
const CAR_ROTATION_BACK_RADIUS_PX = 4;

function setup() {
    createCanvas(width, height);
    textSize(20);
    textAlign(LEFT, TOP);
    imageMode(CENTER);
    rectMode(CENTER);
    ellipseMode(CENTER);

    for (let i = 1; i <= 1; i++) {
        carImages.push(loadImage(`/assets/cars/car-0${i}.png`));
        carParams.push([width / 2, height / 2, 0.0, 0.0, 0.0, 0.0, 0.6, 0.58]);
        carRender.push([0.0, 0.0, carHeight / 2 * carParams[i - 1][CAR_REAR_AXIS_OFFSET], 0.0, 0.0]);
    }
}

function draw() {
    background(200);
    
    drawCar(0, mouseX, mouseY, mouseX * PI  / 180);
    moveCar(0);
    // drawCar(1, mouseX, mouseY, mouseX * PI  / 180);
    // moveCar(1);
    // drawCar(2, mouseX, mouseY, mouseX * PI  / 180);
    // moveCar(2);

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
            if (carParams[0][CAR_STEER] > -40.0)
                carParams[0][CAR_STEER] -= 5;
            break;
        case 'l':
            if (carParams[0][CAR_STEER] < 40.0)
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
    translate(carParams[index][CAR_X], carParams[index][CAR_Y]);
    rotate(radians(carParams[index][CAR_ANGLE]));
    image(carImages[index], 0, 0, carWidth, carHeight);
    
    fill('rgba(255, 255, 255, 0.5)');
    strokeWeight(4);
    stroke(0);
    rect(carWidth / 2 - tyreWidth / 2, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], tyreWidth, tyreHeight);
    rect(-carWidth / 2 + tyreWidth / 2, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], tyreWidth, tyreHeight);
    
    stroke(150);
    if (abs([CAR_ROTATION_BACK_RADIUS_PX]) > 0.001) {
        if (carParams[index][CAR_STEER] > 0.001) {
            line(carWidth / 2, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET]);
            // ellipse(carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], 15);
            // line(0, -carHeight / 2 * carParams[index][CAR_FRONT_AXIS_OFFSET], carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET]);
            ellipse(carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], 15);
            // ellipse(0, -carHeight / 2 * carParams[index][CAR_FRONT_AXIS_OFFSET], 15);
        }
        else if (carParams[index][CAR_STEER] < -0.001) {
            line(-carWidth / 2, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET]);
            // ellipse(carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], 15);
        }
        // else if (carParams[index][CAR_STEER] < -0.001) {
        //     line(-carWidth / 2, carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET]);
        //     ellipse(carRender[index][CAR_ROTATION_BACK_RADIUS_PX], carHeight / 2 * carParams[index][CAR_REAR_AXIS_OFFSET], 15);
        // }
    }
    stroke(0);

    translate(carWidth / 2 - tyreWidth / 2, -carHeight / 2 * carParams[index][CAR_FRONT_AXIS_OFFSET]);
    rotate(carRender[index][CAR_LEFT_WHEEL_ANGLE]);
    rect(0, 0, tyreWidth, tyreHeight);

    rotate(-carRender[index][CAR_LEFT_WHEEL_ANGLE]);
    translate(-carWidth + tyreWidth, 0);
    rotate(carRender[index][CAR_RIGHT_WHEEL_ANGLE]);
    rect(0, 0, tyreWidth, tyreHeight);
    resetMatrix();
}

function moveCar(index) {
    let dT = 1.0;
    let carBasePx = carHeight * (carParams[index][CAR_REAR_AXIS_OFFSET] + carParams[index][CAR_FRONT_AXIS_OFFSET]) / 2.0;
    let carRearOffsetPx = carRender[index][CAR_REAR_AXIS_OFFSET_PX];

    carParams[index][CAR_SPEED] = carParams[index][CAR_SPEED] + carParams[index][CAR_ACCEL];
    
    let steeringAngle = radians(carParams[index][CAR_STEER]);
    let leftWheelAngle = 0.0;
    let rightWheelAngle = 0.0;
    let dAngle = 0.0;
    let dX = 0.0;
    let dY = 0.0;

    if (abs(steeringAngle) > 0.001) {
        let rPx = carBasePx / tan(steeringAngle);
        let RPx = carBasePx / sin(steeringAngle);
        let rLPx = rPx - (carWidth - tyreWidth) / 2;
        let rRPx = rPx + (carWidth - tyreWidth) / 2;
        leftWheelAngle = atan(carBasePx / rLPx);
        rightWheelAngle = atan(carBasePx / rRPx);

        let v = carParams[index][CAR_SPEED];
        let omega = v / rPx;
        dAngle = degrees(omega * dT);

        carRender[index][CAR_ROTATION_FRONT_RADIUS_PX] = RPx;
        carRender[index][CAR_ROTATION_BACK_RADIUS_PX] = rPx;
    } else {
        dAngle = 0.0;

        carRender[index][CAR_ROTATION_FRONT_RADIUS_PX] = 0.0;
        carRender[index][CAR_ROTATION_BACK_RADIUS_PX] = 0.0;
    }

    carRender[index][CAR_LEFT_WHEEL_ANGLE] = leftWheelAngle;
    carRender[index][CAR_RIGHT_WHEEL_ANGLE] = rightWheelAngle;

    carParams[index][CAR_ANGLE] = carParams[index][CAR_ANGLE] + dAngle; //carParams[index][CAR_STEER]; //carParams[index][CAR_ANGLE] + carParams[index][CAR_STEER] * 0.01 * carParams[index][CAR_SPEED];
    carParams[index][CAR_X] = carParams[index][CAR_X] + carParams[index][CAR_SPEED] * sin(radians(carParams[index][CAR_ANGLE]));
    carParams[index][CAR_Y] = carParams[index][CAR_Y] - carParams[index][CAR_SPEED] * cos(radians(carParams[index][CAR_ANGLE]));
    //translate(x - 192 / 2, y - 364 / 2);
    //rotate(phi);
    //imageMode(CENTER);
    //image(carImages[index], carParams[index][0], carParams[index][1], carWidth, carHeight); //x - 192 / 2, y - 364 / 2, 192, 364);
}