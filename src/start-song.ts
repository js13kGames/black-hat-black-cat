import { BasicSongRenderer } from './song-player/basic-renderer'
import { generateCommand } from './old-stuff'
import keys from './keys'
import { WavyText } from './wavy-text'
import { catBack } from './ascii-cat-back'
import { createSongMenu } from './song-menu'

let stats = { hits: 0, misses: 0, total: 0 }
let renderer: BasicSongRenderer | null = null
let wavyText
let destroyCatBack

export const startSong = (song, bpm) => {
  wavyText = new WavyText(song.name, 0)
  destroyCatBack = catBack()

  stats = {
    hits: 0,
    misses: 0,
    total: song.conductor.instruments[3].notes
      .filter(
        (note) =>
          note.pitch &&
          (note.pitch.includes('A1') ||
            note.pitch.includes('B1') ||
            note.pitch.includes('C1') ||
            note.pitch.includes('D1'))
      )
      .reduce(
        (acc, note) =>
          acc + (Array.isArray(note.pitch) ? note.pitch.length : 1),
        0
      ),
  }

  song.conductor.setOnFinishedCallback(() => endLevel())
  console.log('start song', stats)

  song.conductor.setTempo(bpm)
  song.player.resetTempo()

  renderer = new BasicSongRenderer(4, 0.4)

  // Start the renderer when the song starts
  renderer.start(performance.now(), song)

  const getNoteColumn = (pitch) => {
    switch (pitch) {
      case 'A1':
        return 0
      case 'B1':
        return 1
      case 'C1':
        return 2
      case 'D1':
        return 3
      default:
        return -1
    }
  }

  const notes: any[] = []

  const addNote = (note) => {
    if (!note.pitch || getNoteColumn(note.pitch) === -1) return

    renderer?.addItem(
      generateCommand(),
      getNoteColumn(note.pitch),
      note.startTime
    )

    note.column = getNoteColumn(note.pitch)

    notes.push(note)
  }

  song.conductor.instruments[3].notes.forEach((note) => {
    if (Array.isArray(note.pitch)) {
      note.pitch.forEach((p) => addNote({ ...note, pitch: p }))
    } else {
      addNote(note)
    }
  })

  // Update the renderer in an animation loop
  function animate() {
    if (!renderer) return

    renderer.update(performance.now())

    //console.log('keys', keys)

    if (keys['a']?.justDown) {
      console.log('a check')

      notes.forEach((note) => {
        if (note.column === 0) {
          hitCheckNote(note)
        }
      })
    }

    if (keys['s']?.justDown) {
      console.log('s check')

      notes.forEach((note) => {
        if (note.column === 1) {
          hitCheckNote(note)
        }
      })
    }

    if (keys['d']?.justDown) {
      console.log('s check')

      notes.forEach((note) => {
        if (note.column === 2) {
          hitCheckNote(note)
        }
      })
    }

    if (keys['f']?.justDown) {
      console.log('s check')

      notes.forEach((note) => {
        if (note.column === 3) {
          hitCheckNote(note)
        }
      })
    }

    notes.forEach((note) => {
      if (
        !note.hit &&
        !note.miss &&
        (renderer?.getItemY(note) ?? 0) > (renderer?.canvas?.height ?? 900)
      ) {
        stats.misses++
        note.miss = true
        console.log('MISS Out of bounds', note.column, stats)
        renderer?.missColumn(note.column)
      }
    })

    requestAnimationFrame(animate)
  }

  animate()

  song.player.play()
}

function hitCheckNote(note) {
  const noteY = renderer?.getItemY(note) ?? 0
  const lateY = (renderer?.canvas?.height ?? 800) - 30
  const earlyY = (renderer?.canvas?.height ?? 800) - 70

  // console.log('notey', noteY, lateY, earlyY)

  if (noteY < lateY && noteY > earlyY && !note.hit && !note.miss) {
    stats.hits++
    note.hit = true
    console.log('HIT', note.column, stats)

    renderer?.hitColumn(note.column)
  }

  if (noteY < lateY + 50 && noteY > earlyY - 50 && !note.hit && !note.miss) {
    stats.misses++
    note.miss = true
    console.log('MISS', note.column, stats)
    renderer?.missColumn(note.column)
  }
}
function showLevelStateUI(
  onClose: () => void,
  stats: { hits: number; misses: number; total: number }
) {
  const { hits, misses, total } = stats

  // Calculate grade
  let grade = 'o_O'
  const percent = (hits / total) * 100

  if (misses === 0) {
    grade = 'A+'
  } else if (percent >= 90) {
    grade = 'A'
  } else if (percent >= 80) {
    grade = 'B'
  } else if (percent >= 70) {
    grade = 'C'
  } else if (percent >= 60) {
    grade = 'D'
  } else if (percent >= 50) {
    grade = 'F'
  } else if (percent >= 30) {
    grade = 'F-'
  }

  // Create the level state UI
  const levelStateDiv = document.createElement('div')
  levelStateDiv.id = 'level-state-ui'
  levelStateDiv.style.position = 'fixed'
  levelStateDiv.style.top = '0'
  levelStateDiv.style.left = '0'
  levelStateDiv.style.width = '100%'
  levelStateDiv.style.height = '100%'
  levelStateDiv.style.display = 'flex'
  levelStateDiv.style.flexDirection = 'column'
  levelStateDiv.style.justifyContent = 'center'
  levelStateDiv.style.alignItems = 'center'
  levelStateDiv.style.color = 'var(--green-700)'
  levelStateDiv.style.fontSize = '24px'
  levelStateDiv.style.zIndex = '1000'

  levelStateDiv.innerHTML = `
    <div style="text-align: center;">
      <p>Level Complete!</p>
      <p>Hits: ${hits}</p>
      <p>Misses: ${misses}</p>
      <p>Grade: ${grade}</p>
      <button id="close-level-state-ui" style="padding: 10px 20px; font-size: 18px;">Close</button>
    </div>
  `

  document.body.appendChild(levelStateDiv)

  // Add event listener to close the UI
  const closeButton = document.getElementById('close-level-state-ui')
  closeButton?.addEventListener('click', () => {
    document.body.removeChild(levelStateDiv)
    onClose()
  })
}

function endLevel() {
  console.log('end level')
  renderer?.destroy()
  renderer = null
  destroyCatBack?.()
  wavyText?.destroy()
  wavyText = null
  destroyCatBack = null

  // Show the level state UI and call createSongMenu when closed
  showLevelStateUI(() => {
    createSongMenu()
  }, stats) // Pass stats to showLevelStateUI
}
