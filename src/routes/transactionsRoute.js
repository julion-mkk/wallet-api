import express from "express";
import {sql} from "../config/db.js";
import {
    deleteTransactionById,
    getTransactionsByUserId,
    getTransactionSummaryByUserId,
    postTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

router.post('/', postTransaction);

router.get('/:userId', getTransactionsByUserId);

router.get('/summary/:userId', getTransactionSummaryByUserId);

router.delete('/:id', deleteTransactionById);

export default router;
