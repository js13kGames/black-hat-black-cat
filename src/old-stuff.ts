let current = '',
  typed = '',
  score = 0,
  trace = 0,
  maxTrace = 5
let timeout = null,
  timeLimit = 8000,
  decay = 200
let booting = true
let gameOver = false

const commands = [
  'meow.connect()',
  'hack.pawPrints()',
  "napStack.push('bed')",
  'if(laserPointer):pounce()',
  'furball.encrypt()',
  "tail.log('intruder')",
  'whiskers.splice()',
  'claw.init()',
  'scramble.passcode()',
  'sleep(9)',
]

function newCommand() {
  current = generateCommand()
  typed = ''
  render()
  resetTimer()
}

function render() {
  terminal.innerHTML = `> ${current}\n> ${typed}<span id="inputLine"></span>`
  status.textContent = `score: ${score} | trace: ${trace}/${maxTrace}`
}

function resetTimer() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    trace++
    playSound()
    flashScreen()
    checkGameOver()
    if (!gameOver) newCommand()
  }, timeLimit)
}

function checkGameOver() {
  console.log('check GO', trace, maxTrace)
  if (trace >= maxTrace) {
    terminal.innerHTML = `> CONNECTION TERMINATED\n> FINAL SCORE: ${score}\n\n`
    console.log('GO', terminal.innerHTML)
    document.removeEventListener('keydown', onKeyDown)
    clearTimeout(timeout)
    gameOver = true
    playSound('gameover')

    clearInterval(cancelCatFront)
    catBack()
  }
}

function flashScreen() {
  document.body.classList.add('flash')
  setTimeout(() => document.body.classList.remove('flash'), 100)
}

function onKeyDown(e) {
  if (booting || e.ctrlKey || e.metaKey) return

  if (e.key.length === 1) {
    typed += e.key
    if (current.startsWith(typed)) {
      render()
      if (typed === current) {
        score++
        timeLimit = Math.max(1000, timeLimit - decay)
        newCommand()
      }
    } else {
      trace++
      flashScreen()
      typed = ''
      checkGameOver()
      if (!gameOver) render()
    }
  }
}

const catTerms = [
  'purr',
  'whisker',
  'tail',
  'furball',
  'napStack',
  'yarn',
  'paw',
  'scratch',
  'meow',
  'claw',
  'hiss',
]

const actions = [
  'connect',
  'init',
  'push',
  'log',
  'deploy',
  'encrypt',
  'chase',
  'splice',
  'compile',
  'attack',
  'trace',
]

const args = [
  "'mouse'",
  "'laser'",
  "'bed'",
  "'intruder'",
  "'fish'",
  "'data'",
  "'firewall'",
  "'sock'",
  "'admin'",
]

export function generateCommand() {
  const cat = catTerms[Math.floor(Math.random() * catTerms.length)]
  const act = actions[Math.floor(Math.random() * actions.length)]
  const useArg = Math.random() < 0.5
  if (useArg) {
    const arg = args[Math.floor(Math.random() * args.length)]
    return `${cat}.${act}(${arg})`
  } else {
    return `${cat}.${act}()`
  }
}

const ctx = new (window.AudioContext || window.webkitAudioContext)()

function playSound(type = 'success') {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)

  switch (type) {
    case 'success':
      o.type = 'square'
      o.frequency.value = 880 // A5
      g.gain.setValueAtTime(0.1, ctx.currentTime)
      break
    case 'fail':
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(200, ctx.currentTime)
      g.gain.setValueAtTime(0.2, ctx.currentTime)
      break
    case 'gameover':
      o.type = 'triangle'
      o.frequency.setValueAtTime(100, ctx.currentTime)
      g.gain.setValueAtTime(0.3, ctx.currentTime)
      break
  }

  o.start()
  o.stop(ctx.currentTime + 0.15)
}

document.addEventListener('keydown', onKeyDown)
