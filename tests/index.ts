import * as test from 'tape'

import { checkIfFilesExists, parseUsersFile, parseTweetsFile } from '../lib'

const usersFilePath = './data/users.txt'
const tweetsFilePath = './data/tweets.txt'

test('Check if files exist - Throw on invalid users path', async t => {
  try {
    await checkIfFilesExists('./data/invalid.txt', tweetsFilePath)
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Check if files exist - Throw on invalid tweets path', async t => {
  try {
    await checkIfFilesExists(usersFilePath, './data/invalid.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Check if files exist - Passes on valid paths', async t => {
  try {
    await checkIfFilesExists(usersFilePath, tweetsFilePath)
    t.pass()
  } catch (error) {
    t.fail(error)
  }
  t.end()
})

test('Check users file content format - Valid format (normal)', async t => {
  try {
    await parseUsersFile('./tests/data/users1.txt')
    t.pass()
  } catch (error) {
    t.fail(error)
  }
  t.end()
})

test('Check users file content format - Valid format (empty lines)', async t => {
  try {
    await parseUsersFile('./tests/data/users2.txt')
    t.pass()
  } catch (error) {
    t.fail(error)
  }
  t.end()
})

test('Check users file content format - Valid format (weird content)', async t => {
  try {
    await parseUsersFile('./tests/data/users3.txt')
    t.pass()
  } catch (error) {
    t.fail(error)
  }
  t.end()
})

test('Check users file content format - Invalid format (`follows` keyword missing)', async t => {
  try {
    await parseUsersFile('./tests/data/users4.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Check users file content format - Invalid format (`follows` keyword missing in the right place)', async t => {
  try {
    await parseUsersFile('./tests/data/users5.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Parsed users file - No duplicate name entries and has `follows` user', async t => {
  try {
    const parsedContent = await parseUsersFile('./tests/data/users1.txt')
    const names = parsedContent.map(list => list[0])
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index)
    const hasFollowsUser = names.filter(name => name === 'follows')

    t.false(duplicateNames.length)
    t.true(hasFollowsUser.length)
  } catch (error) {
    t.fail(error)
  }
  t.end()
})

test('Check tweets file content format - Valid format (normal)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets1.txt')
    t.pass()
  } catch (error) {
    t.fail()
  }
  t.end()
})

test('Check tweets file content format - Valid format (empty lines)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets2.txt')
    t.pass()
  } catch (error) {
    t.fail()
  }
  t.end()
})

test('Check tweets file content format - Valid format (weird content)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets3.txt')
    t.pass()
  } catch (error) {
    t.fail()
  }
  t.end()
})

test('Check tweets file content format - Invalid format (`> ` pattern missing)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets4.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Check tweets file content format - Invalid format (`> ` pattern missing in the right place)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets5.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Check tweets file content format - Invalid format (over 280 characters)', async t => {
  try {
    await parseTweetsFile('./tests/data/tweets6.txt')
    t.fail()
  } catch (error) {
    t.pass()
  }
  t.end()
})

test('Parsed tweets file - Correct length', async t => {
  try {
    const parsedContent = await parseTweetsFile('./tests/data/tweets1.txt')

    t.assert(parsedContent.length === 5)
  } catch (error) {
    t.fail()
  }
  t.end()
})
