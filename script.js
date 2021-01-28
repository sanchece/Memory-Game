const gameContainer = document.getElementById('game');
const bestAttempts = JSON.parse(localStorage.getItem('bestAttempts')) || [];
const saveName = document.querySelector('#save');
let playerName = '';

saveName.addEventListener('submit', function(e) {
	e.preventDefault();
	playerName = document.querySelector('#nombre').value;
	console.log(playerName);
});

// pairs of memory cards 
const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

// shuffles memory cards
function shuffle(array) {
	// this is the "Fisher-Yates shuffle"
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

let shuffledColors = shuffle(COLORS);

let start;
var sec = 0;
const timer = document.querySelector('#timer');
const attempts = document.querySelector('#attempts');

function addsecs() {
	sec++;
	timer.innerText = sec;
}

function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		const newDiv = document.createElement('div');
		const card = document.createElement('div');
		const front = document.createElement('div');
		const back = document.createElement('div');

		newDiv.classList.add('main');
		card.classList.add('card');
		front.classList.add('front');
		back.classList.add(color);

		newDiv.addEventListener('click', handleCardClick);

		gameContainer.append(newDiv);
		newDiv.appendChild(card);
		card.appendChild(front);
		card.appendChild(back);
	}
}
var counter = 0;
var firstCard = '';
var tries = 0;
var match = 0;

function handleCardClick(event) {
	tries++;
	let nAttempts = tries / 2;
	if (tries % 2 === 0) {
		attempts.innerText = nAttempts;
	}
	if (tries === 1) {
		start = setInterval(addsecs, 1000);
	}

	if (event.target.className === 'front') {
		if (counter < 2) {
			counter += 1;

			console.log('you just clicked', event.target.nextElementSibling.className);
			event.target.parentElement.classList.add('flip');

			if (counter === 1) {
				firstCard = event.target;
			}

			if (counter === 2) {
				secondCard= event.target;
				
				if (firstCard.nextElementSibling.className === secondCard.nextElementSibling.className) {
					console.log("it's a match");
					match++;
					console.log(match);
					counter = 0;
				} else {
					console.log("it's not a match");
					setTimeout(function() {
						event.target.parentElement.classList.remove('flip');
						firstCard.parentElement.classList.remove('flip');
						counter = 0;
					}, 1000);
				}

				if (match === 5) {
					clearInterval(start);
					saveScore(nAttempts);
				}
			}
		}
	}
}

createDivsForColors(shuffledColors);

function saveScore(attemptMatches) {
	let newAttempt = Math.floor(attemptMatches);

	if (bestAttempts.length === 0) {
		bestAttempts.push({ player: playerName, attempts: newAttempt });
	}

	for (let score of bestAttempts) {
		if (newAttempt < score) {
			bestAttempts.push({ player: playerName, attempts: newAttempt });
		}
	}
	localStorage.setItem('bestAttempts', JSON.stringify(bestAttempts));
}

const getScores = document.querySelector('#getScores');

getScores.addEventListener('click', function() {
	alert('High Scores' + JSON.stringify(bestAttempts));
});
