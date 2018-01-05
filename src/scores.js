const baseURL = "https://uno-who-won.herokuapp.com/"
//const baseURL = "http://localhost:3000/scores.html"
const gameURL = "https://uno-who-won.herokuapp.com/games"
//const gameURL = "http://localhost:3000/games"
const scoresURL = "https://uno-who-won.herokuapp.com/scores.html"
//const scoresURL = "http://localhost:3000/scores.html"
let winners = []
let players

fetch(scoresURL)
.then((response) => response.json())
.then(response => {
  players = response
  getWins()
})
.then((response) => {
  console.log(players, 'players')
  console.log(winners, 'winners')
})

function getWins(res){
  fetch(gameURL)
  .then((response) => response.json())
  .then((response) => {
    response.forEach((game) => {
      winners.push(game.gameWinnerId)
    })
    for (var i = 0; i < winners.length; i++) {
      for (var j = 0; j < players.length; j++) {
        if (winners[i] === players[j]['playerId']) {
          players[j]['wins']++
        }
      }
    }
    return displayScores(players)
  })
}

function displayScores(res){
  res.forEach((player) => {
    let container = document.querySelector('.container')

    let playerContainer = document.createElement('div')
      playerContainer.className = 'playerContainer'
      container.appendChild(playerContainer)

    let name = document.createElement('b')
      playerContainer.appendChild(name)
      name.textContent = player.playerName

    let winCount = document.createElement('p')
      playerContainer.appendChild(winCount)
      winCount.className = 'wins'
      winCount.textContent = player.wins
  })
}
