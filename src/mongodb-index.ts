import { MongoClient, Db, Collection, ObjectId, WithId, FindCursor, InsertOneResult, DeleteResult, UpdateResult } from 'mongodb'
import { Message } from './models/message.js'

async function connect(): Promise<void> {
	const con: string | undefined = process.env.CONNECTION_STRING
	if( !con ) {
		console.log('ERROR: connection string not found!')
		return
	}

	let client: MongoClient | null = null
	try {
		client = await MongoClient.connect(con)
		const db: Db = await client.db('exercises')
		const col: Collection<Message> = db.collection<Message>('messages')

		// sorteringsnyckel: "likes"
		// sorteringsordning: stigande (1 == ascending)
		const cursor: FindCursor<WithId<Message>> = col.find({})
			.sort({ likes: 1, receiverId: 1 })
		const messages: WithId<Message>[] = await cursor.toArray()
		messages.forEach(message => {
			console.log(message)
		})

	} catch(error) {
		 
	} finally {
		if( client !== null ) {
			await client.close()
		}
	}
}

connect()
