import {
  getLabel,
  getMoveTypeLabel,
  idFileName,
  MoveType,
  parseComment,
} from 'src'
import { fileExists, fileGetContents, filePutContents } from './helpers'

const withComments = process.argv.some((arg) => arg.startsWith('--with-comments'))

const getSgf = (moveId: number): string => {
  const fileName = idFileName(moveId)
  if (!fileExists(fileName)) {
    return ''
  }

  const move: any = JSON.parse(fileGetContents(fileName))
  if (![MoveType.Green, MoveType.Yellow].includes(move._mtype)) {
    return ''
  }

  process.stdout.write(`ID ${String(move._id).padEnd(7, ' ')}`)

  let sgf = '('
  let player
  let moveCoords
  if (move.B) {
    player = 'B'
    moveCoords = move.B
  } else if (move.W) {
    player = 'W'
    moveCoords = move.W
  }
  if (moveCoords === 'tt') {
    moveCoords = ''
  }

  const moveSgf = `;${player}[${moveCoords}]`
  sgf += moveSgf
  process.stdout.write(`| ${moveCoords}`)
  process.stdout.write('\n')

  if (withComments) {
    sgf += 'C['
    sgf += `${getMoveTypeLabel(move._mtype)}\n\n`
    if (move._labels && move._labels.length > 0) {
      sgf += move._labels.map((labelId: number) => getLabel(labelId)).join('\n')
      sgf += '\n\n'
    }
    if (move.C) {
      sgf += parseComment(move.C)
    }
    sgf += ']'
  }

  if (move._children && move._children.length > 0) {
    sgf += move._children.map((child: any) => getSgf(child._id)).join('')
  }

  sgf += ')'

  return sgf
}

let sgf = `(;GM[1]FF[4]CA[UTF-8]AP[josekipedia-parser]ST[2]
RU[Japanese]SZ[19]KM[6.50]
PW[Белые]PB[Черные]\n`

const data: any = JSON.parse(fileGetContents(idFileName(1)))
const moves: any[] = data._children
for (const move of moves) {
  sgf += getSgf(move._id)
}

sgf += ')'

const outputFileName = 'data/all-josekis.sgf'
filePutContents(outputFileName, sgf)
console.log(`SGF file saved in ${outputFileName}!`)
