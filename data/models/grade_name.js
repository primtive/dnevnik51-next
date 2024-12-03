import mongoose from "mongoose";

const gradeNameSchema = new mongoose.Schema({
  gid: String,
  name: String
})

export default mongoose.models.GradeName || mongoose.model("GradeName", gradeNameSchema);