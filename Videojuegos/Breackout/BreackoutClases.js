let lifes =3;

class Ball extends GameObject{
    constructor(position, radius, color){
        super(position, radius*2, radius*2, color, "ball");
        this.radius = radius;
        this.velocity = new Vec(2,-2);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(
            this.position.x + this.radius,
            this.position.y + this.radius,
            this.radius, 0, Math.PI*2
        );
        ctx.fillStyle = this.color
        ctx.fill();
        ctx.closePath();
    }

    update(canvas,paddle, bricks){
        if(this.position.x +this.velocity.x > canvas.width-this.radius*2 ||
            this.position.x+this.velocity.x <0)
            { this.velocity.x = -this.velocity.x; }


    if(this.position.y + this.position.y < 0){
        this.velocity.y = this.velocity.y;
    }

    //colision con la pala
     const ballCenterX = this.position.x + this.radius;
     if(ballCenterX > paddle.position.x &&
        ballCenterX < paddle.position.x + paddle.width &&
        this.position.y + this.velocity.y + this.radius*2 > paddle.position.y){
            this.velocity.y =-this.velocity.y;
        }

    //detectar si la pelota cayo
    else if(this.position.y + this.velocity.y > canvas.height - this.radius*2){
        console.log("game over");
        
        return true;
        }
    
    this.position = this.position.plus(this.velocity);
    return false;
    }

    checkBrickCollisions(bricks) {
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                const brick = bricks[c][r];
                if (brick.status === 1) {
                    const ballCenterX = this.position.x + this.radius;
                    const ballCenterY = this.position.y + this.radius;
                    
                    if (ballCenterX > brick.position.x && 
                        ballCenterX < brick.position.x + brick.width &&
                        ballCenterY > brick.position.y && 
                        ballCenterY < brick.position.y + brick.height) {
                        this.velocity.y = -this.velocity.y;
                        brick.status = 0; // Destruir el ladrillo
                        return true; // Colisin detectada
                    }
                }
            }
        }
        return false; // Sin colisiones
    }
}


class Paddle extends GameObject{
    constructor(position, width, height, color){
        super(position, width, height, color)
        this.speed = 7;
        this.rigthPressed = false;
        this.leftPressed = false;
    }

    update(canvas){
        if(this.rightPressed && this.position.x < canvas.width-this.width){
            this.position.x += this.speed;
        }
        else if(this.leftPressed && this.position.x>0){
            this.position.x -= this.speed;
        }
    }

    initControls(){
        document.addEventListener("keydown", (event) => {
            if (event.key === "Right" || event.key === "ArrowRight") {
                this.rightPressed = true;
            } else if (event.key === "Left" || event.key === "ArrowLeft") {
                this.leftPressed = true;
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.key === "Right" || event.key === "ArrowRight") {
                this.rightPressed = false;
            } else if (event.key === "Left" || event.key === "ArrowLeft") {
                this.leftPressed = false;
            }
        });
    }
}

class Brick extends GameObject{
    constructor(position, width, height, color, spriteImage, colorIndex){
        super(position,width,height,color, "brick")
        this.status = 1; //comprobar si se destruyo
        this.colorIndex = colorIndex;
    
    if(spriteImage){
        const spriteRect = new Rect(
            20, //margen de la imagen
            colorIndex*(57+19), //altura del bloque + espacio entre bloques de la imagen
            171, //ancho del ladrollo en el sprite
            57 //ancho del ladrillo 
        );
        this.setSprite(spriteImage, spriteRect);
        }
    }
}


//Juego 
class Breakout{
    constructor(canvasId, rows = 6, columns = 13, level =1){
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext ("2d");
        this.canvas.width = 440;
        this.canvas.height = 400;

        this.$sprite = document.querySelector("#sprite");
        this.$bricks = document.querySelector("#bricks");


        this.bricksRowCount = rows;
        this.bricksColumnCount = columns;
        this.level = level;
        this.brickWidth = 30;
        this.brickHeight = 14;
        this.bricksPadding = 2;
        this.bricksOffsetTop = 80;
        this.bricksOffsetLeft = 16;
        
        //inicializar objetos
        this.ball = new Ball(
            new Vec(this.canvas.width/2, this.canvas.height-20),
            3, //radio 
            "#fff"
        )

        this.paddle = new Paddle( 
            new Vec( this.canvas.width/2, this.canvas.height-10),
            50, //ancho
            10, //largo
            "#0095DD"
            );

        //sprite de la pala
        this.paddle.setSprite(this.$sprite, new Rect(0,0,485,128));

        //ladrillos iniciarlos
        this.bricks = [];
        this.initBricks();

        // Inicializar controles
        this.paddle.initControls();

        this.gameLoop();
    }

    initBricks() {
        for (let c = 0; c < this.bricksColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.bricksRowCount; r++) {
                const brickX = c * (this.brickWidth + this.bricksPadding) + this.bricksOffsetLeft;
                const brickY = r * (this.brickHeight + this.bricksPadding) + this.bricksOffsetTop;
                
                // Generar color aleatorio
                const colorIndex = Math.floor(Math.random() * 8);
                
                this.bricks[c][r] = new Brick(
                    new Vec(brickX, brickY),
                    this.brickWidth,
                    this.brickHeight,
                    "#0095DD", // Color base 
                    this.$bricks,
                    colorIndex
                );
            }
        }
    }
    
    draw(){
        //llimpiar el canvas en cada frame
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        // Dibujar la pelota
        this.ball.draw(this.ctx);
        
        // Dibujar la pala
        this.paddle.draw(this.ctx);
        
        // Dibujar los ladrillos
        this.drawBricks();
    }

    drawBricks(){
        for (let c = 0; c < this.bricksColumnCount; c++) {
            for (let r = 0; r < this.bricksRowCount; r++) {
                const brick = this.bricks[c][r];
                if (brick.status === 1) {
                    brick.draw(this.ctx);
                }
            }
        }
    }

    update(){
        //mover la pelota
        this.paddle.update(this.canvas);
        
        // Comprobar colisiones con ladrillos
        this.ball.checkBrickCollisions(this.bricks);
        
        // Actualizar la posicion de la pelota y comprobar si hay game over
        const gameOver = this.ball.update(this.canvas, this.paddle, this.bricks);
        if (gameOver) {
            document.location.reload();
        }
    }

    gameLoop() {
        // Dibujar todos los elementos
        this.draw();
        
        // Actualizar posiciones y estados
        this.update();
        
        // Continuar el bucle
        window.requestAnimationFrame(() => this.gameLoop());
    }
}


