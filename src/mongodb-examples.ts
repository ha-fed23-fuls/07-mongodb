// För att köra, skriv:
// node --env-file .env dist\mongodb-examples.js

const test: string | undefined = process.env.TEST
console.log('Test env-fil: ' + test)
