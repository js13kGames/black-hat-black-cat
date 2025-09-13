import Conductor from '../bandjs/band-js'

export default () => {
  const baseSong = {
    timeSignature: [2, 2] as [number, number],
    tempo: 104,
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
        name: 'square',
        pack: 'oscillators',
      },
    },
  }

  const bassPart = [
    'quarter|D5',
    'quarter|D5',
    'quarter|rest',
    'quarter|D5',

    'quarter|F5',
    'quarter|D5',
    'quarter|rest',
    'quarter|D5',

    'quarter|D5',
    'quarter|D5',
    'quarter|rest',
    'quarter|D5',

    'quarter|C5',
    'quarter|D5',
    'quarter|rest',
    'quarter|D5',
  ]

  const left = 'quarter|A1'
  const down = 'quarter|B1'
  const up = 'quarter|C1'
  const right = 'quarter|D1'

  const arrowPart = [
    left, // L
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    up, // U
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    right, // R
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    down, // D
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',
  ]

  arrowPart.push(
    left, // L
    'quarter|rest',
    right,
    'quarter|rest',

    up, // U
    'quarter|rest',
    down,
    'quarter|rest',

    right, // R
    'quarter|rest',
    left,
    'quarter|rest',

    down, // D
    'quarter|rest',
    up,
    'quarter|rest'
  )

  const arrowPartNotes = [
    'quarter|D5', // L
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    'quarter|F5', // U
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    'quarter|E5', // R
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',

    'quarter|C5', // D
    'quarter|rest',
    'quarter|rest',
    'quarter|rest',
  ]

  arrowPartNotes.push(
    'quarter|D5', // L
    'quarter|rest',
    'quarter|D5',
    'quarter|rest',

    'quarter|F5', // U
    'quarter|rest',
    'quarter|F5',
    'quarter|rest',

    'quarter|E5', // R
    'quarter|rest',
    'quarter|E5',
    'quarter|rest',

    'quarter|C5', // D
    'quarter|rest',
    'quarter|C5',
    'quarter|rest'
  )

  const drumPart = ['quarter', 'quarter|rest']

  const repeatedBass = []
  const repeatedRests = []
  const repeatedArrows = []
  const repeatedArrowPartNotes = []
  const repeatedDrums = []

  new Array(5).fill(0).forEach(() => repeatedBass.push(...bassPart))
  new Array(8).fill(0).forEach(() => repeatedRests.push('quarter|rest'))
  new Array(4).fill(0).forEach(() => repeatedArrows.push(...arrowPart))
  new Array(4)
    .fill(0)
    .forEach(() => repeatedArrowPartNotes.push(...arrowPartNotes))
  new Array(4).fill(0).forEach(() => repeatedDrums.push(...drumPart))

  const song = {
    ...baseSong,
    notes: {
      leftHand: [...repeatedRests, ...repeatedBass],
      rightHand: [...repeatedRests, ...repeatedArrowPartNotes],
      drum: [...repeatedDrums],
      arrows: [...repeatedRests, ...repeatedArrows],
    },
  }

  const conductor = new Conductor()

  // Override to use slightly altered version of Player class
  //conductor.finish = () => new Player(conductor)

  const player = conductor.load(song)

  // No volume for arrow notes
  conductor.instruments[3].notes.forEach((note) => (note.volumeLevel = 0))

  // Force reset to propagate instrument volume change for already buffered notes
  player.resetTempo()

  return {
    conductor,
    player,
    arrowInstrumentIndex: 3,
  }
}
