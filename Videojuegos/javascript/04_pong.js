/*
* Implementation of the game of Pong
* Hector Lugo 
*
*/

/*
 * Simple animation on the HTML canvas
 *
 * Gilberto Echeverria
 * 2025-02-19
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

let oldTIme;

// Context of the Canvas
let ctx;

// Clases for the Pong Game
class Ball extends GameObject{
    constructor(position, width, height, color, velocity){
        super(position, width, height, color, "ball"); //llamar al constructor padre
        this.velocity = velocity;
    }

    update(deltaTIme){
        this.position.plus(this.velocity.times(deltaTIme));
    }

}

// An object to represent the box to be displayed
const box = new Ball (new(Vector(0, canvasWidth/2),200,200,"red"));


function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    drawScene(1);
}

function drawScene(newTime) {
    if(oldTIme == undefined){
        oldTIme = newTime;
    }
    let deltaTIme = newTIme - oldTIme;
    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw a square
    box.draw(ctx);

    // Update the properties of the object
    box.updatw(deltaTIme);


    if(box.position.x>canvasWidth -box.width){
        box.direction = -1;
        box.speed += 0.1;
    }
    else if(box.position.x<0){
        box.direction =1;
        box.speed +=0.1
    }



    requestAnimationFrame(drawScene);
}

main();