import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://phucdz:phuc9807@shooly.e65ipe6.mongodb.net/?appName=shooly";

const client = new MongoClient(uri);

let isConnected = false;

export async function getDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db("supershoply");
}
