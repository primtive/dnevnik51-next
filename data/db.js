import mongoose from "mongoose";
import EduData from "./models/edu_data"
import GradeName from "./models/grade_name"
import PassRecovery from "./models/pass_recovery"

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
    cached.promise = mongoose.connect(DB_URL, {
      authSource: "admin",
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD
    }).then((mongoose) => {
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

export async function getGradeNames() {
  await connectDB()
  const gradeNames = await GradeName.find({})
  return gradeNames;
}

export async function newPassRecovery(data) {
  await connectDB()
  const pass_recovery = new PassRecovery(data);
  await pass_recovery.save()
}

export async function getPassRecovery(id) {
  await connectDB()
  const pass_recovery = await PassRecovery.findOne({id});
  return pass_recovery
}

export async function updatePassRecovery(id, update) {
  await connectDB()
  const pass_recovery = await PassRecovery.findOneAndUpdate({id}, update);
  await pass_recovery.save()
}