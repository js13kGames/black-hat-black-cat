export class BasicSongRenderer {
  public canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private columns: number
  private columnWidth: number
  private items: { text: string; column: number; startTime: number }[]
  private songStartTime: number
  public songElapsedTime: number
  private itemHeight: number
  private speed: number
  private song: any
  public activeHits: { [key: number]: number }
  public activeMisses: { [key: number]: number }

  constructor(columns = 4, speed = 100) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.id = 'notes-canvas'
    canvas.width = 800
    canvas.height = 600
    document.body.appendChild(canvas)

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.columns = columns
    this.columnWidth = this.canvas.width / this.columns
    this.items = []
    this.songStartTime = 0
    this.songElapsedTime = 0
    this.itemHeight = 14 // Height of each item
    this.speed = speed // Speed of descent (pixels per second)
    this.activeHits = { 0: 0, 1: 0, 2: 0, 3: 0 }
    this.activeMisses = { 0: 0, 1: 0, 2: 0, 3: 0 }
  }

  start(songStartTime: number, song) {
    this.song = song
    this.songStartTime = songStartTime
    this.songElapsedTime = 0
    this.items = []
    this.clearCanvas()
  }

  addItem(text: string, column: number, startTime: number) {
    if (column < 0 || column >= this.columns) {
      throw new Error(
        `Invalid column: ${column}. Must be between 0 and ${this.columns - 1}.`
      )
    }
    this.items.push({ text, column, startTime })
  }

  update(currentTime: number) {
    this.songElapsedTime = currentTime - this.songStartTime
    this.clearCanvas()
    this.renderItems()
    this.renderLines()
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private renderItems() {
    //console.log('render items')

    this.items.forEach((item) => {
      const elapsedSinceStart = this.songElapsedTime - item.startTime * 1000
      if (elapsedSinceStart >= -20000) {
        const x = item.column * this.columnWidth + this.columnWidth / 2
        const y = elapsedSinceStart * this.speed + this.canvas.height - 50

        if (y < this.canvas.height) {
          this.drawText(item.text, x, y)
        }
      }
    })
  }

  public getItemY(item) {
    const elapsedSinceStart = this.songElapsedTime - item.startTime * 1000

    return elapsedSinceStart * this.speed + this.canvas.height - 50
  }

  private renderLines() {
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
    this.ctx.fillStyle = 'rgba(0, 255, 0, 1)'

    const drives = ['A', 'S', 'D', 'F']

    this.ctx.fillText(`${drives[0]}:/`, 15, this.canvas.height - 50)

    for (let i = 1; i < this.columns; i++) {
      const x = i * this.columnWidth
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.canvas.height)
      this.ctx.stroke()

      this.ctx.fillText(`${drives[i]}:/`, x + 15, this.canvas.height - 50)
    }

    this.ctx.beginPath()
    this.ctx.moveTo(0, this.canvas.height - 70)
    this.ctx.lineTo(this.canvas.width, this.canvas.height - 70)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(0, this.canvas.height - 30)
    this.ctx.lineTo(this.canvas.width, this.canvas.height - 30)
    this.ctx.stroke()

    // Draw hit effects
    for (let i = 0; i < this.columns; i++) {
      if (this.activeHits[i] > 0) {
        const x = i * this.columnWidth
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
        this.ctx.fillRect(x, 0, this.columnWidth, this.canvas.height)
        this.activeHits[i]--
      }
    }

    // Draw miss effects
    for (let i = 0; i < this.columns; i++) {
      if (this.activeMisses[i] > 0) {
        const x = i * this.columnWidth
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.ctx.fillRect(x, 0, this.columnWidth, this.canvas.height)
        this.activeMisses[i]--
      }
    }
  }

  private drawText(text: string, x: number, y: number) {
    this.ctx.font = `${this.itemHeight}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = 'rgba(0, 255, 0, 1)'
    this.ctx.fillText(text, x, y)
  }

  public destroy() {
    this.canvas.remove()
  }

  public hitColumn(column: number) {
    console.log('hit column')

    this.activeHits[column] = 5 // Number of frames to show hit effect
  }

  public missColumn(column: number) {
    console.log('miss column')

    this.activeMisses[column] = 5 // Number of frames to show hit effect
  }
}
