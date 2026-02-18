import express from 'express'
import { pool } from '../config/dbConnection.js'
import { authenticateSession } from '../middleware/session_authenticate.js'

const router = express.Router()

router.post('/telegramstatus',authenticateSession, async (req, res) => {
    let client
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'No email provided', status: 'fail' })
        }
        client = await pool.connect()
        const result = await client.query(
            `SELECT t.telegram_user_id FROM telegramusers t
             JOIN userinfo u ON u.userid = t.userid
             WHERE u.email = $1`,
            [email]
        )
        if (result.rowCount === 0) {
            return res.status(200).json({ message: 'Not linked', status: 'not_linked', telegram_user_id: null })
        }
        return res.status(200).json({
            message: 'Linked',
            status: 'linked',
            telegram_user_id: result.rows[0].telegram_user_id
        })
    } catch (error) {
        console.error('Telegram status check error:', error)
        return res.status(500).json({ message: 'Internal Server Error', status: 'fail' })
    } finally {
        client?.release()
    }
})

export default router
