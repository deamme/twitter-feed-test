import { checkIfFilesExists, parseUsersFile, parseTweetsFile } from './lib'

// Check if two input as been given
if (process.argv.length !== 4) {
  throw 'Please provide two inputs (path to user file and tweets file)'
}

const usersFilePath = process.argv[2]
const tweetsFilePath = process.argv[3]

function printFeed(parsedUsersContent, parsedTweetsContent) {
  parsedUsersContent.forEach(list => {
    const name: string = list[0]
    const following: string[] = list[1]
    const names: string[] = following.concat(name).map(text => text.toLowerCase())

    console.log(name)

    parsedTweetsContent.forEach(list => {
      const author: string = list[0]
      const message: string = list[1]

      if (names.indexOf(author.toLowerCase()) !== -1) {
        console.log(`\t@${author}: ${message}`)
      }
    })

    console.log('')
  })
}

async function runProgram() {
  try {
    await checkIfFilesExists(usersFilePath, tweetsFilePath)

    printFeed(await parseUsersFile(usersFilePath), await parseTweetsFile(tweetsFilePath))
  } catch (error) {
    throw error
  }
}

runProgram()
