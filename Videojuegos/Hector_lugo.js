"use strict";
/*
Actividad en clase: Javascript

Hector Lugo A01029811

12-02-2025
*/

//Escribe una función llamada firstNonRepeating 
// que encuentre el primer carácter de un cadena de 
// texto que no se repite. Prueba tu función con: 'abacddbec'

export function firstNonRepeating(string) {
    for (let i=0; i<string.length; i++) {
        let repeated = false;
        for (let j=0; j<string.length; j++) {
            if (string[i] == string[j] && i != j) {
                repeated = true;
                break;
            }
        }
        //console.log(`Char: ${string[i]}, repeated: ${repeated}`);
        if (!repeated) {
            return string[i];
        }
    }
}




//Escribe una función llamada bubbleSort que implemente el algoritmo 
// 'bubble-sort' para ordenar una lista de número

export function swap(arr, x, y) {
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;  
}

export function bubbleSort(arreglo) {
    let n = arreglo.length;  
    console.log("Estado inicial del arreglo:"); 
    console.log(arreglo);

    for (let i = 0; i < n - 1; i++) {

        for (let j = 0; j < n - 1 - i; j++) {
            if (arreglo[j] > arreglo[j + 1]) { 
                swap(arreglo, j, j + 1);
            }
        }
    }
    
    return arreglo;
}

// Ejemplo de uso:
let numeros = [64, 34, 25, 12, 22, 11, 90];
//console.log("Array ordenado:", bubbleSort(numeros));



//Escribe dos funciones: la primera con nombre invertArray que invierta un arreglo de números
//  y regrese un nuevo arreglo con el resultado; la segunda, con nombre invertArrayInplace,
// que modifique el mismo arreglo que se pasa como argumento. No se permite usar la función integrada 'reverse'.

export function invertArray(arreglo){
    let n = arreglo.length -1;
    let nuevo_arreglo = [];
    for (let i = n; i >=0; i--){
        nuevo_arreglo.push(arreglo[i]);
    }
    return nuevo_arreglo;
}

console.log(invertArray(numeros))

export function invertArrayInplace(arreglo) {
    let n = arreglo.length;
    for (let i = 0; i < n / 2; i++) {
        swap(arreglo, i, n - 1 - i);
    }
    return arreglo;
}
console.log(invertArrayInplace(numeros))



//Escribe una función llamada capitalize que 
// reciba una cadena de texto y regrese una
//nueva con la primer letra de cada palabra en mayúscula.

export function capitalize(cadena_string){
    let arr_palabras = cadena_string.split(" ");
    for (let i = 0; i <arr_palabras.length; i++){
        arr_palabras[i]= arr_palabras[i][0].toUpperCase()+arr_palabras[i].slice(1);} 
    return arr_palabras.join(" ");
}

let variable = "hola mundo";
console.log(capitalize(variable));

//Escribe una función llamada mcd que calcule el máximo común divisor de dos números.

export function mcd(a, b){
    if(b == 0) return a;
    return mcd(b,(a%b));
}

console.log(mcd(24,121));

//Crea una función llamada hackerSpeak que cambie una cadena de texto a
//  'Hacker Speak'. Por ejemplo, para la cadena 'Javascript es divertido', 
// su hacker speak es: 'J4v45c1pt 35 d1v3rt1d0'

export function hackerSpeak (texto){

    let nuevo_texto = texto.replace(/a/g,"4");
    let nnuevo = nuevo_texto.replace(/e/g,"3");
    let nnnuevo = nnuevo.replace(/s/g,"5");
    let nnnnuevo = nnnuevo.replace(/i/g,"1");
    let nnnnnuevo =  nnnnuevo.replace(/o/g,"0");

    return nnnnnuevo;
    
}
console.log(hackerSpeak("Hola mundo "))

//Escribe una función llamada factorize que reciba un número,
//  y regrese una lista con todos sus factores. Por ejemplo:
// factorize(12) -> [1, 2, 3, 4, 6, 12].

export function factorize(n){
    let lista_factores = [];
    for (let i = 1; i <=n; i++){
        if (n%i===0){
            lista_factores.push(i);
        }
    }
    return lista_factores
}
console.log(factorize(12));



//Escribe una función llamada deduplicate que quite los elementos duplicados de un arreglo
//  y regrese una lista con los elementos que quedan. Por ejemplo:
// deduplicate([1, 0, 1, 1, 0, 0]) -> [1, 0]

export function deduplicate(arr){
    const arraySinDuplicados = [...new Set(arr)];
    return arraySinDuplicados;
}

console.log(deduplicate([1,0,1,1,0,0]));

//Escribe una función llamada findShortestString que reciba como parámetro una lista de cadenas de texto,
//  y regrese la longitud de la cadena más corta.

const listaDeCadenas = ["hola", "mundo", "javascript", "a"];
export function findShortestString(arr){
    let n = arr.length;

    let j = 0;
    for (let i= 1; i <n; i++){
        if(arr[i].length<arr[j].length){
            j = i;
        }
    }
    return arr[j].length;
}

console.log(findShortestString(listaDeCadenas));

//Escribe una función llamada isPalindrome que revise si una cadena de texto es un palíndromo o no.
export function isPalindrome(palabra){
    let palabra_reverse = "";
    for (let i = palabra.length-1; i>= 0; i--){
        palabra_reverse += palabra[i];
    }
    if(palabra === palabra_reverse){
        console.log ("La Palabra", palabra, "es un palindromo");
        return true;
    }
    else{ console.log("La palabra", palabra, "No es un palindormo");
        return false;
    }
}
isPalindrome("anilina"); 


//Escribe una función llamada sortStrings que tome una lista de cadena de textos
// y devuelva una nueva lista con todas las cadenas en orden alfabético.
export function sortStrings(arreglo) {
    let n = arreglo.length;  
    console.log("Estado inicial del arreglo:");  // En JS usamos console.log en lugar de print
    console.log(arreglo);

    for (let i = 0; i < n - 1; i++) {

        for (let j = 0; j < n - 1 - i; j++) {
            if (arreglo[j].toLowerCase() > arreglo[j + 1].toLowerCase()) {  
                swap(arreglo, j, j + 1);
            }
        }
    }
    
    return arreglo;
}


const listaDeStrings = ["Zebra", "abeja", "Mango", "banana"];
console.log(sortStrings(listaDeStrings));

//Escribe una función llamada stats que tome una lista de números 
// y devuelva una lista con dos elementos: la mediana y la moda. Por ejemplo:
// stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]) -> [ 7.2, 8 ]


export function stats (numbers){
    let mediana;
    const moda_mediana = [];
    const arr_ordenado = bubbleSort(numbers);
    let n = arr_ordenado.length;
    let mitadArr = Math.trunc(n/2);
    if(n %2 === 0){
        mediana = ((arr_ordenado[mitadArr-1]+arr_ordenado[mitadArr])/2);
        moda_mediana.push(mediana);
    }
    else{ mediana = arr_ordenado[mitadArr];
          moda_mediana.push(mediana);
    }
    let media = 0;
    for (let i of numbers){
        media = media +i;
        
    }
    media = media/(numbers.length);

    const diccionario = {};
    for (let number of numbers){
        if(diccionario[number]){
            diccionario[number]+=1;
        }else{
            diccionario[number] =1; 
        }
        
    }

    let bigcount = null;
    let bigword = null;
    for(let [word, count] of Object.entries(diccionario)){
    if(bigcount == null || count >bigcount){
        bigword = word;
        bigcount = count;
    }
}
    const moda = Number(bigword);
    return [media,moda];
    
}

const estadisticas = [8, 4, 2, 6, 8, 13, 17, 2, 4, 8]


console.log(stats(estadisticas));

//Escribe una función llamada popularString que tome una 
// lista de cadenas de texto y devuelva la cadena más frecuente.

export function popularString(listaTextos){
    const diccionario = {};
    for (let palabra of listaTextos){
        if(diccionario[palabra]){
            diccionario[palabra]+=1;
        }else{
            diccionario[palabra] =1; 
        }
        
    }

    let bigcount = null;
    let bigword = null;
    for(let [word, count] of Object.entries(diccionario)){
    if(bigcount == null || count >bigcount){
        bigword = word;
        bigcount = count;
    }
}
    return bigword;
}

const listaDePalabra = ["hola", "mundo", "javascript", "a","b","a"];
console.log(popularString(listaDePalabra));


//Escribe una función llamada isPowerOf2 que tome un número 
//y devuelva verdadero si es una potencia de dos, falso de lo contrario.
export function isPowerOf2(n){
    if(n === 1){
        return true;
    }
    if(n<=0 || !Number.isInteger(n)){return false;}
    else{
        return isPowerOf2(n/2)
    }
}

console.log(isPowerOf2(7))

//Escribe una función llamada sortDescending que tome una lista de números
// y devuelva una nueva lista con todos los números en orden descendente.

export function sortDescending(arra){
    let n = arra.length;  //  .length
    console.log("Estado inicial del arreglo:");
    console.log(arra);

    for (let i = 0; i < n - 1; i++) {

        for (let j = 0; j < n - 1 - i; j++) {
            if (arra[j] < arra[j + 1]) {  // Faltaba la condición de comparación
                swap(arra, j, j + 1);
            }
        }
    }
    
    return arra;
}

console.log(sortDescending(numeros));