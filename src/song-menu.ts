import basic from './songs/basic'
import peppermint from './songs/peppermint'
import { startSong } from './start-song'
import { stopSong as stopIntroSong } from './music'
import './styles/song-menu.css'
//import keyboardCat from './songs/keyboard-cat'

// Data for songs and their tempos
const songs = [
  { name: 'Basic Baps', tempos: [60, 80, 100], factory: basic },
  { name: 'Catnip', tempos: [70, 90, 110], factory: peppermint },
  //{ name: 'Keyboard Cat', tempos: [60, 80, 100], factory: keyboardCat },
]

// Create and manage the UI
export function createSongMenu() {
  const app = document.body

  // Create container
  const container = document.createElement('div')
  container.className = 'container'

  // Create title
  const title = document.createElement('h2')
  title.textContent = 'Attack Pattern'
  container.appendChild(title)

  // Create song button list
  const songList = document.createElement('div')
  songList.className = 'song-list'
  container.appendChild(songList)

  // Create tempo button list (hidden initially)
  const tempoList = document.createElement('div')
  tempoList.className = 'tempo-list'
  tempoList.style.display = 'none' // Hidden initially
  container.appendChild(tempoList)

  // Create output paragraph
  const output = document.createElement('p')
  output.id = 'output'
  container.appendChild(output)

  // Populate the song buttons
  songs.forEach((song) => {
    const songButton = document.createElement('button')
    songButton.textContent = song.name
    songButton.className = 'song-button'
    songButton.addEventListener('click', () => {
      // Show tempos for the selected song
      showTempos(song)
    })
    songList.appendChild(songButton)
  })

  // Function to show tempos for a selected song
  function showTempos(song: { name: string; tempos: number[]; factory: any }) {
    // Clear the tempo list
    tempoList.innerHTML = ''
    tempoList.style.display = 'block' // Show the tempo list

    // Clear the songs list
    songList.style.display = 'none' // Hide the song list

    // Populate the tempo buttons
    song.tempos.forEach((tempo) => {
      const tempoButton = document.createElement('button')
      tempoButton.textContent = `${tempo} BPM`
      tempoButton.className = 'tempo-button'
      tempoButton.addEventListener('click', () => {
        // Display the selected song and tempo
        output.textContent = `You selected: ${song.name} at ${tempo} BPM`

        // Start the song
        const songInstance = song.factory()

        stopIntroSong()

        songInstance.name = song.name

        startSong(songInstance, tempo)

        destroySongMenu(container)
      })
      tempoList.appendChild(tempoButton)
    })

    // Update the output to show the selected song
    output.textContent = `You selected: ${song.name}`
  }

  // Append container to the app
  app.appendChild(container)

  return container
}

export function destroySongMenu(container) {
  container.remove()
}

// Initialize the UI
//createSongMenu()
