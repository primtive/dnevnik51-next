import mongoose from "mongoose";

const passRecoverySchema = new mongoose.Schema({
  email: String,
  id: String,
  active: Boolean
})

export default mongoose.models.PassRecovery || mongoose.model("PassRecovery", passRecoverySchema);