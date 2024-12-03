import mongoose from "mongoose";

const eduDataSchema = new mongoose.Schema({
  gid: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    },
  },
  last_update: Number,
  students: [{
    sid: String,
    name: String,
    subjects: [
      {
        average: Number,
        marks: [Number],
        name: String
      }
    ]
  }]
})

export default mongoose.models.EduData || mongoose.model("EduData", eduDataSchema);