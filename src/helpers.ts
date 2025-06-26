import fs from 'fs'
import path from 'path'
import he from 'he'
import iconv from 'iconv-lite'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  if (bytes === 0) {
    return '0 Byte'
  }

  const size = Math.floor(Math.floor(Math.log(bytes) / Math.log(1024)))

  return Math.round(bytes / Math.pow(1024, size)) + ' ' + sizes[size]
}

export function showUptime(): string {
  function format(time: number) {
    function pad(s: number) {
      return (s < 10 ? '0' : '') + s
    }

    const hours = Math.floor(time / (60 * 60))
    const minutes = Math.floor((time % (60 * 60)) / 60)
    const seconds = Math.floor(time % 60)

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  }

  return format(process.uptime())
}

export function fileExists(filename: string): boolean {
  return fs.existsSync(filename)
}

export function fileGetContents(filename: string): string {
  return fs.readFileSync(filename).toString()
}

export function filePutContents(filename: string, content: string): void {
  const directory = path.dirname(filename)
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(filename, content)
}

export function arrayUnique<T>(array: T[]): T[] {
  return array.reduce((carry: T[], value: T): T[] => {
    if (carry.indexOf(value) === -1) {
      carry.push(value)
    }

    return carry
  }, [])
}

export function jsonEncode(data: any): string {
  return JSON.stringify(data, null, 2)
}

export function smartDecodeRussian(input: string) {
  const fixes = {
    'Ð°': 'а',
    'Ð±': 'б',
    'Ð²': 'в',
    'Ð³': 'г',
    'Ð´': 'д',
    Ðµ: 'е',
    'Ñ‘': 'ё',
    'Ð¶': 'ж',
    'Ð·': 'з',
    'Ð¸': 'и',
    'Ð¹': 'й',
    Ðº: 'к',
    'Ð»': 'л',
    'Ð¼': 'м',
    'Ð½': 'н',
    'Ð¾': 'о',
    'Ð¿': 'п',
    'Ñ€': 'р',
    'Ñ': 'с',
    'Ñ‚': 'т',
    Ñƒ: 'у',
    'Ñ„': 'ф',
    'Ñ…': 'х',
    'Ñ†': 'ц',
    'Ñ‡': 'ч',
    Ñˆ: 'ш',
    'Ñ‰': 'щ',
    ÑŠ: 'ъ',
    'Ñ‹': 'ы',
    ÑŒ: 'ь',
    'Ñ': 'э',
    ÑŽ: 'ю',
    'Ñ': 'я',

    'Ð': 'А',
    'Ð‘': 'Б',
    'Ð’': 'В',
    'Ð“': 'Г',
    'Ð”': 'Д',
    'Ð•': 'Е',
    'Ð': 'Ё',
    'Ð–': 'Ж',
    'Ð—': 'З',
    'Ð˜': 'И',
    'Ð™': 'Й',
    Ðš: 'К',
    'Ð›': 'Л',
    Ðœ: 'М',
    'Ð': 'Н',
    Ðž: 'О',
    ÐŸ: 'П',
    'Ð ': 'Р',
    'Ð¡': 'С',
    'Ð¢': 'Т',
    'Ð£': 'У',
    'Ð¤': 'Ф',
    'Ð¥': 'Х',
    'Ð¦': 'Ц',
    'Ð§': 'Ч',
    'Ð¨': 'Ш',
    'Ð©': 'Щ',
    Ðª: 'Ъ',
    'Ð«': 'Ы',
    'Ð¬': 'Ь',
    'Ð­': 'Э',
    'Ð®': 'Ю',
    'Ð¯': 'Я',
  }

  let fixed = input
  for (const [bad, good] of Object.entries(fixes)) {
    fixed = fixed.split(bad).join(good)
  }

  return fixed
}

export function smartFixString(input: string) {
  // Шаг 1: HTML-декодинг
  const htmlDecoded = he.decode(input)

  // Шаг 2: Попробовать восстановить байты → декодировать как UTF-8
  const buffer = Buffer.from(htmlDecoded, 'latin1') // восстанавливаем оригинальные UTF-8 байты
  let decoded = iconv.decode(buffer, 'utf8')

  // Шаг 3: Проверка — если есть символы �, попробуем поправить вручную
  if (decoded.includes('�')) {
    decoded = smartDecodeRussian(htmlDecoded) // fallback: по символам
  }

  return decoded
}
