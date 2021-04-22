import { NextApiRequest, NextApiResponse } from 'next'
import fauna from 'faunadb'

const q = fauna.query
const client = new fauna.Client({
  secret: process.env.FAUNA_SECRET || ''
})

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await client.query(
    q.Create(
      q.Collection('logs'),
      {
        data: {
          ndefSerialNumber: req.body.ndefId,
          createdAt: new Date().getTime()
        }
      }
    )
  )
  res.status(200).json({ message: 'ok' })
}
