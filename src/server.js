import express from "express";
import dotenv from "dotenv";
import {initDB} from "./config/db.js";
import rateLimiter from "./middleware/reateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV !== "production") {
    job.start();
}
app.use(rateLimiter);
app.use(express.json());

//custom simple middleware
/*app.use((req, res, next)=> {
    console.log('Something is happening.');
    next();
})*/

app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;
app.get('/api/health', (req, res)=> {
    res.status(200).json({status: 'OK'});
})
initDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log("Server is running on port", PORT);
    })
})
