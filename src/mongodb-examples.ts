/* För att köra, skriv:
node --env-file .env dist\mongodb-examples.js
ENV-filen måste innehålla
TEST=Hello world
CONNECTION_STRING=kopierad från Compass
*/
const test: string | undefined = process.env.TEST
console.log('Test env-fil: ' + test)

import { MongoClient, Db, Collection, ObjectId, WithId, FindCursor, InsertOneResult } from 'mongodb'
import { Animal } from './models/animal.js'

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

		await findTheElephant(col)
		await findHighestScores(col)

		const rabbit: Animal = { species: 'Rabbit', factoid: 'Rabbits are extremely cute', score: 25 }
		// Kom ihåg att validera animal-objektet om det kommer från frontend
		await insertRabbit(col, rabbit)

		await client.close()
	} catch(error: any) {
		console.log('An error occurred. ' + error.message)
	}
	console.log('Program executed successfully.')
}

async function findTheElephant(col: Collection<Animal>): Promise<void> {
	// const filter = { }  // tomt objekt väljer ut alla
	const filter = { score: { $lt: 32 } }  // score < 32
	const found: WithId<Animal> | null = await col.findOne(filter)
	// TODO: validera med Joi
	if( found ) {
		console.log('Found animal: ', found)
	} else {
		console.log('All animals were in hiding...')
	}
}

async function findHighestScores(col: Collection<Animal>): Promise<void> {
	// Välj alla djur som har minst 75 i score
	// score >= 75
	const filter = { score: { $gte: 75 } }
	const cursor: FindCursor<WithId<Animal>> = col.find(filter)
	const found: WithId<Animal>[] = await cursor.toArray()

	if( found.length < 1 ) {
		console.log('No animals with high enough score :(')
		return
	}
	found.forEach(animal => {
		console.log(`${animal.species} has a score of ${animal.score}.`)
	})
}

async function insertRabbit(col: Collection<Animal>, rabbit: Animal): Promise<ObjectId | null> {
	const result: InsertOneResult<Animal> = await col.insertOne(rabbit)
	// acknowledged: boolean  <- true om queryn körs
	// insertedId: ObjectId  <- det id som objektet tilldelas
	if( !result.acknowledged ) {
		console.log('Could not insert rabbit :(')
		return null
	}
	return result.insertedId
}


connect()
