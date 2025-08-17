import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;

  const baseId = AIRTABLE_BASE_ID;
  const tableName = AIRTABLE_TABLE_NAME || '';
  const apiKey = AIRTABLE_API_KEY;

  if (!baseId || !tableName || !apiKey) {
    return res.status(500).json({ error: 'Airtable credentials are not configured' });
  }

  // 共通のレコード追加処理を関数化
  const addRecord = async (
    name: string,
    party: string,
    birthDate: string,
    ageNum: number
  ) => {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
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
          満年齢: ageNum,
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || 'Failed to create record';
      return res.status(response.status).json({ error: message });
    }
    return res.status(200).json(data);
  };

  if (req.method === 'GET') {
    // URL クエリから値を取得
    const { name, party, birthDate, age } = req.query;

    if (!name || !party || !birthDate || !age) {
      return res.status(400).json({ error: 'Missing required fields in query params' });
    }

    const ageNum = parseInt(age as string, 10);
    if (Number.isNaN(ageNum)) {
      return res.status(400).json({ error: 'Age must be a number' });
    }

    return await addRecord(String(name), String(party), String(birthDate), ageNum);
  } else if (req.method === 'POST') {
    // リクエストボディから値を取得
    const { name, party, birthDate, age } = req.body;
    if (!name || !party || !birthDate || typeof age !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    return await addRecord(name, party, birthDate, age);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
