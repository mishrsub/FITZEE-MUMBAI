    // import dotenv from "dotenv";
    // dotenv.config();
import "dotenv/config.js"
import { app } from "./app.js";
import { connectDB } from "./db/conn.js";
const PORT = 80 || process.env.PORT || 8001;

app.listen(PORT, async () => {
    console.log(`server is listening to the port ${PORT}`);
    await connectDB();
});
