const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let tempo = 110 // BPM
let beatLength = 60 / tempo // seconds per beat

const mainGain = audioCtx.createGain()
mainGain.connect(audioCtx.destination)

// Simple synth voice
function playNote(
  freq,
  duration,
  type = 'sine',
  time = audioCtx.currentTime,
  vol = 0.3
) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, time)

  // Envelope
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration)

  osc.connect(gain).connect(mainGain)
  osc.start(time)
  osc.stop(time + duration)
}

// Percussion helpers
function kick(time) {
  playNote(100, 0.5, 'sine', time, 0.8)
}
function snare(time) {
  const noise = audioCtx.createBufferSource()
  const buffer = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * 0.2,
    audioCtx.sampleRate
  )
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  noise.buffer = buffer

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.4, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(1000, time)

  noise.connect(filter).connect(gain).connect(mainGain)
  noise.start(time)
  noise.stop(time + 0.2)
}
function hihat(time) {
  const noise = audioCtx.createBufferSource()
  const buffer = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * 0.05,
    audioCtx.sampleRate
  )
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  noise.buffer = buffer

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.15, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(5000, time)

  noise.connect(filter).connect(gain).connect(mainGain)
  noise.start(time)
  noise.stop(time + 0.05)
}

// Pattern data
const bassline = [55, 65, 73, 82] // A minor root notes
const melody = [220, 247, 220, 262, 0, 220, 196, 0] // sneaky "typing" melody

// Scheduler
let nextNoteTime = 0
let currentBeat = 0
let stopped = false

function schedule() {
  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    // Kick on beats 0, 4
    if (currentBeat % 8 === 0) kick(nextNoteTime)
    if (currentBeat % 8 === 4) snare(nextNoteTime)
    if (currentBeat % 2 === 0) hihat(nextNoteTime)

    // Bassline every quarter note
    if (currentBeat % 2 === 0) {
      let note = bassline[(currentBeat / 2) % bassline.length]
      playNote(note, 0.4, 'sawtooth', nextNoteTime, 0.3)
    }

    // Melody (8-step sequencer)
    let m = melody[currentBeat % melody.length]
    if (m) playNote(m, 0.2, 'square', nextNoteTime, 0.15)

    nextNoteTime += beatLength / 2 // 8th notes
    currentBeat++
  }

  if (stopped) return

  requestAnimationFrame(schedule)
}

// Start playback
export function startSong() {
  stopped = false
  if (audioCtx.state === 'suspended') audioCtx.resume()
  nextNoteTime = audioCtx.currentTime + 0.1
  currentBeat = 0
  schedule()
}

export function stopSong() {
  console.log('stop song')

  mainGain.gain.setValueAtTime(0, 0)
  stopped = true
}

//document.addEventListener('click', () => startSong())
