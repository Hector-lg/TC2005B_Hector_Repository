/*
Hector Lugo 
25-02-2025
*/

"use strict";

class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    plus(other){
        return new Vector(this.x+other.x,this.y+other.y);
    }

    minus(other){
        return new Vector(this.x+other.x,this.y+other.y);
    }

    times(scalar){
        return new Vector(this.x*scalar, this.y*scalar);
    }

    magnitude(){
        return Math.sqrt(this.x**2+this.y**2);
    }
}

let a = new Vector(3,7);
let b = new Vector(-2,5);
console.log('plus', a.plus(b));
console.log("times", a.times(10));


class GameObject{
    constructor(position, width, hegith,color, type){
        this.position = position;
        this.width = width;
        this.hegith = hegith;
        this.color = color;
        this.type = type;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y,
                     this.width, this.height);
    }

    // empty template for all gameobjects
    update(){

    }
}

