// The keys and notes variables store the piano keys
const keys = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'high-c-key', 'c-sharp-key', 'd-sharp-key', 'f-sharp-key', 'g-sharp-key', 'a-sharp-key'];
const notes = [];
keys.forEach(function(key){
  notes.push(document.getElementById(key));
})

const keyToNote = {
    'c-key': 'C4',
  'd-key': 'D4',
  'e-key': 'E4',
  'f-key': 'F4',
  'g-key': 'G4',
  'a-key': 'A4',
  'b-key': 'B4',
  'high-c-key': 'C5',
  'c-sharp-key': 'C#4',
  'd-sharp-key': 'D#4',
  'f-sharp-key': 'F#4',
  'g-sharp-key': 'G#4',
  'a-sharp-key': 'A#4'
};

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

// Write named functions that change the color of the keys below
function keyPlay(event){
  event.target.style.backgroundColor = "darkgray";
  // Reproducir la nota correspondiente
  const keyId = event.target.id;
  const note = keyToNote[keyId];
  if (note) {
    synth.triggerAttack(note);
  }
}

function keyReturn(event){
  event.target.style.backgroundColor = "";
    // Detener la nota correspondiente
  const keyId = event.target.id;
  const note = keyToNote[keyId];
  if (note) {
    synth.triggerRelease(note);
  }
}
// Write a named function with event handler properties
function eventAssigment(note){
  note.addEventListener("mousedown", (event)=>{
    keyPlay(event);
  });
  note.addEventListener("mouseup", (event)=>{
    keyReturn(event);
  });
}

// Write a loop that runs the array elements through the function
notes.forEach((note)=>{eventAssigment(note)});

// These variables store the buttons that progress the user through the lyrics
let nextOne = document.getElementById('first-next-line');
let nextTwo = document.getElementById('second-next-line');
let nextThree = document.getElementById('third-next-line');
let startOver = document.getElementById('fourth-next-line');

// This variable stores the '-END' lyric element
let lastLyric = document.getElementById('column-optional');

// These statements are "hiding" all the progress buttons, but the first one
nextTwo.hidden = true;
nextThree.hidden = true;
startOver.hidden= true;

// Write anonymous event handler property and function for the first progress button
nextOne.addEventListener("click", ()=>{nextTwo.hidden = false;
nextOne.hidden = true;
document.getElementById("letter-note-five").innerHTML ="D";
document.getElementById("letter-note-six").innerHTML = "C";});

// Write anonymous event handler property and function for the second progress button
nextTwo.addEventListener("click",()=>{
  nextThree.hidden = false;
  nextTwo.hidden = true;

  document.getElementById("word-five").innerHTML = "DEAR";
  document.getElementById("word-six").innerHTML = "FRI-"; 
  lastLyric.style.display = "inline-block";

  document.getElementById("letter-note-three").innerHTML = "G";
  document.getElementById("letter-note-four").innerHTML = "E";
  document.getElementById("letter-note-five").innerHTML = "C";
  document.getElementById("letter-note-six").innerHTML = "B";
});

// Write anonymous event handler property and function for the third progress button
nextThree.addEventListener("click", ()=>{
  startOver.hidden = false;
  nextThree.hidden = true;

  document.getElementById("word-one").innerHTML = "HAP-";
  document.getElementById("word-two").innerHTML = "PY";
  document.getElementById("word-three").innerHTML = "BIRTH";
  document.getElementById("word-four").innerHTML = "DAY";
  document.getElementById("word-five").innerHTML = "TO";
  document.getElementById("word-six").innerHTML = "YOU!";

  document.getElementById("letter-note-one").innerHTML = "F";
  document.getElementById("letter-note-two").innerHTML = "F";
  document.getElementById("letter-note-three").innerHTML = "E";
  document.getElementById("letter-note-four").innerHTML = "C";
  document.getElementById("letter-note-five").innerHTML = "D";
  document.getElementById("letter-note-six").innerHTML = "C";

  lastLyric.style.display = "none";
});

// This is the event handler property and function for the startOver button
startOver.onclick = function() {
  nextOne.hidden = false;
  startOver.hidden = true;
   document.getElementById('word-one').innerHTML = 'HAP-';
  document.getElementById('letter-note-one').innerHTML = 'G';
  document.getElementById('word-two').innerHTML = 'PY';
  document.getElementById('letter-note-two').innerHTML = 'G';
  document.getElementById('word-three').innerHTML = 'BIRTH-';
  document.getElementById('letter-note-three').innerHTML = 'A';
  document.getElementById('word-four').innerHTML = 'DAY';
  document.getElementById('letter-note-four').innerHTML = 'G';
  document.getElementById('word-five').innerHTML = 'TO';
  document.getElementById('letter-note-five').innerHTML = 'C';
  document.getElementById('word-six').innerHTML = 'YOU!';
  document.getElementById('letter-note-six').innerHTML = 'B';
}