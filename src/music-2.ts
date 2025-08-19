const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let tempo = 110 // BPM
let beatLength = 60 / tempo // seconds per beat

// === SYNTH HELPERS ===
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

  osc.connect(gain).connect(audioCtx.destination)
  osc.start(time)
  osc.stop(time + duration)
}

// Percussion
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

  noise.connect(filter).connect(gain).connect(audioCtx.destination)
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

  noise.connect(filter).connect(gain).connect(audioCtx.destination)
  noise.start(time)
  noise.stop(time + 0.05)
}

// Cat SFX
function meow(time) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(500, time)
  osc.frequency.exponentialRampToValueAtTime(200, time + 0.4)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4)
  osc.connect(gain).connect(audioCtx.destination)
  osc.start(time)
  osc.stop(time + 0.4)
}
function purr(time) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(50, time)
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  lfo.frequency.setValueAtTime(20, time) // tremolo speed
  lfoGain.gain.setValueAtTime(0.2, time)
  lfo.connect(lfoGain).connect(gain.gain)
  gain.gain.setValueAtTime(0.15, time)
  osc.connect(gain).connect(audioCtx.destination)
  osc.start(time)
  lfo.start(time)
  osc.stop(time + 2)
  lfo.stop(time + 2)
}

// === PATTERNS ===
const bassline = [55, 65, 73, 82] // A minor
let melody = [220, 247, 220, 262, 0, 220, 196, 0]

// Scheduler state
let nextNoteTime = 0
let currentBeat = 0

function schedule() {
  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    // Rhythm
    if (currentBeat % 8 === 0) kick(nextNoteTime)
    if (currentBeat % 8 === 4) snare(nextNoteTime)
    if (currentBeat % 2 === 0) hihat(nextNoteTime)

    // Bassline
    if (currentBeat % 2 === 0) {
      let note = bassline[(currentBeat / 2) % bassline.length]
      playNote(note, 0.4, 'sawtooth', nextNoteTime, 0.3)
    }

    // Melody w/ random variation
    let m = melody[currentBeat % melody.length]
    if (m && Math.random() > 0.2) {
      let detune = (Math.random() - 0.5) * 20 // small pitch drift
      playNote(m + detune, 0.2, 'square', nextNoteTime, 0.15)
    }

    // Random meow every 32 beats
    if (currentBeat % 32 === 0 && Math.random() < 0.3) {
      meow(nextNoteTime)
    }

    // Random purr drone every 64 beats
    if (currentBeat % 64 === 0 && Math.random() < 0.5) {
      purr(nextNoteTime)
    }

    // Glitch burst (chaos mode) every ~16 beats
    if (currentBeat % 16 === 0 && Math.random() < 0.25) {
      for (let i = 0; i < 6; i++) {
        playNote(
          300 + Math.random() * 400,
          0.05,
          'square',
          nextNoteTime + i * 0.05,
          0.2
        )
      }
    }

    nextNoteTime += beatLength / 2 // 8th notes
    currentBeat++
  }
  requestAnimationFrame(schedule)
}

// Start playback
function startSong() {
  if (audioCtx.state === 'suspended') audioCtx.resume()
  nextNoteTime = audioCtx.currentTime + 0.1
  currentBeat = 0
  schedule()
}

document.addEventListener('click', () => startSong())
