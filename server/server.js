import 'dotenv/config'
import connectDB from './src/configs/db.js'
import app from './app.js'

await connectDB()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})

export default app
