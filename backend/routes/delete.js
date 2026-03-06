import express from 'express'
import {pool} from '../config/dbConnection.js'
import { limiter } from '../middleware/express_rate_limit.js';
import { authenticateSession } from '../middleware/session_authenticate.js';

const router = express.Router();

router.delete('/deletetask/:userid/:taskid', authenticateSession, limiter, async (req, res) => {
    let client
    try {
        client = await pool.connect()
        const { userid, taskid } = req.params
        
        if (!userid || !taskid) {
            return res.status(400).json({ message: "Missing userid or taskid" })
        }

        // First check if the task exists for this user
        const checkResponse = await client.query(
            `SELECT * FROM taskuser WHERE userid=$1 AND taskid=$2`,
            [userid, taskid]
        )

        if (checkResponse.rowCount === 0) {
            return res.status(404).json({ message: "Task not found for this user" })
        }

        // Delete the task from taskuser
        const deleteResponse = await client.query(
            `DELETE FROM taskuser WHERE userid=$1 AND taskid=$2`,
            [userid, taskid]
        )

        if (deleteResponse.rowCount === 0) {
            return res.status(400).json({ message: "Could not delete the task" })
        }

        return res.status(200).json({ message: "Task successfully deleted" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    } finally {
        client?.release()
    }
})

export default router
