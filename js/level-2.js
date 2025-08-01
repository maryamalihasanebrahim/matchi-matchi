// VARIABLES
let cards = document.querySelectorAll('.cards')
let fruit = document.querySelectorAll('.fruit')
let start = document.querySelector('.message')
let popup = document.querySelector('.popup')
let flag = false
let firstCard = ''
let firstCardElement = ''
let secondCard = ''
let currentScore = 0
let bestScore = 0
let scoreDisplay = document.querySelector('.score')
let bestDisplay = document.querySelector('.best')
let heartBeat = false
let background = document.querySelectorAll('button')
let firstIndex = 0
let secondIndex = 0
let cardsFinished = false
let board = document.querySelector('.threeBythree')
playAgain = document.createElement('button')
let interval
let timerOn = true
let timerWorking = true
let targetDate = undefined
const match = new Audio('images/90s-game-ui-6-185099.mp3')
const nextLevel = new Audio('images/level-up-05-326133.mp3')
const wrong = new Audio('images/wrong_answer.mp3')

// FUNCTIONS
const updateTimer = () => {
  const now = new Date().getTime()
  const difference = targetDate - now

  if (difference < 0) {
    document.getElementById('time').innerHTML = 'time over!'
    board.style.opacity = '0'
    popup.appendChild(playAgain).innerText = 'play again'
    playAgain.style.visibility = 'visible'
    lostWantsToPlayAgain()
    timerOn = false
    clearInterval(interval)
    return
  }
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  document.getElementById('time').innerHTML = `${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const lostWantsToPlayAgain = () => {
  playAgain.addEventListener('mouseover', () => {
    playAgain.style.opacity = '0.5'
  })
  playAgain.addEventListener('mouseout', () => {
    playAgain.style.opacity = '1'
  })
  playAgain.addEventListener('click', () => {
    playAgain.style.display = 'none'
    board.style.opacity = '1'
    for (let i = 0; i < cards.length; i++) {
      sessionStorage.setItem('bestScoreOfPlayer', bestScore)
      background[i].style.backgroundColor = '#3A2222'
      window.location.href = 'play_again_level_2.html'
    }
  })
}

const stopTimer = () => {
  document.getElementById('time').innerHTML = 'good job!'
  clearInterval(interval)
  timerWorking = false
  timerOn = false
}
// the following is taken from https://marina-ferreira.github.io/tutorials/js/memory-game/
shuffle = () => {
  cards.forEach((card) => {
    let ramdomPos = Math.floor(Math.random() * 12)
    card.style.order = ramdomPos
  })
}

updateScore = () => {
  match.play()
  currentScore++
  bestScore++
  scoreDisplay.innerText = 'new: ' + currentScore
  bestDisplay.innerText = 'best: ' + bestScore
  setTimeout(() => {
    if (currentScore >= 10) {
      stopTimer()
      currentScore = 0
      heartBeat = false
      board.style.opacity = '0'
      popup.innerText = 'you win!'
      popup.appendChild(playAgain).innerText = 'play level 3'
      playAgain.style.visibility = 'visible'
      hoverOverPlayAgain()
    }
  }, 400)
  return
}

let halfFlip = (firstIndex, secondIndex) => {
  if (firstCard !== secondCard.id) {
    setTimeout(() => {
      fruit[firstIndex].style.opacity = '0'
      fruit[secondIndex].style.opacity = '0'
      background[firstIndex].style.backgroundColor = '#3A2222'
      background[secondIndex].style.backgroundColor = '#3A2222'
    }, 1000)
    popup.innerText = 'try again'
    wrong.play()
    popup.style.opacity = '1'
    setTimeout(() => {
      popup.innerText = ''
    }, 1000)
  }
  return
}

let hoverOverPlayAgain = () => {
  playAgain.addEventListener('mouseover', () => {
    playAgain.style.opacity = '0.5'
  })
  playAgain.addEventListener('mouseout', () => {
    playAgain.style.opacity = '1'
  })
  playAgain.addEventListener('click', () => {
    playAgain.style.display = 'none'
    board.style.opacity = '1'

    for (let i = 0; i < cards.length; i++) {
      nextLevel.play()
      popup.style.margin = '10px 10px 15px 10px'
      background[i].style.backgroundColor = '#3A2222)'
    }
    setTimeout(() => {
      window.location.href = 'level-3.html'
    }, 1000)
  })
}

let flippingAction = (firstIndex, secondIndex) => {
  if (firstCard === secondCard.id) {
    fruit[firstIndex].style.opacity = '1'
    fruit[secondIndex].style.opacity = '1'
    background[firstIndex].style.backgroundColor = 'white'
    background[secondIndex].style.backgroundColor = 'white'
    updateScore()
    firstCard = ''
    secondCard = ''
    firstCardElement = ''
    return
  } else {
    halfFlip(firstIndex, secondIndex)
  }
}

const startGame = () => {
  timer()
  firstCard = ''
  firstCardElement = ''
  secondCard = ''
  flag = true
  for (let i = 0; i < cards.length; i++) {
    if (flag) {
      fruit[i].style.opacity = '1'
            cards[i].style.backgroundColor = 'white'
      setTimeout(() => {
        fruit[i].style.opacity = '0'
              cards[i].style.backgroundColor = '#3A2222'
      }, 2000)
    }
  }

  setTimeout(() => {
    popup.style.opacity = '1'
    popup.innerText = 'pick your first card'
  }, 2000)
  heartBeat = true
  heartOfTheGame()
}

setTimeout(() => {
  popup.innerText = 'ready?'
}, 1000)
setTimeout(() => {
  popup.innerText = 'set.'
}, 2000)
setTimeout(() => {
  popup.innerText = 'go!'
  startGame()
}, 3000)

const heartOfTheGame = () => {
  if (timerOn) {
    shuffle()
    for (let i = 0; i < cards.length && heartBeat; i++) {
      cards[i].addEventListener('click', () => cardGame(i))
    }
  }
}

const cardGame = (i) => {
  popup.innerText = ''
  // to prevent a card that has been clicked to be clicked again and provide the output of a pair
  if (cards[i] === firstCardElement) {
    return
  }

  if (!firstCard) {
    firstCard = cards[i].id
    firstCardElement = cards[i]
    fruit[i].style.opacity = '1'
    background[i].style.backgroundColor = 'white'
    firstIndex = i
    return
  }
  if (!secondCard) {
    secondCard = cards[i]
    fruit[i].style.opacity = '1'
    background[i].style.backgroundColor = 'white'
    secondIndex = i
    flippingAction(firstIndex, secondIndex)
    firstCard = ''
    secondCard = ''
    firstCardElement = ''
    return
  }
}
const timer = () => {
  if (timerWorking) {
    // the following segment is taken from https://docs.vultr.com/javascript/examples/create-countdown-timer
    targetDate = new Date().getTime() + 1000 * 60

    interval = setInterval(updateTimer, 1000)
  }
}
