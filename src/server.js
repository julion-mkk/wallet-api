import express from "express";
import dotenv from "dotenv";
import {initDB} from "./config/db.js";
import rateLimiter from "./middleware/reateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();
app.use(rateLimiter);
app.use(express.json());

//custom simple middleware
/*app.use((req, res, next)=> {
    console.log('Something is happening.');
    next();
})*/

app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;

initDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log("Server is running on port", PORT);
    })
})
