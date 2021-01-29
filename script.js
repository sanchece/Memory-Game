const scores = JSON.parse(localStorage.getItem('Scores')) || []; // scores are pushed to this array which is later stored into local storage
let player = '';

const cards = [
	//array of cards
	'card1',
	'card2',
	'card3',
	'card4',
	'card5',
	'card6',
	'card1',
	'card2',
	'card3',
	'card4',
	'card5',
	'card6'
];
//Fisher-Yates algorithm to shuffle cards
function shuffle(array) {
	let counter = array.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function hideStart() {
	const start = document.getElementById('flex-box');
	start.setAttribute('class', 'hidden');
}
let shuffledCards = shuffle(cards); //this variable holds freshly shuffled cards
let start; // global scope initiated for timer's setInterval function

//button to start game
const startButton = document.getElementById('start-button');
// add click listener to game board
startButton.addEventListener('click', function(e) {
	e.preventDefault();
	hideStart();
	displayScores(); //calls function to display timer and score
	displayCards(shuffledCards); //calls function to display shuffled cards
	start = setInterval(countSecs, 1000);
	player = document.querySelector('#name').value;
});

function displayScores() {
	const gameBoard = document.getElementById('game');
	const time = document.createElement('div'); // creates and build divs for timer and score counter
	time.classList.add('time');
	time.innerText = 'time';
	const timePrint = document.createElement('div');
	timePrint.setAttribute('id', 'timePrint');
	timePrint.innerText = 0;
	const attempts = document.createElement('div');
	attempts.classList.add('score');
	attempts.innerText = 'score';
	const scorePrint = document.createElement('div');
	scorePrint.setAttribute('id', 'scorePrint');
	gameBoard.append(time); //adds freshly created divs to HTML
	time.append(timePrint);
	gameBoard.append(attempts);
	attempts.append(scorePrint);
	countSecs(timePrint);
}

function displayCards(shuffledCards) {
	const gameBoard = document.getElementById('game');
	for (let cardX of shuffledCards) {
		const cardContainer = document.createElement('div'); //card container
		cardContainer.classList.add('card-container');
		const card = document.createElement('div'); //card holding front and back
		card.classList.add('card');
		const front = document.createElement('div'); //front of card
		front.classList.add('front');
		const back = document.createElement('div'); //back of card
		back.classList.add(cardX);
		gameBoard.append(cardContainer); //adds cards to HTML
		cardContainer.append(card);
		card.appendChild(front);
		card.appendChild(back);
	}
	gameBoard.addEventListener('click', handleCardClick); //listens to click to handle card
}

let sec = 0;
function countSecs() {
	//counts seconds when setInterval is initiated
	sec++;
	const timePrint2 = document.querySelector('#timePrint');
	timePrint2.innerText = sec;
}
let tries = 0;
function countTries() {
	//counts tries
	tries++;
	const scorePrint = document.querySelector('#scorePrint');
	scorePrint.innerText = tries;
}

let cardsFlipped = 0;
let cardsMatched = 0;
let card1;
let card2;
function handleCardClick(e) {
	// flips card that was clicked
	countTries();
	let clickedCard = e.target;
	if (clickedCard.className === 'front') {
		//this makes sure clicking your own card won't count as the second flipped card
		cardsFlipped++;
		if (cardsFlipped === 1) {
			//flips first card
			card1 = clickedCard;
			clickedCard.parentElement.classList.add('flip');
		}
		if (cardsFlipped === 2) {
			//flips second card
			card2 = clickedCard;
			clickedCard.parentElement.classList.add('flip');
			checkIfMatch(card1, card2); // checks if first and second card match
		}
	}
}

function checkIfMatch(card1, card2) {
	if (card1.nextElementSibling.className === card2.nextElementSibling.className) {
		cardsMatched++; //counts number of matches (helpful to determine when to stop timer)
		cardsFlipped = 0;
		//	alert("it's a match");
		if (cardsMatched === cards.length / 2) {
			clearInterval(start);
			saveScore();
		}
	} else {
		setTimeout(function() {
			card1.parentElement.classList.remove('flip'); //flips cards back if they are not a match
			card2.parentElement.classList.remove('flip');
			cardsFlipped = 0;
		}, 1000);
	}
}

function saveScore() {
	// saves scores to local Storage
	scores.push({ playerName: player, score: tries });
	localStorage.setItem('Scores', JSON.stringify(scores));
	alert(JSON.stringify(scores));
	location.reload();
}
