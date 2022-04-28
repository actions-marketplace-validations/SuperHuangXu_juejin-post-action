const process = require('process')
const cp = require('child_process')
const path = require('path')

test('get throws invalid number', async () => {
  process.env['INPUT_USER_ID'] = '4142615541064046'
  const ip = path.join(__dirname, 'index.js')
  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString()
  console.log(result)
})
