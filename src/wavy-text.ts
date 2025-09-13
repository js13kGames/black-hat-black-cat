export class WavyText {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private text: string
  private animationFrameId: number | null = null
  private offset: number = 0
  private yOffset: number

  constructor(text: string, yOffset: number) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.id = 'wavyCanvas'
    document.body.appendChild(canvas)

    //console.log('WavyText initialized', canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.text = text
    this.yOffset = yOffset

    // Set canvas dimensions
    //this.canvas.width = window.innerWidth;
    //this.canvas.height = window.innerHeight;
    this.canvas.width = 800
    this.canvas.height = 400

    // Start the animation
    this.animate()
  }

  private drawText() {
    const { ctx, canvas, text, offset } = this

    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
    ctx.font = '30px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#00ff00'

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 + this.yOffset

    // Draw each letter with a wave effect
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const x = centerX - (text.length * 20) / 2 + i * 20 // Adjust spacing
      const y = centerY + Math.sin((i + offset) * 0.5) * 10 // Wave effect
      ctx.fillText(char, x, y)
    }
  }

  private animate = () => {
    this.offset += 0.1 // Increment the wave offset
    this.drawText()
    this.animationFrameId = requestAnimationFrame(this.animate)
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }

  public destroy() {
    this.canvas.remove()
  }
}
