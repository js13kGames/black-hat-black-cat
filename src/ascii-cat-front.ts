const asciiCat = `
    _______
  _/_/\\_/\\_\\_
    ( O.o )
     > ^ <
    < | | >
    -------
      //
      \\\\//

`

const asciiCat2 = `
    _______
  _/_/\\_/\\_\\_
    ( O.o )
     > ^ <
    < | | >
    -------
       \\\\
     \\\\//

`

const asciiCat3 = `
    _______
  _/_/\\_/\\_\\_
    ( O.o )
     > ^ <
    < | | >
    -------
       ||
       ||
       ||
`

export function catFront() {
  let catFrame = 0
  const catContainer = document.querySelector('#ascii-cat') as HTMLElement

  const intervalHandle = setInterval(() => {
    if (catFrame === 0 || catFrame === 2) {
      catFrame++
      catContainer.innerHTML = `<pre>${asciiCat3}</pre>`
    } else if (catFrame === 1) {
      catFrame++
      catContainer.innerHTML = `<pre>${asciiCat}</pre>`
    } else {
      catFrame = 0
      catContainer.innerHTML = `<pre>${asciiCat2}</pre>`
    }
  }, 500)

  return () => {
    clearInterval(intervalHandle)
    catContainer.innerHTML = ''
  }
}
