import {sql} from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const transactions = await sql`
       SELECT * FROM transactions WHERE user_id= ${userId} ORDER BY created_at DESC
    `;

        res.status(200).json(transactions);
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}

export const postTransaction = async (req, res) => {
    try {
        const {title, amount, category, user_id} = req.body;
        if(!title || amount === undefined || !category || !user_id) {
            return res.status(400).json({message: "All fields are required"});
        }
        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *`
        console.log(transaction);
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}

export const getTransactionSummaryByUserId = async (req, res) => {
    try {
        const {userId} = req.params;
        /*const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `*/
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND category = 'income'
        `

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND category = 'expense'
        `

        res.status(200).json({
            balance: incomeResult[0].income - expenseResult[0].expense,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}

export const deleteTransactionById = async (req, res)=> {
    try {
        const id = req.params.id;
        const result = await sql`
            DELETE FROM transactions WHERE id= ${id}
            RETURNING *
        `
        if(result.length === 0) {
            return res.status(404).json({message: "Transaction not found"});
        }
        res.status(200).json(result);
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}
