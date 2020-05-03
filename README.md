# Twitter Feed

## Assumptions
- The program is trying to be forgiving as possible, so some bad formatting of file contents might still work
- The username of a given Twitter user is unique by case insensitive, so "Veronica" is the same as "veronica"

## How to run?
Run `npm i` to install all dependencies.

### The program itself
The program takes two input files - the users file and the tweets file.

You can execute the program by running `npx node-ts index <users file> <tweets file>`.

For example `npx node-ts index ./data/users.txt ./data/tweets.txt`

### Tests
You can execute `npm run test` to run the tests.

