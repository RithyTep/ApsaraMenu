import fs from "fs"
import { createClient } from "@libsql/client"

const client = createClient({
  url: "libsql://apsaramenu-rithy.aws-ap-northeast-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjU5Mzk0MTcsImlkIjoiODE0YjVlODctMTIwYy00ZWNkLWFkOTgtYTc4MTMyODE0NDVhIiwicmlkIjoiMmY4MGM0NmYtNmZlYy00NGMxLWJmOTAtZGNjMjRmOWU3NTAzIn0.J3fT1B4s_CdAl8TT3QuT--ApX11ZAI7JlGZgZq9TvJG2ePDUNeU2sX-mtZJthbKLJtyznQNB0Yb9ZXX-sAEYBg"
})

async function run() {
  const sql = fs.readFileSync("/tmp/full_schema.sql", "utf-8")

  // Split by semicolon and execute each statement
  const statements = sql.split(";").filter(s => {
    const trimmed = s.trim()
    return trimmed.length > 0 && !trimmed.startsWith("--")
  })

  let count = 0
  let errors = 0

  for (const stmt of statements) {
    const trimmed = stmt.trim()
    if (
      !trimmed ||
      trimmed.startsWith("--") ||
      trimmed.toLowerCase().startsWith("pragma")
    )
      continue

    try {
      await client.execute(trimmed)
      count++
    } catch (err) {
      // Ignore 'table already exists' errors
      if (!err.message.includes("already exists")) {
        errors++
        if (errors <= 5) {
          console.log("Error on:", trimmed.substring(0, 80) + "...")
          console.log("Error:", err.message)
          console.log("---")
        }
      }
    }
  }

  console.log("Executed", count, "statements")
  console.log("Errors:", errors)

  // Verify tables exist
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  )
  console.log("\nTables created:")
  tables.rows.forEach(r => console.log("  -", r.name))
}

run().catch(console.error)
