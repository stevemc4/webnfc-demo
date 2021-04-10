import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  console.log(req.body)
  res.status(200).json({ message: 'ok' })
}
