import {
  delay,
  fileExists,
  fileGetContents,
  filePutContents,
  jsonEncode,
  showUptime,
} from './helpers'
import axios from 'axios'
import md5 from 'md5'

await delay(1000)

const idUrl = (id: number): string =>
  `https://www.josekipedia.com/db/node.php?id=${id}&pid=0`

const idFileName = (id: number): string =>
  `./data/moves/${md5(String(id)).substr(0, 2)}/${md5(String(id)).substr(2, 2)}/${id}.json`

const downloadId = async (id?: number): Promise<number[]> => {
  if (id === undefined) {
    throw new Error('id is undefined')
  }

  const fileName: string = idFileName(id)
  process.stdout.write(`ID ${String(id).padEnd(9, ' ')} | `)

  let data: any
  if (fileExists(fileName)) {
    process.stdout.write('Already downloaded'.padEnd(20, ' '))
    data = JSON.parse(fileGetContents(fileName))
  } else {
    process.stdout.write('Downloading...'.padEnd(20, ' '))
    const response = await axios.get(idUrl(id))
    data = response.data
    filePutContents(fileName, jsonEncode(response.data))
  }

  process.stdout.write(` | _mtype: ${data._mtype}`)

  const childrenIds: number[] =
    data._children
      // ?.filter((child: any) => [0, 1].includes(child._mtype))
      ?.filter((child: any) => [0].includes(child._mtype))
      ?.map((child: any) => child._id) ?? []

  process.stdout.write(
    ` | Children count: ${String(childrenIds.length).padEnd(3, ' ')} `,
  )

  return childrenIds
}

const idsStack: number[] = [1]
let i = 0

while (idsStack.length > 0) {
  i++
  const childrenIds = await downloadId(idsStack.shift())
  idsStack.push(...childrenIds)
  await delay(10)

  process.stdout.write(`| Progress: ${String(i).padEnd(9, ' ')} `)
  process.stdout.write(`| Uptime: ${showUptime()}`)
  process.stdout.write(` | In queue: ${idsStack.length}`)
  process.stdout.write(`\n`)
  // process.stdout.write(`\r`)
}
