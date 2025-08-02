import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPoliticianById } from '@/lib/airtable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method !== 'GET' || typeof id !== 'string') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const record = await fetchPoliticianById(id);
    res.status(200).json(record);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
}