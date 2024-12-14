import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  sid: String,
  time: Date,
  path: { type: String, enum: ['diary', 'marks', 'stats', 'login', 'register'] }
})

export default mongoose.models.Request || mongoose.model("Request", requestSchema);