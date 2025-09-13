import { catFront } from './ascii-cat-front'
import { startSong as introSong } from './music'
import { createSongMenu } from './song-menu'
import { WavyText } from './wavy-text'

const terminal = document.getElementById('terminal') as HTMLCanvasElement
const status = document.getElementById('status')

function typeLines(lines, callback, delay = 500) {
  let i = 0
  function next() {
    if (i < lines.length) {
      terminal.textContent += lines[i++] + '\n'
      setTimeout(next, delay)
    } else {
      callback()
    }
  }
  next()
}

function bootSequence() {
  const bootLines = [
    'BL@CK C@T SYSTEM v0.13',
    'Initializing...',
    'Patching firewall claws...',
    'Uploading furball payload...',
    'Injecting pawprints...',
    'Ready. Bap to start.\n',
  ]
  terminal.textContent = ''
  typeLines(
    bootLines,
    () => {
      booting = false

      let baps = 0

      let wavyText
      let cancelCatFront

      const onBap = () => {
        if (baps) {
          createSongMenu()

          if (cancelCatFront) cancelCatFront()
          if (wavyText) wavyText.destroy()

          document.removeEventListener('keydown', onBap)
          document.removeEventListener('click', onBap)
        } else {
          terminal.textContent = ''

          wavyText = new WavyText('Bl@ck H@t // Bl@ck C@t', 0)
          cancelCatFront = catFront()

          introSong()
        }

        baps++
      }

      document.addEventListener('keydown', onBap)
      document.addEventListener('click', onBap)
    },
    400
  )
}

bootSequence()
