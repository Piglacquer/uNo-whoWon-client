const baseURL = "https://dry-badlands-62759.herokuapp.com/"
const body = document.querySelector('body')
let playerAmount
let playerNames = []
let playerScores = []
let scoreThreshold

playerNumberToUrl()
populatePlayerInputs()

fetch(baseURL)
  .then(response => response.json())
  .then(response => {
    console.log(response)
  })
  .catch(err => console.log(err))

fetch(baseURL,  {
  method: "post",
  body: JSON.stringify({greeting: "hello"}),
  headers: new Headers({
    "Content-Type": "application/json"
  })
})
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.log(err))

function playerNumberToUrl(){
  var players = document.querySelectorAll('.numberOfPlayers')
  return players.forEach(playerNumber => {
    playerNumber.addEventListener('click', (event) => {
      window.location.hash = playerNumber.value
      playerAmount = window.location.hash.split('#')[1]
    })
  })
}

function populatePlayerInputs(){
  let submit = document.querySelector('.submit')
  let form = document.querySelector('form')
  let div = document.querySelector('div')
  let body = document.querySelector('body')
  let title = document.querySelector('h1')
  let next = document.querySelector('#newNext')

  submit.addEventListener('click', function(){
    wipePage(form)
    let newForm = document.createElement('form')
    div.appendChild(newForm)
    for (var i = 0; i < playerAmount; i++) {
      // domCreateAndAppend('div', newForm, '', 'player')
      let container = document.createElement('div')
      container.id = 'player'
      newForm.appendChild(container)
      // domCreateAndAppend('label', document.querySelector('.player'), 'player ' +[i+1])
      let label = document.createElement('label')
      label.innerText = 'player '+[i+1]
      container.appendChild(label)
      let input = document.createElement('input')
      input.id = 'playerName'
      input.type = 'text'
      input.placeholder = 'name'
      container.appendChild(input)
    }

    createNewNext(body, 'newNext', 'next', function(){
      getPlayerNames()
      wipePage(div)
      wipePage(title)
      let next = document.getElementById('newNext')
      next.parentNode.removeChild(next)
      scoreboard(playerNames, body)
    })
  })
}

function wipePage(parent){
  parent.parentNode.removeChild(parent)
}

function createNewNext(parent, id, value, func){
  let newNext = document.createElement('input')
  newNext.id = id
  newNext.type = 'submit'
  newNext.value = value
  parent.appendChild(newNext)
  newNext.addEventListener('click', func)
}

function getPlayerNames(){
    let playerInputs = document.querySelectorAll('#playerName')
    playerInputs.forEach((player) => {
      playerNames.push(player.value)
    })
}

function scoreboard(array){
  domCreateAndAppend('h1', body, 'Uno What Time It Is')
  domCreateAndAppend('div', body, '', 'playersAndScoresSection')
  array.forEach((player) => {
    domCreateAndAppend('div', document.querySelector('.playersAndScoresSection'), '', 'player')
    domCreateAndAppend('label', document.querySelector('.playersAndScoresSection'), player)
    domCreateAndAppend('input', document.querySelector('.playersAndScoresSection'), '', 'newPlayerScores')
    domCreateAndAppend('b', document.querySelector('.playersAndScoresSection'), 0)
    let playerScore = []
    playerScores.push(playerScore)
  })
  tallyButton()
}

function tallyButton(){
  let newScores = document.querySelectorAll('.newPlayerScores')
  let currentScore = document.querySelectorAll('b')
  domCreateAndAppend('input', document.querySelector('body'), '', 'tally')
  let tally = document.querySelector('.tally')
  tally.type = 'submit'
  tally.value = 'tally'
  tally.addEventListener('click', function(event){
    event.preventDefault()
    let freshScoresArray = []
    newScores.forEach((score) => {
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
  })
}

function domCreateAndAppend(element, parent, textContent, className){
  let create = document.createElement(element)
  parent.appendChild(create)
  create.innerText = textContent
  create.className += className
}

function checkScore(){
  let scores = document.querySelectorAll('b')
  scores.forEach((score) => {
    if(score >= scoreThreshold){
      alert('someone wins')
    }
  })
}
