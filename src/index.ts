import {
  delay,
  fileExists,
  fileGetContents,
  filePutContents,
  jsonEncode,
} from './helpers'
import axios from 'axios'

await delay(1000)

const url = (id: number) =>
  `https://www.josekipedia.com/db/node.php?id=${id}&pid=0`

const downloadId = async (id?: number): Promise<number[]> => {
  if (id === undefined) {
    throw new Error('id is undefined')
  }

  const fileName: string = `./data/moves/${id}.json`
  process.stdout.write(`ID ${String(id).padEnd(9, ' ')} | `)

  let data: any
  if (fileExists(fileName)) {
    process.stdout.write('already downloaded'.padEnd(20, ' '))
    data = JSON.parse(fileGetContents(fileName))
  } else {
    process.stdout.write('downloading'.padEnd(20, ' '))
    const response = await axios.get(url(id))
    data = response.data
    filePutContents(fileName, jsonEncode(response.data))
  }

  const childrenIds: number[] =
    data._children?.map((child: any) => child._id) ?? []

  process.stdout.write(` | children count - ${String(childrenIds.length).padEnd(3, ' ')} `)

  return childrenIds
}

const idsStack: number[] = [1]
let i = 0
let time = new Date().getTime()

while (idsStack.length > 0) {
  i++
  const childrenIds = await downloadId(idsStack.shift())
  idsStack.push(...childrenIds)
  await delay(10)

  process.stdout.write(`| Progress: ${String(i).padEnd(9, ' ')} `)
  process.stdout.write(`| Time: ${(new Date().getTime() - time) / 1000}s.`)
  process.stdout.write(`\r`)
}
