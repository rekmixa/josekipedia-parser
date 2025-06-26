import { downloadId } from 'src'
import { delay, showUptime } from './helpers'

const idsStack: number[] = [1]
let i = 0

while (idsStack.length > 0) {
  i++
  const childrenIds = await downloadId(idsStack.shift())
  idsStack.push(...childrenIds)

  process.stdout.write(`| Progress: ${String(i).padEnd(9, ' ')} `)
  process.stdout.write(`| Uptime: ${showUptime()}`)
  process.stdout.write(` | In queue: ${idsStack.length}`)
  process.stdout.write(`\n`)
  // process.stdout.write(`\r`)
}
