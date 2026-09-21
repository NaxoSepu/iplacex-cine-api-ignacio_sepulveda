import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://ignacioelias1995_db_user:6TUDnK5lgQslBVYn@cluster-express.phg07qj.mongodb.net/?appName=cluster-express';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export default client;