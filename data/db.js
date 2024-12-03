import mongoose from "mongoose";
import EduData from "./models/edu_data"
import GradeName from "./models/grade_name"
import User from "./models/user"

const DB_URL = process.env.MONGODB_URL

if (!DB_URL) throw new Error('no MONGODB_URL in .env')

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(DB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function getEduData(gid) {
  await connectDB()
  const data = await EduData.findOne({ gid });
  return data;
}
export async function setEduData(data) {
  await connectDB()
  const edu_data = await EduData.findOneAndUpdate({ gid: data.gid }, data);
  if (!edu_data) {
    await new EduData(data).save();
  } else {
    await edu_data.save()
  }
}

export async function getUser(filter) {
  await connectDB()
  const user = await User.find(filter)
  return user
}

export async function getGradeNames() {
  await connectDB()
  const gradeNames = await GradeName.find({})
  return gradeNames;
}
