const { MongoClient } = require('mongodb');

const connect = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // When I create the connection to MongoDB in the server.js file
    // I will pass these collection variables to the app local property
    // to make this accessible globally or througout the pproject. 
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME);
    const tasksCollection = db.collection(process.env.TASKS_COLLECTION_NAME);
    const projectsCollection = db.collection(process.env.PROJECTS_COLLECTION_NAME);
    const commentsCollection = db.collection(process.env.COMMENTS_COLLECTION_NAME);
    
    console.log('Connection to MongoDB was Successful!');
    return { usersCollection, tasksCollection, projectsCollection, commentsCollection };
  } catch (error) {
    console.error(error);
    throw new Error('Unable to connect to MongoDB');
  }
};

module.exports = { connect };
