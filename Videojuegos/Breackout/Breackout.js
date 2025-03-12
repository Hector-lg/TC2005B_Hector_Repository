const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const $sprite = document.querySelector("#sprite")
const $bricks = document.querySelector("#bricks")

canvas.width = 448
canvas.height = 400

// Variables del Juego
let counter = 0

// Pelota Variables
const ballRadius = 3

//posicion de la pelota
let x = canvas.width/2
let y = canvas.height-30

// velocidad de la pelota
let dx = 2
let dy = -2

//Variables paleta
const paddleHeight = 10;
const paddleWidth = 50;

// posicion de la paleta
let paddleX = (canvas.width- paddleWidth)/2
let paddleY = canvas.height - paddleHeight -10

let rightPressed = false
let leftPressed = false // banderas para saber si se presiono

// Variable de los ladrillos
let bricksRowCount = 6
let  bricksColumnCount = 13
const brickWidth = 30
const brickHeight = 14
const bricksPadding = 2
const bricksOffsetTop = 80;
const bricksOffsetLeft = 16;
const BRICK_STATUS = {
    ACTIVE:1,
    DESTROYED:0
}
const bricks = []

for (let c = 0; c < bricksColumnCount; c++){ //c de columnas
    bricks [c] = [] // inicializamos el array vacio
    for (let r= 0; r<bricksRowCount; r++){
        const brickX = c *(brickWidth+bricksPadding)+bricksOffsetLeft
        const brickY = r *(brickHeight+bricksPadding)+bricksOffsetTop

        //Asignar un color random aleatorio al ladrillo
        const random = Math.floor(Math.random()*8) //rendondea numeros de 0 a 8
        // guardamos la informacion de cada ladrillo
        bricks[c][r] = { x: brickX, y: brickY, status: BRICK_STATUS.ACTIVE, color: 
            random}
    }
}

function drawBall(){
    ctx.beginPath() // iniciar el trazado
    ctx.arc(x,y, ballRadius, 0, Math.PI*2) //dibujarlo en forma de un circulo
    ctx.fillStyle = "#fff"
    ctx.fill()
    ctx.closePath() //terminar el trazado
}

function drawPaddle(){
    

    ctx.drawImage(
        //la imagen, 
        // clipX
        // clipY
        $sprite,
        0, //donde empiexa a recortar
        0,
        485, //tamaño de la imagen largo
        128, //tamaño ancho
        paddleX, //posiciones del dubujo
        paddleY,
        paddleWidth, //el tamaño con que se va a dibujar
        paddleHeight
    )
}

function drawBricks(){
    for (let c = 0; c < bricksColumnCount; c++){ //c de columnas
        for (let r= 0; r<bricksRowCount; r++){
        const currentBrick = bricks[c][r]
        if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;
        
        
        
        const clipY = currentBrick.color*(57+19)
        const spriteWidth = 171
        const spriteHeight = 57
        ctx.drawImage(
            $bricks,
            20,
            clipY,
            spriteWidth,
            spriteHeight,
            currentBrick.x,
            currentBrick.y,
            brickWidth,
            brickHeight
        )
        
    }
}
}

function collisionDetection(){
    for (let c = 0; c < bricksColumnCount; c++){ //c de columnas
        for (let r= 0; r<bricksRowCount; r++){
        const currentBrick = bricks[c][r]
        if(currentBrick.status === BRICK_STATUS.DESTROYED)continue;
            const isBallSameXasBrick =
             x > currentBrick.x &&
             x <currentBrick.x + brickWidth

             const isBallSameYasBrick =
             y > currentBrick.y &&
             y <currentBrick.y + brickHeight

             if(isBallSameXasBrick &&isBallSameYasBrick){
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
             }

        }
        
    }     
}


function ballMovement(){
    //Rebotar pelota en los laterales
    if(x +dx > canvas.width - ballRadius || x+dx< 0 ) //pared derecha || pared izquierda
    {
        dx = -dx
    }
    if(y+dy < 0){
        dy = -dy
    }

    const isBallSameXasPaddle = 
        x> paddleX &&
        x < paddleX + paddleWidth //revisar si la posicion de la x de la pleota esta dentro del largo de la pala

    const isBallSameYasPaddle =
    y +dy > paddleY  // y si esta en la misma altura

    //pelocta toca la pala
    if(isBallSameXasPaddle && isBallSameYasPaddle){
       dy =-dy //cambiar la direccion de la pelota 
    }
    //pelota toca el suelo
    else if(
        y +dy > canvas.height-ballRadius
    ){
        console.log("game over")
        document.location.reload()
    }
    x+= dx
    y += dy
}
function paddleMovement(){
    if(rightPressed && paddleX< canvas.width-paddleWidth){ //ancho del canvas - el tamaño de la paleta
        paddleX+=7
    }
    else if(leftPressed && paddleX>0){
        paddleX -= 7
    }
}

function cleanCanvas(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
}

function initEvents(){
    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)

    function keyDownHandler(event){
        const {key} = event;
        if(key === "Right" || key === "ArrowRight"){
            rightPressed = true;
        }
        else if(key === "Left" || key === "ArrowLeft"){
            leftPressed = true;
        }

    }

    function keyUpHandler(event){
        const {key} = event;
        if(key === "Right" || key === "ArrowRight"){
            rightPressed = false;
        }
        else if(key === "Left" || key === "ArrowLeft"){
            leftPressed = false;
        }
    }
}

function draw(){
    cleanCanvas()
    // Dibujar los elementos
    drawBall()
    drawPaddle()
    drawBricks()

    //Colosiones del juego
    collisionDetection()
    ballMovement()
    paddleMovement()
    console.log("Hola")
    window.requestAnimationFrame(draw)
}

draw();
initEvents();