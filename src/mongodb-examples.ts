/* För att köra, skriv:
node --env-file .env dist\mongodb-examples.js
ENV-filen måste innehålla
TEST=Hello world
CONNECTION_STRING=kopierad från Compass
*/
const test: string | undefined = process.env.TEST
console.log('Test env-fil: ' + test)

import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

async function connect() {
	const con: string | undefined = process.env.CONNECTION_STRING
	if( !con ) {
		console.log('ERROR: connection string not found!')
		return
	}
	const client: MongoClient = new MongoClient(con)

	const db: Db = await client.db('exercises')
	const col: Collection<Animal> = db.collection<Animal>('animalFacts')

	// TODO: filter + findOne
	console.log('Program executed successfully.')
}

interface Animal {
	_id: ObjectId;
	species: string;
	factoid: string;
	score: number;
}

connect()
