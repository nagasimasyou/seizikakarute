// API route to add a new politician to Airtable
// This endpoint accepts POST requests with a JSON body containing
// `name`, `party`, `birthDate`, and `age`. It forwards the data to
// the Airtable REST API using credentials stored in environment
// variables. If successful, it returns the created record from
// Airtable. See README or docs for more details.

import type { NextApiRequest, NextApiResponse } from 'next'

interface AddPoliticianRequest {
  name: string
  party: string
  birthDate: string
  age: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    // Only allow POST requests
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { name, party, birthDate, age } = req.body as AddPoliticianRequest

  if (!name || !party || !birthDate || typeof age !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Construct the Airtable API endpoint. Table name may contain spaces
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableName = process.env.AIRTABLE_TABLE_NAME || ''
    const apiKey = process.env.AIRTABLE_API_KEY

    if (!baseId || !tableName || !apiKey) {
      return res.status(500).json({ error: 'Airtable credentials are not configured' })
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          名前: name,
          政党: party,
          生年月日: birthDate,
          満年齢: age,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message || 'Failed to create record'
      return res.status(response.status).json({ error: message })
    }

    return res.status(200).json(data)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error' })
  }
}