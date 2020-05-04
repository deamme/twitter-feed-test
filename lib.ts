import * as os from 'os'
import { pathExists, readFile } from 'fs-extra'

// Check if files exist
export async function checkIfFilesExists(usersFilePath: string, tweetsFilePath: string) {
  const usersFilePathExist = await pathExists(usersFilePath)
  const tweetsFilePathExist = await pathExists(tweetsFilePath)

  if (!usersFilePathExist) {
    throw "Path to users file doesn't exist, please provide a valid path"
  }
  if (!tweetsFilePathExist) {
    throw "Path to tweets file doesn't exist, please provide a valid path"
  }
}

function checkUsersContentFormat(fileContent: String) {
  const isWindows = os.platform() === 'win32'
  const errorMessage = 'Seems like your users file has incorrect format'
  // Match only words (case insensitive) and ignore whitespace etc.
  const regex = /[a-z]+/gi

  return (
    fileContent
      // Split by line and remove empty lines
      .split(isWindows ? '\r\n' : '\n')
      .filter((text) => text !== '')
      // Split by the first instance of "follows" keyword
      // We want to support "follows" as a username too
      .map((text, index) => {
        const followsIndex = text.indexOf('follows')

        if (followsIndex === -1) {
          throw errorMessage + ' at line ' + index + " (couldn't find `follows` keyword)"
        }

        const following = text.substring(followsIndex + 7)
        const name = text.substring(0, followsIndex)
        return [name, following]
      })
      // Parse user's name properly
      .map((list: string[], index) => {
        const name = list[0]
        const nameMatch = name.match(regex)

        if (nameMatch.length !== 1) {
          throw errorMessage + ' at line ' + index + " (couldn't parse name)"
        }

        list[0] = nameMatch[0]
        return list
      })
      // Parse following
      .map((list: any) => {
        const name = list[0]
        const following = list[1]

        list[1] = following
          .split(', ')
          .filter((text) => text.match(regex))
          .map((text) => {
            return text.match(regex)[0]
          })
          // Make sure you can't follow yourself
          .filter((text) => text.toLowerCase() !== name.toLowerCase())

        return list
      })
  )
}

export async function parseUsersFile(usersFilePath: string) {
  try {
    const buffer = await readFile(usersFilePath)
    const content = buffer.toString('ascii')

    const checkedFormatting = checkUsersContentFormat(content)

    // Combining multiple entries of a given user to a single entry
    let parsedContent: [[string, [string?]]] = checkedFormatting.reduce(
      (accumulator: any, currentValue: [string, [string]]) => {
        const currentName: string = currentValue[0]
        const currentFollowing: string[] = currentValue[1]
        let foundMatch = false

        accumulator = accumulator.map((list) => {
          const matchedName: string = list[0]
          const matchedFollowing: string[] = list[1]

          if (matchedName === currentName) {
            foundMatch = true

            const concatFollowing = matchedFollowing.concat(currentFollowing)

            // Replace old following with new and unique following
            list[1] = concatFollowing.filter((following, index) => concatFollowing.indexOf(following) === index)
          }

          return list
        })

        if (!foundMatch) {
          accumulator.push(currentValue)
        }

        return accumulator
      },
      []
    )

    const names = parsedContent.map((list) => list[0])
    const followings = parsedContent.reduce((accumulator, currentValue) => accumulator.concat(currentValue[1]), [])

    // We also want to have an entry for users that are not already on the initial list
    followings
      .filter((following) => {
        return !names.filter((name) => name.toLowerCase() === following.toLowerCase()).length
      })
      .forEach((name) => {
        parsedContent.push([name, []])
      })

    // Sort alphabetically
    parsedContent.sort((a, b) => {
      const aName = a[0].toLowerCase()
      const bName = b[0].toLowerCase()
      if (aName < bName) {
        return -1
      }
      if (aName > bName) {
        return 1
      }
      return 0
    })

    return parsedContent
  } catch (error) {
    throw error
  }
}

function checkTweetsContentFormat(fileContent: string) {
  const isWindows = os.platform() === 'win32'
  const errorMessage = 'Seems like your tweets file has incorrect format'
  // Match only words (case insensitive) and ignore whitespace etc.
  const regex = /[a-z]+/gi

  return (
    fileContent
      // Split by line and remove empty lines
      .split(isWindows ? '\r\n' : '\n')
      .filter((text) => text !== '')
      // Split by the first instance of "> "
      // We want to support that a message can contain "> "
      .map((text, index) => {
        const symbolIndex = text.indexOf('> ')

        if (symbolIndex === -1) {
          throw errorMessage + ' at line ' + index + " (couldn't find `> ` pattern)"
        }

        const message = text.substring(symbolIndex + 2)

        if (message.length > 280) {
          throw errorMessage + ' at line ' + index + ' (message is over 280 characters)'
        }

        const name = text.substring(0, symbolIndex)
        return [name, message]
      })
      // Parse user's name properly
      .map((list: string[], index) => {
        const name = list[0]
        const nameMatch = name.match(regex)

        if (nameMatch.length !== 1) {
          throw errorMessage + ' at line ' + index + " (couldn't parse name)"
        }

        list[0] = nameMatch[0]
        return list
      })
  )
}

export async function parseTweetsFile(tweetsFilePath: string) {
  try {
    const buffer = await readFile(tweetsFilePath)
    const content = buffer.toString('ascii')
    return checkTweetsContentFormat(content)
  } catch (error) {
    throw error
  }
}
