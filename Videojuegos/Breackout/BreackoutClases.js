

class Ball extends GameObject{
    constructor(position, radius, color){
        super(position, radius*2, radius*2, color, "ball");
        this.radius = radius;
        this.velocity = new Vec(2,-2);
        this.initialPosition = new Vec(position.x, position.y)
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

    reset(){
        this.position = new Vec(this.initialPosition.x, this.initialPosition.y);
        this.velocity = new Vec(2,-2);
    }
    update(canvas, paddle, bricks, game){
        // Colisión con los bordes laterales
        if(this.position.x + this.velocity.x > canvas.width - this.radius*2 ||
           this.position.x + this.velocity.x < 0) {
            this.velocity.x = -this.velocity.x;
        }

        // Colisión con el borde superior
        if(this.position.y + this.velocity.y < 0){
            this.velocity.y = -this.velocity.y;
        }

        // Colisión con la pala
        // Creamos un objeto temporal para simular la próxima posición
        const nextPosition = new Vec(
            this.position.x + this.velocity.x,
            this.position.y + this.velocity.y
        );
        const ballObj = {
            position: nextPosition,
            width: this.radius * 2,
            height: this.radius * 2
        };

        if(boxOverlap(ballObj, paddle)) {
            this.velocity.y = -Math.abs(this.velocity.y); // Aseguramos que rebota hacia arriba
            
            // Variar el angulo 
            const hitPoint = (this.position.x + this.radius - paddle.position.x) / paddle.width;
            this.velocity.x = 5 * (hitPoint - 0.5); // -2.5 a 2.5
        }

        // Detectar si la pelota cayó
        else if(this.position.y + this.velocity.y > canvas.height - this.radius*2){
            console.log("lost life");
            game.loseLife();
            return true;
        }
    
        // Comprobar colisiones con ladrillos
        this.checkBrickCollisions(bricks, game);
        
        // Actualizar posición
        this.position = this.position.plus(this.velocity);
        return false;
    }

    checkBrickCollisions(bricks, game) {

        const nextPosition = new Vec(
            this.position.x + this.velocity.x,
            this.position.y + this.velocity.y
        );
        const ballObj = {
            position: nextPosition,
            width: this.radius * 2,
            height: this.radius * 2
        };

        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                const brick = bricks[c][r];
                if (brick.status === 1) {
                    if (boxOverlap(ballObj, brick)) {
                        // Determinar de qué lado viene la colisión
                        const dx = this.position.x + this.radius - (brick.position.x + brick.width/2);
                        const dy = this.position.y + this.radius - (brick.position.y + brick.height/2);
                        
                        // Si el dx es mayor que dy (en valores absolutos), entonces la colisión es horizontal
                        if (Math.abs(dx) > Math.abs(dy)) {
                            this.velocity.x = -this.velocity.x;
                        } else {
                            this.velocity.y = -this.velocity.y;
                        }
                        
                        brick.status = 0; // Destruir el ladrillo
                        game.addScore(brick.scoreValue); // Añadir puntos
                        game.blocksDestroyed++; // Incrementar contador de bloques destruidos
                        return true; // Colision detectada
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
        this.initialPosition = new Vec(position.x, position.y);
    }

    reset() {
        // Reset paddle to initial position
        this.position = new Vec(this.initialPosition.x, this.initialPosition.y);
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
    constructor(position, width, height, color, spriteImage, colorIndex, level){
        super(position,width,height,color, "brick")
        this.status = 1; //comprobar si se destruyo
        this.colorIndex = colorIndex;
        this.scoreValue = 10+ (level*5);
    
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

        this.lives = 3;
        this.score = 0;
        this.highScore = localStorage.getItem('breakoutHighScore') || 0;
        this.blocksDestroyed = 0;
        this.totalBlocks = 0;
        this.level = level;
        this.gameOver = false;
        this.paused = false;

        this.bricksRowCount = rows;
        this.bricksColumnCount = columns;
        this.level = level;
        this.brickWidth = 30;
        this.brickHeight = 14;
        this.bricksPadding = 2;
        this.bricksOffsetTop = 80;
        this.bricksOffsetLeft = 16;

        this.livesElement = document.querySelector('#lives');
        this.scoreElement = document.querySelector('#score');
        
        this.initUI();

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
                    colorIndex,
                    this.level
                );
                
            }
        }
    }
    initUI() {
        this.livesElement = document.querySelector('#lives');
        this.scoreElement = document.querySelector('#score');
        // Crear etiquetas para la información del juego
        this.livesLabel = new TextLabel(10, 20, "16px Arial", "#FFF");
        this.scoreLabel = new TextLabel(10, 40, "16px Arial", "#FFF");
        this.highScoreLabel = new TextLabel(10, 60, "16px Arial", "#FFF");
        this.levelLabel = new TextLabel(this.canvas.width - 80, 20, "16px Arial", "#FFF");
        this.blocksLabel = new TextLabel(this.canvas.width - 80, 40, "16px Arial", "#FFF");

        this.updateUI();
    }
    addScore(points) {
        this.score += points;
        // Actualizar puntuación máxima si es necesario
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('breakoutHighScore', this.highScore);
        }
        this.updateUI();
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver = true;
            alert("Game Over! Your score: " + this.score);
            // Only reload here if you want to completely restart
            document.location.reload();
        } else {
            // Reset ball and paddle
            this.ball.reset();
            this.paddle.reset();
            
            // Pause briefly before continuing
            this.paused = true;
            setTimeout(() => {
                this.paused = false;
            }, 1000);
        }
    }

    updateUI() { // no se porque las vidas no cuentan :(
        this.livesElement.textContent = "vidas:"+ this.lives;
        this.scoreElement.textContent = "puntiacion: "+ this.score;
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
        
        if (!this.paused) {
            // Update ball position and check for game over
            const ballFell = this.ball.update(this.canvas, this.paddle, this.bricks, this);
        }
        // Actualizar la posicion de la pelota y comprobar si hay game over
        const gameOver = this.ball.update(this.canvas, this.paddle, this.bricks, this);
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


