const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');

const possibleChoices  = document.querySelectorAll('button');
let userChoice
let computerChoice
let result
possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e)=> 
    {userChoice =  e.target.id
     userChoiceDisplay.innerHTML = userChoice;
     generateComputerChoice()
     getReseult()
    }))

function generateComputerChoice(){
    const randomNumer = Math.floor(Math.random()*3)+1;
    console.log(randomNumer);

    if(randomNumer ===1 ){
        computerChoice = 'rock'
    }
    if(randomNumer===2){
        computerChoice = "scissors"
    }
    if(randomNumer===2){
        computerChoice = "papper"
    }
    computerChoiceDisplay.innerHTML = computerChoice
}

function getReseult(){
    if (computerChoice === userChoice){
        result = "its a draw"
    }
    if (computerChoice === 'rock' && userChoice==='papper'){
        result = 'you win'
    }
    if (computerChoice === 'rock' && userChoice==='scissors'){
        result = 'you lost!'
    }

    if (computerChoice === 'papper' && userChoice==='rock'){
        result = 'you lost!'
    }
    if (computerChoice === 'scissors' && userChoice==='rock'){
        result = 'you lost!'
    }

    if (computerChoice === 'papper' && userChoice==='scissors'){
        result = 'you win!'
    }
    
    console.log(result)
    resultDisplay.innerHTML = result
    
}

