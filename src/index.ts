import axios from 'axios'
import md5 from 'md5'
import {
  delay,
  fileExists,
  fileGetContents,
  filePutContents,
  jsonEncode
} from './helpers'

export const idUrl = (id: number): string =>
  `https://www.josekipedia.com/db/node.php?id=${id}&pid=0`

export const idFileName = (id: number): string =>
  `./data/moves/${md5(String(id)).substr(0, 2)}/${md5(String(id)).substr(
    2,
    2,
  )}/${id}.json`

export const downloadId = async (id?: number): Promise<number[]> => {
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

    for (let i = 0; i < 10; i++) {
      try {
        const response = await axios.get(idUrl(id))
        data = response.data
        break
      } catch (error) {
        process.stdout.write('!')
        await delay(10_000)
      }
    }

    if (!data) {
      throw new Error('cannot download move!')
    }

    filePutContents(fileName, jsonEncode(data))
  }

  process.stdout.write(` | _mtype: ${data._mtype}`)

  const childrenIds: number[] =
    data._children
      ?.filter((child: any) => [0, 1].includes(child._mtype))
      // ?.filter((child: any) => [0].includes(child._mtype))
      ?.map((child: any) => child._id) ?? []

  process.stdout.write(
    ` | Children count: ${String(childrenIds.length).padEnd(3, ' ')} `,
  )

  return childrenIds
}

