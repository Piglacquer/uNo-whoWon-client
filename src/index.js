const baseURL = 'https://uno-who-won.herokuapp.com/scores.html'
const gamesURL = 'https://uno-who-won.herokuapp.com/games'
const body = document.querySelector('body')
let playerAmount
let pastPlayerNames = []
let currentPlayerNames = []
let playerScores = []
let scoreThreshold

get()
thresholdListener()
playerNumberToUrl()
populatePlayerInputs()

function get() {
	fetch(baseURL)
		.then(response => response.json())
		.then(response => {
			addPastPlayers(response)
		})
		.catch(err => console.log(err))
}

function populatePlayerDropdown(parent) {
	pastPlayerNames.forEach(player => {
		domCreateAndAppend('option', parent, player)
	})
}

// ADD SOMETHING TO PREVENT SAME PLAYER NAMES
function listenForPlayerNames(element) {
	element.addEventListener('change', function() {
		currentPlayerNames.push(element.value)
	})
}

function addPastPlayers(resp) {
	resp.forEach(player => {
		pastPlayerNames.push(player.playerName)
	})
}

function thresholdListener() {
	let thresholdSelector = document.querySelector('.scoreThreshold')
	thresholdSelector.addEventListener('change', function(event) {
		scoreThreshold = parseInt(event.target.value)
		wipePage(thresholdSelector)
	})
}

function playerNumberToUrl() {
	var players = document.querySelectorAll('.numberOfPlayers')
	return players.forEach(playerNumber => {
		playerNumber.addEventListener('click', event => {
			window.location.hash = playerNumber.value
			playerAmount = window.location.hash.split('#')[1]
		})
	})
}

function populatePlayerInputs() {
	let submit = document.querySelector('.submit')
	let form = document.querySelector('form')
	let div = document.querySelector('div')
	let body = document.querySelector('body')
	let title = document.querySelector('h1')
	let next = document.querySelector('#newNext')

	submit.addEventListener('click', function() {
		wipePage(form)

		let newForm = document.createElement('form')
		div.appendChild(newForm)

		for (var i = 0; i < playerAmount; i++) {
			let container = document.createElement('div')
			container.id = 'player'
			newForm.appendChild(container)

			let label = document.createElement('label')
			label.innerText = 'player ' + [i + 1]
			container.appendChild(label)

			let select = document.createElement('select')
			select.id = 'playerName'
			select.type = 'text'

			domCreateAndAppend('option', select, 'select player')
			populatePlayerDropdown(select)
			listenForPlayerNames(select)
			container.appendChild(select)
		}

		createNewNext(body, 'newNext', 'next', function() {
			wipePage(div)
			wipePage(title)

			let next = document.getElementById('newNext')
			next.parentNode.removeChild(next)
			scoreboard(currentPlayerNames, body)
		})
	})
}

function wipePage(parent) {
	parent.parentNode.removeChild(parent)
}

function createNewNext(parent, id, value, func) {
	let newNext = document.createElement('input')
	newNext.id = id
	newNext.type = 'submit'
	newNext.value = value
	parent.appendChild(newNext)
	newNext.addEventListener('click', func)
}

function scoreboard(array) {
	domCreateAndAppend('h1', body, 'Uno What Time It Is')
	domCreateAndAppend('div', body, '', 'playersAndScoresSection')

	array.forEach((player, i) => {
		domCreateAndAppend(
			'div',
			document.querySelector('.playersAndScoresSection'),
			'',
			'player' + [i]
		)
		domCreateAndAppend('label', document.querySelector('.player' + [i]), player)
		domCreateAndAppend('input', document.querySelector('.player' + [i]), '', 'newPlayerScores')
		domCreateAndAppend('b', document.querySelector('.player' + [i]), 0)
		let playerScore = []
		playerScores.push(playerScore)
	})
	let inputs = document.querySelectorAll('input')
	inputs.forEach(input => {
		input.type = 'number'
	})
	tallyButton()
}

function tallyButton() {
	let newScores = document.querySelectorAll('.newPlayerScores')
	let currentScore = document.querySelectorAll('b')
	domCreateAndAppend('input', document.querySelector('body'), '', 'tally')

	let tally = document.querySelector('.tally')
	tally.type = 'submit'
	tally.value = 'tally'
	tally.addEventListener('click', function(event) {
		event.preventDefault()
		let freshScoresArray = []

		newScores.forEach(score => {
			freshScoresArray.push(score.value)
		})

		for (var i = 0; i < playerScores.length; i++) {
			playerScores[i].push(parseInt(freshScoresArray[i]))
		}

		playerScores.forEach((player, i) => {
			let score = player.reduce((accumulator, currentValue) => {
				return accumulator + currentValue
			}, 0)
			currentScore[i].innerText = score
		})

		checkScore()
		resetNewScores()
	})
}

function resetNewScores() {
	let newScores = document.querySelectorAll('.newPlayerScores')
	newScores.forEach(player => {
		player.value = ''
	})
}

function domCreateAndAppend(element, parent, textContent, className) {
	let create = document.createElement(element)
	parent.appendChild(create)
	create.innerText = textContent
	create.className += className
}

function checkScore() {
	let scores = document.querySelectorAll('b')
	scores.forEach(score => {
		if (parseInt(score.textContent) >= scoreThreshold) {
			whoIsWinner()
		}
	})
}

function whoIsWinner() {
	let players = document.querySelector('.playersAndScoresSection').childNodes
	let scores = []
	let winnerText = document.querySelector('h1')

	for (var i = 0; i < players.length; i++) {
		scores.push(parseInt(players[i].childNodes[2].textContent))
	}

	let winnerScore = scores.reduce(function(a, b) {
		return Math.min(a, b)
	})

	for (var j = 0; j < players.length; j++) {
		if (winnerScore == players[j].childNodes[2].textContent) {
			winnerText.value = players[j].childNodes[0].textContent
			winnerText.textContent = players[j].childNodes[0].textContent + ' WINS!'
		}
	}
	changeTallyButtonToHome()
}

function changeTallyButtonToHome() {
	let tally = body.lastChild
	wipePage(tally)
	createNewNext(body, 'home', 'Post', post)
}

function addHomeButtonWhenGameOver() {
	domCreateAndAppend('a', body, 'Home', 'anchor')
	let home = document.querySelector('a')
	home.href = 'index.html'
}

async function post() {
	let game = await fetchScores()
	let gameWinner = await changePlayerNameToId()
	fetch(gamesURL, {
		method: 'post',
		body: JSON.stringify({ gameId: game, gameWinnerId: gameWinner }),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
		.then(response => {
			return response.json()
		})
		.catch(err => console.log(err))
	let tally = body.lastChild
	wipePage(tally)
	addHomeButtonWhenGameOver()
}

function fetchScores() {
	return fetch(gamesURL)
		.then(resp => resp.json())
		.then(resp => {
			let gameNumber = resp.length + 1
			return gameNumber
		})
}

function changePlayerNameToId() {
	let playerName = document.querySelector('h1').value
	return fetch(baseURL)
		.then(resp => resp.json())
		.then(resp => {
			for (var i = 0; i < resp.length; i++) {
				if (playerName == resp[i].playerName) {
					return resp[i].playerId
				}
			}
		})
}
