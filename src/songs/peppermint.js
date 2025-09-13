import Conductor from '../bandjs/band-js'

export default () => {
  const baseSong = {
    timeSignature: [4, 4],
    tempo: 84,
    instruments: {
      leftHand: {
        name: 'triangle',
        pack: 'oscillators',
      },
      rightHand: {
        name: 'square',
        pack: 'oscillators',
      },
      drum: {
        name: 'white',
        pack: 'noises',
      },
      arrows: {
        name: 'pink',
        pack: 'noises',
      },
    },
  }

  const chordAb = 'whole|Ab4,C5,D#5'
  const chordBbm = 'whole|Bb4,C#5,F5'
  const chordDb = 'whole|Db4,F4,G#4'

  // B4 -> C5

  const chords = [
    'whole|rest',

    chordAb,
    chordBbm,
    chordAb,
    chordDb,

    chordAb,
    chordBbm,
    chordAb,
    chordDb,

    chordAb,
    chordDb,
    chordAb,
    chordDb,

    chordAb,
    chordDb,
    chordAb,
    chordDb,
  ]

  const melody = [
    // Intro
    'quarter|C6',
    'quarter|Ab5',
    'quarter|F5',
    'quarter|Eb5',

    // Can I have a peppermint?
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',

    'eighth|Ab5',
    'eighth|Ab5',
    'quarter|C6',

    // You can have a peppermint!
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',

    'eighth|Ab5',
    'eighth|Ab5',
    'quarter|C6',

    // That's too hot for me.
    'quarter|C6',
    'quarter|Bb5',
    'quarter|Ab5',
    'eighth|F5',
    'quarter|Eb5',

    // Bleh. Ahh!
    // 'eighth|Eb5',
    'eighth|rest',
    'quarter|Bb5',
    'quarter|rest',
    // 'eighth|rest',
    'quarter|D#6',

    // I don't like the peppermint.
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',

    'eighth|Ab5',
    'eighth|Ab5',
    'quarter|C6',

    // You don't like the peppermint.
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',
    'eighth|Ab5',

    'eighth|Ab5',
    'eighth|Ab5',
    'quarter|C6',

    // It's too spicy.
    'quarter|C6',
    'quarter|Ab5',
    'eighth|C6',
    'quarter|C6',
    'quarter|Ab5',

    // Well why'd you ask me for a mint?
    'eighth|Bb5',
    'eighth|C6',
    'eighth|C6',
    'eighth|C6',

    'eighth|Bb5',
    'eighth|Ab5',
    'eighth|F5',
    'quarter|Ab5',

    // I don't know.
    'quarter|rest',
    'eighth|Eb6',
    'quarter|F6',
    'quarter|Ab5',

    // When did the spiciness begin?
    'eighth|Bb5',
    'eighth|C6',
    'eighth|C6',
    'eighth|C6',

    'eighth|Bb5',
    'eighth|Ab5',
    'eighth|F5',
    'quarter|Ab5',

    // I don't know.
    'quarter|rest',
    'eighth|Eb6',
    'quarter|F6',
    'quarter|Ab5',

    // Is it all because of me?
    'eighth|Bb5',
    'eighth|C6',
    'eighth|C6',
    'eighth|C6',

    'eighth|Bb5',
    'eighth|Ab5',
    'eighth|F5',
    'quarter|Ab5',

    // I don't know.
    'quarter|rest',
    'eighth|Eb6',
    'quarter|F6',
    'quarter|Ab5',

    // Am I sleeping on the couch?
    'eighth|Bb5',
    'eighth|C6',
    'eighth|C6',
    'eighth|C6',

    'eighth|Bb5',
    'eighth|Ab5',
    'eighth|F5',
    'quarter|C6',

    // Yea.
    'eighth|rest',
    'half|Ab5',
  ]

  const left = 'eighth|A1'
  const down = 'eighth|B1'
  const up = 'eighth|C1'
  const right = 'eighth|D1'

  const arrowPart = [
    // Intro
    'whole|rest',

    // Can I have a peppermint?
    left, // L
    'eighth|Ab5',
    right, // R
    'eighth|Ab5',

    left, // L
    'eighth|Ab5',
    up, // U
    'eighth|rest',

    // You can have a peppermint!
    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',

    right,
    'eighth|Ab5',
    up,
    'eighth|rest',

    // That's too hot for me.
    right,
    'eighth|rest',
    left,
    'eighth|rest',
    right,
    'eighth|rest',
    up,
    'eighth|rest',
    down,
    'eighth|rest',

    // Bleh. Ahh!
    // 'eighth|Eb5',
    'eighth|rest',
    'eighth|A1,B1',
    'eighth|rest',
    'eighth|rest',
    'eighth|C1,D1',
    'eighth|rest',
    // 'quarter|rest',
  ]

  arrowPart.push(
    // I don't like the peppermint.
    left, // L
    'eighth|Ab5',
    right, // R
    'eighth|Ab5',

    left, // L
    'eighth|Ab5',
    up, // U
    'eighth|rest',

    // You don't like the peppermint.
    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',

    right,
    'eighth|Ab5',
    up,
    'eighth|rest',

    // It's too spicy.
    right,
    'eighth|rest',
    left,
    'eighth|rest',
    right,
    'eighth|rest',
    up,
    'eighth|rest',
    down,
    'eighth|rest',

    // Well why'd you ask me for a mint?
    up,
    'eighth|C6',
    down,
    'eighth|C6',

    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',
    left,
    'eighth|rest',

    // I don't know.
    right,
    'eighth|rest',
    up,
    'eighth|rest',
    left,
    'eighth|rest',

    // When did the spiciness begin?
    up,
    'eighth|C6',
    down,
    'eighth|C6',

    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',
    left,
    'eighth|rest',

    // I don't know.
    right,
    'eighth|rest',
    up,
    'eighth|rest',
    left,
    'eighth|rest',

    // Is it all because of me?
    up,
    'eighth|C6',
    down,
    'eighth|C6',

    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',
    left,
    'eighth|rest',

    // I don't know.
    right,
    'eighth|rest',
    up,
    'eighth|rest',
    left,
    'eighth|rest',

    // Am I sleeping on the couch?
    up,
    'eighth|C6',
    down,
    'eighth|C6',

    right,
    'eighth|Ab5',
    left,
    'eighth|Ab5',
    left,
    'eighth|rest',

    // Yea..
    down
  )

  const song = {
    ...baseSong,
    notes: {
      leftHand: [...chords],
      rightHand: [...melody],
      arrows: [...arrowPart],
    },
  }

  const conductor = new Conductor()

  // Override to use slightly altered version of Player class
  // conductor.finish = () => new Player(conductor)

  const player = conductor.load(song)

  conductor.instruments[0].notes.forEach((note) => {
    note.volumeLevel = 0.1
  })

  // No volume for arrow notes
  conductor.instruments[3].notes.forEach((note) => {
    note.volumeLevel = 0
  })

  // Force reset to propagate instrument volume change for already buffered notes
  player.resetTempo()

  return {
    conductor,
    player,
  }
}
