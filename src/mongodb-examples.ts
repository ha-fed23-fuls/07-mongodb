/* För att köra, skriv:
node --env-file .env dist\mongodb-examples.js
ENV-filen måste innehålla
TEST=Hello world
CONNECTION_STRING=kopierad från Compass
*/
const test: string | undefined = process.env.TEST
console.log('Test env-fil: ' + test)

import { MongoClient, Db, Collection, ObjectId, WithId } from 'mongodb'

async function connect() {
	const con: string | undefined = process.env.CONNECTION_STRING
	if( !con ) {
		console.log('ERROR: connection string not found!')
		return
	}
	try {
		const client: MongoClient = new MongoClient(con)

		const db: Db = await client.db('exercises')
		const col: Collection<Animal> = db.collection<Animal>('animalFacts')

		// const filter = { }  // tomt objekt väljer ut alla
		const filter = { score: { $lt: 32 } }  // score < 32
		const found: WithId<Animal> | null = await col.findOne(filter)
		// TODO: validera med Joi
		if( found ) {
			console.log('Found animal: ', found)
		} else {
			console.log('All animals were in hiding...')
		}

		await client.close()
	} catch(error: any) {
		console.log('An error occurred. ' + error.message)
	}
	console.log('Program executed successfully.')
}

interface Animal {
	// _id: ObjectId;  <- läggs till av WithId<>
	species: string;
	factoid: string;
	score: number;
}

connect()
