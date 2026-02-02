import dotenv from 'dotenv'
import { enqueueMindNightReport } from '../queue/gmailMessages.js'

dotenv.config()

async function run() {
  try {
    console.log('Triggering MidNight report enqueue...')
    await enqueueMindNightReport()
    console.log('MidNight report enqueue finished')
  } catch (error) {
    console.error('Failed to enqueue MidNight report:', error)
  } finally {
    process.exit(0)
  }
}

run()
