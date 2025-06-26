import { fileGetContents, smartFixString } from './helpers'

// 1. Прочитать файл как UTF-8 (JSON в порядке)
const raw = fileGetContents('data/test.json')
const parsed = JSON.parse(raw)

console.log(smartFixString('test123'))
console.log(smartFixString(parsed.broken))
