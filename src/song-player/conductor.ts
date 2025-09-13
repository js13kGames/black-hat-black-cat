import { Player } from './player-custom'

export class Conductor {
  instruments: any[] = []
  masterVolume: any
  masterVolumeLevel: number = 1
  audioContext: AudioContext
  noteBufferLength: number = 16
  tempo: number = 120
  totalDuration: number = 0
  percentageComplete: number = 0
  currentSeconds: number = 0
  onTickerCallback: (seconds: number) => void = () => {}
  onFinishedCallback: () => void = () => {}

  constructor() {
    this.audioContext = new AudioContext()
    this.masterVolume = this.audioContext.createGain()
    this.masterVolume.gain.value = this.masterVolumeLevel
    this.masterVolume.connect(this.audioContext.destination)
  }

  /**
   * Loads a song and initializes instruments with their notes.
   * @param song - The song object containing tempo, time signature, and notes.
   */
  load(song: any) {
    this.tempo = song.tempo
    this.instruments = Object.keys(song.notes).map((key) => {
      const instrument = {
        name: song.instruments[key].name,
        pack: song.instruments[key].pack,
        notes: song.notes[key].map((note: string) => this.parseNote(note)),
        bufferPosition: 0,
        totalDuration: 0,
        resetDuration: function () {
          this.totalDuration = this.notes.reduce(
            (acc: number, note: any) => acc + (note.duration || 0),
            0
          )
        },
        instrument: {
          createNote: (gain: any) => {
            const oscillator = this.audioContext.createOscillator()

            // Set the oscillator type based on the instrument's name
            switch (instrument.name) {
              case 'sine':
                oscillator.type = 'sine'
                break
              case 'square':
                oscillator.type = 'square'
                break
              case 'triangle':
                oscillator.type = 'triangle'
                break
              case 'sawtooth':
                oscillator.type = 'sawtooth'
                break
              default:
                console.warn(
                  `Unknown instrument type: ${instrument.name}, defaulting to sine.`
                )
                oscillator.type = 'sine'
            }

            // Connect the oscillator to the gain node
            oscillator.connect(gain)

            // Return the oscillator node
            return {
              start: (time: number) => oscillator.start(time),
              stop: (time: number) => oscillator.stop(time),
            }
          },
        },
      }
      instrument.resetDuration()
      return instrument
    })
    return this.finish()
  }

  /**
   * Parses a note string into a structured object.
   * @param note - The note string (e.g., "quarter|D5").
   * @returns The parsed note object.
   */
  parseNote(note: string) {
    const [duration, pitch] = note.split('|')
    return {
      duration: this.getDuration(duration),
      pitch: pitch || false,
      volumeLevel: 1,
    }
  }

  /**
   * Converts a note duration string into a numerical value.
   * @param duration - The duration string (e.g., "quarter").
   * @returns The numerical duration value.
   */
  getDuration(duration: string) {
    const durationMap: { [key: string]: number } = {
      whole: 4,
      half: 2,
      quarter: 1,
      eighth: 0.5,
      sixteenth: 0.25,
    }
    return durationMap[duration] || 0
  }

  /**
   * Finalizes the Conductor setup and returns a Player instance.
   * @returns The Player instance.
   */
  finish() {
    return new Player(this)
  }
}
