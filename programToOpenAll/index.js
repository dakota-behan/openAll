const fs = require("fs");
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



var exec = require('child_process').exec;

let path = "D:/xbox_360_games/"

let test = [
  'Halo - Combat Evolved Anniversary',
  'Halo - Reach',
  'Halo 3',
  'Halo 3 - ODST',
  'Halo 4',
  'Hitman - Absolution',
  'Just Dance 2014',
  'L.A. Noire',
  'Left 4 Dead',
  'Left 4 Dead 2',
  'Lollipop Chainsaw',
  'Looney Tunes - Acme Arsenal',
  'Lost Planet - Extreme Condition',
  'Lost Planet 2',
  'Mass Effect',
  'Mass Effect 2 (Disc 1)',
  'Max Payne 3(Disc 1)'
]



rl.question('we testing?', async ans => {
  let isTesting
  if (!ans || ans[0].toLowerCase() == 'n') {
    isTesting = false
  } else {
    isTesting = true
  }

  ; (async () => {
    await new Promise(p => rl.question(`what is the file dir?\n`, (dir) => {
      path = String.raw({ raw: [dir] }).replaceAll("\\", "/");
      p()
    }))
    let files = isTesting ? [...test] :
      fs.readdirSync(path)
        .filter(e => e.endsWith('iso'))
    let referenceObj = {}
    files.forEach(async e => {
      let ogName = e
      let newPathName = e.replaceAll(/\ /g, '%')
      referenceObj[newPathName] = ogName
      console.log(`${path}/${e}`)

      // rename file
      try {
        fs.renameSync(`${path}/${e}`, `${path}/${newPathName}`);
      } catch (er) {
        console.log(
          `\n${'/'.repeat(20)}\nthere was an error with file ${e}.\n\nthe path we tried this at was ${path}.\n\n attempted to rename it to ${newPathName}\n\nError is as follows:\n${'/'.repeat(20)}\n${er}\n${'/'.repeat(20)}`
        );
      }




      await new Promise(r => setTimeout(r, 1000))
      isTesting ? null :
        exec(`start ${path}/${newPathName}`, function (err, stdout, stderr) {
          if (err) {
            throw err;
          }
        })
    })
    if (isTesting == false) {
      rl.question('press enter once all extraction is done', () => {
        Object.entries(referenceObj).forEach(e => fs.renameSync(`${path}/${e[0]}`, `${path}/${e[1]}`))
        Object.entries(referenceObj).forEach(e => fs.renameSync(`${path}/programToOpenAll/${e[0].slice(0, -4)}`, `${path}/${e[1].slice(0, -4)}`))
      })
    }
  })()
})

