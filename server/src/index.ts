
import * as dotenv from "dotenv"
dotenv.config()

import app from "./server"

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})