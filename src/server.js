// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config.js"
import { app } from "./app.js";
import { connectDB } from "./db/conn.js";
const PORT = process.env.PORT || 8001;

import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sslServer = https.createServer({
    key:fs.readFileSync(path.join(__dirname,"../cert","ecdsa.key")),
    cert:fs.readFileSync(path.join(__dirname,"../cert","ecdsa.cert")),
},app);

sslServer.listen(PORT, async () => {
    console.log(`server is listening to the port ${PORT}`);
    await connectDB();
});

// app.listen(PORT, async () => {
//     console.log(`server is listening to the port ${PORT}`);
//     await connectDB();
// });

//generate the private key