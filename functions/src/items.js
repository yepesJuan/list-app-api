const { getClient } = require("./dbConnection");
const ObjectId = require('mongodb').ObjectId

async function getCollection() {
  const client = await getClient();
  const db = client.db("listapp");
  const collection = db.collection("items");
  return collection;
}
exports.createUserItem = async (req, res) => {
  const { name, uid } = req.body;
  if (!name || !uid) {
    res.status(401).send("Invalid reques");
  }

  
  const now = new Date();
  const item = {
    name,
    done: false,
    uid,
    active: true,
    created_at: now,
    updated_at: now,
  };
  
  try {
    const itemCollection = await getCollection();
    const result = await itemCollection.insertOne(item);
    item.id = result.insertedId;
    res.status(201).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserItems = async (req, res) => {
  const { uid } = req.params;

  
  try {
    const itemCollection = await getCollection();
    const results = itemCollection.find({ 'uid': uid });
    let item = await results.toArray();
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserItems = async (req, res) => {
  const { uid, name, done } = req.body;
  const itemId = req.params.itemId;
  
  console.log(req.params)

  if (!uid) {
    res.status(401).send("Invalid request to update");
  }
  //const updateDoc = {}
  const updateDoc = { updated_at: new Date() };
  if (name) {
    updateDoc.name = name;
  }
  if (done) {
    updateDoc.done = done;
  }

  try {
    const itemCollection = await getCollection();
    const result = await itemCollection.updateOne(
      { '_id': new ObjectId(itemId), 'uid': uid }, { $set: updateDoc });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteUserItems = async (req,res) => {
  console.log(req.params)
  const {itemId ,uid } = req.params

  if (!uid || !itemId) {
    res.status(401).send("Invalid request to delete");
  }
  
  try {
    const itemCollection = await getCollection();
    // const results = itemCollection.deleteOne({ '_id': new ObjectId(itemId), 'uid': uid });
    const result = await itemCollection.updateOne(
      { '_id': new ObjectId(itemId), 'uid': uid }, { $set: {'active': false, 'update_at': new Date()}});
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}
