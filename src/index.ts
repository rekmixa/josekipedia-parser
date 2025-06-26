import axios from 'axios'
import md5 from 'md5'
import {
  delay,
  fileExists,
  fileGetContents,
  filePutContents,
  jsonEncode,
  smartFixString,
} from './helpers'

export function idUrl(id: number): string {
  return `https://www.josekipedia.com/db/node.php?id=${id}&pid=0`
}

export function idFileName(id: number): string {
  return `./data/moves/${md5(String(id)).substr(0, 2)}/${md5(String(id)).substr(
    2,
    2,
  )}/${id}.json`
}

export async function downloadId(id?: number): Promise<number[]> {
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
      ?.filter((child: any) =>
        [MoveType.Green, MoveType.Yellow].includes(child._mtype),
      )
      // ?.filter((child: any) => [MoveType.Green].includes(child._mtype))
      ?.map((child: any) => child._id) ?? []

  process.stdout.write(
    ` | Children count: ${String(childrenIds.length).padEnd(3, ' ')} `,
  )

  return childrenIds
}

interface Source {
  name: string
  senseis: string
  lang: string
}

const jsources: { [key: string]: Source } = {
  '100tips': {
    name: '100 Tips for Amateur Players 1',
    senseis: '100TipsForAmateurPlayersI',
    lang: 'en',
  },
  '100tips2': {
    name: '100 Tips for Amateur Players 2',
    senseis: '100TipsForAmateurPlayersII',
    lang: 'en',
  },
  dobj21: {
    name: '21st Century Dictionary of Basic Joseki',
    senseis: '',
    lang: 'en',
  },
  '21st': {
    name: '21st Century New Openings',
    senseis: '21stCenturyNewOpenings',
    lang: 'en',
  },
  '38bj': {
    name: '38 Basic Joseki',
    senseis: '38BasicJoseki',
    lang: 'en',
  },
  ctp: {
    name: 'A Compendium Of Trick Plays',
    senseis: 'ACompendiumOfTrickPlays',
    lang: 'en',
  },
  aaj: {
    name: 'All About Joseki',
    senseis: 'AllAboutJoseki',
    lang: 'en',
  },
  afg: {
    name: 'Appreciating Famous games',
    senseis: 'AppreciatingFamousGames',
    lang: 'en',
  },
  cosmic: {
    name: 'Cosmic Go: A Guide to Four-Stone Handicap Games',
    senseis: 'CosmicGo',
    lang: 'en',
  },
  dobj: {
    name: 'Dictionary Of Basic Joseki',
    senseis: 'DictionaryOfBasicJoseki',
    lang: 'en',
  },
  eoj: {
    name: 'Encyclopedia of Joseki',
    senseis: 'GendaiJosekiJiten',
    lang: 'zh',
  },
  ej: {
    name: 'Essential Joseki',
    senseis: 'EssentialJoseki',
    lang: 'en',
  },
  jiot: {
    name: 'Jungsuk In Our Time',
    senseis: 'JungsukInOurTime',
    lang: 'en',
  },
  ksob: {
    name: 'Korean Style of Baduk',
    senseis: 'KoreanStyleOfBaduk',
    lang: 'en',
  },
  mgs: {
    name: 'Making Good Shape',
    senseis: 'MakingGoodShape',
    lang: 'en',
  },
  mjf1: {
    name: 'Modern Joseki and Fuseki Volume 1',
    senseis: 'ModernJosekiAndFusekiVol1',
    lang: 'en',
  },
  mjf2: {
    name: 'Modern Joseki and Fuseki Volume 2',
    senseis: 'ModernJosekiAndFusekiVol2',
    lang: 'en',
  },
  nm: {
    name: 'New Moves',
    senseis: '',
    lang: 'en',
  },
  pacjm: {
    name: 'Punishing and Correcting Joseki Mistakes',
    senseis: 'PunishingAndCorrectingJosekiMistakes',
    lang: 'en',
  },
  ssj: {
    name: 'Sekai no Shin Joseki',
    senseis: '',
    lang: 'ja',
  },
  shojiten: {
    name: 'Shin Hayawakari Shojiten',
    senseis: 'ShinHayawakariShojiten',
    lang: 'ja',
  },
  sps: {
    name: 'Star Point Joseki',
    senseis: 'StarPointJoseki',
    lang: 'en',
  },
  tij: {
    name: 'Tricks in Joseki',
    senseis: 'TricksInJoseki',
    lang: 'en',
  },
}

export function getSource(source: string): Source {
  return jsources[source]
}

export function getLabel(labelId: number): string {
  const labels: { [id: number]: string } = {
    23: 'Позиция разыграна.',
    41: '% перебор.',
    37: '% убивают.',
    8: '% ведёт к ко.',
    34: '% ведёт к сложным вариациям',
    38: '% поддавливает.',
    6: '% требуется подходящая лестница.',
    10: 'Чёрные могут ходить тенуки.',
    21: 'Чёрные разгромлены.',
    49: 'Чёрные соединяются.',
    54: 'У чёрных плохая форма.',
    4: 'У чёрных хорошее влияние.',
    25: 'Чёрные получили неплохую прибыль.',
    51: 'Чёрные замурованы.',
    18: 'У чёрных крепко.',
    12: 'Чёрные забирают угол.',
    28: 'Сложная позиция.',
    29: 'Боевой паттерн.',
    2: 'Хорошо для чёрных.',
    1: 'Хорошо для белых.',
    32: 'Хонтэ.',
    35: 'Убивают.',
    50: 'Ко',
    7: 'Ведёт к ко.',
    33: 'Ведёт к сложным вариациям.',
    42: 'Оставляет слабости.',
    43: 'Выживают.',
    22: 'Современный паттерн.',
    15: 'Необходимость.',
    14: 'Старый паттерн.',
    40: 'Перебор.',
    45: 'Равная позиция.',
    31: 'Прощупывающий ход.',
    36: 'Поддавливающий ход.',
    44: 'Сопротивление хитрой игре.',
    30: 'Идёт сражение.',
    16: 'Жертвующий ход.',
    27: 'Простая позиция.',
    53: 'Слабая позиция.',
    46: 'Лучше для чёрных.',
    47: 'Лучше для белых.',
    13: 'Надёжный ход.',
    39: 'Берёт сенте.',
    19: 'Тэсудзи.',
    5: 'Это требует подходящей лестницы.',
    26: 'Жизненно важная точка.',
    9: 'Белые могут ходить тэнуки.',
    20: 'Белые погибают.',
    48: 'Белые соединяются.',
    55: 'У белых плохая форма.',
    3: 'У белых неплохое влияние.',
    24: 'Белые получили неплохую прибыль.',
    52: 'Белые замурованы.',
    17: 'У белых крепко.',
    11: 'Белые забирают угол.',
  }

  return labels[labelId]
}

export function parseComment(comment: string) {
  let result = smartFixString(comment)
  let regexpSource = /\[src:([\w\s,.]+)\]/
  let ar

  while ((ar = regexpSource.exec(comment)) != null) {
    let src_txt = ar[1]
    let src_detail = ''
    const comma = src_txt.indexOf(',')
    if (comma > 0) {
      src_detail = src_txt.substring(comma + 1)
      src_txt = src_txt.substring(0, comma)
    }
    let x = 'undefined source'
    if (jsources[src_txt] !== undefined) {
      x = jsources[src_txt].name
      if (jsources[src_txt].senseis != '') {
        x += ' (http://senseis.xmp.net/?' + jsources[src_txt].senseis + ')'
      }
      if (src_detail.length > 0) x += ' - ' + src_detail
    }
    comment = comment.replace(regexpSource, x)
  }

  result = result.replaceAll('[', '\\[')
  result = result.replaceAll(']', '\\]')

  return result
}

export function getMoveTypeLabel(moveType: MoveType): string {
  const map = {
    [MoveType.Green]: 'Идеальный ход',
    [MoveType.Yellow]: 'Хороший ход',
    [MoveType.Red]: 'Плохой ход',
    [MoveType.Fancy]: 'Хитрый ход',
    [MoveType.Ask]: 'Вопрос',
  }

  return map[moveType]
}

export enum MoveType {
  Green = 0,
  Yellow = 1,
  Red = 2,
  Fancy = 3,
  Ask = 4,
}
