import mongoose from 'mongoose'
import { connectDB, getGradeNames } from './db'
import User from './models/user'
import crypto from 'crypto'
import { makeid } from './utils'

function hashP(password) {
  return crypto.createHash('md5').update(password).digest("hex")
}

function compare(password, hash) {
  return hashP(password) == hash
}

export async function getUser(filter) {
  await connectDB()
  const user = await User.findOneAndUpdate(filter, { last_update: new Date() }, { new: true })
  if (!user) return null
  await user.save()
  return user
}

export async function resetPassword(email, password) {
  await connectDB()
  const user = await User.findOneAndUpdate({email}, { passhash: hashP(password), last_update: new Date() })
  await user.save()
}

export async function authWithCredentials(credentials) {
  await connectDB()
  const user = await User.findOne({ email: credentials.email })

  if (!user) return { ok: false, message: 'Пользователь не найден' }
  if (compare(credentials.password, user.passhash)) return { ok: true, message: '', user }
  else return { ok: false, message: 'Неверный пароль', user }
}

export async function createUser(credentials, student) {
  await connectDB()

  const inits = student.text.split(' ').slice(0, 2).map(x => x[0]).join('')
  const grade_name = (await getGradeNames()).find(x => x.gid == credentials.grade).name

  const user = new User({
    gid: credentials.grade,
    sid: student.id,
    token: makeid(),
    email: credentials.email,
    passhash: hashP(credentials.password),
    grade_name: grade_name,
    name: student.text,
    // register_time: new Date(),
    // last_update: new Date(),
    student: true,
    inits: inits
  })
  return await user.save();
}