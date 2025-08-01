import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPoliticians } from '@/lib/airtable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const data = await fetchPoliticians();
    res.status(200).json({ records: data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
}