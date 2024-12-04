import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  gid: String,
  sid: String,
  email: String,
  passhash: String,
  grade_name: String,
  name: String,
  register_time: mongoose.Schema.Types.Mixed,
  last_update: mongoose.Schema.Types.Mixed,
  student: Boolean,
  inits: String
})

export default mongoose.models.User || mongoose.model("User", userSchema);