import Airtable from 'airtable';

// Initialize Airtable using environment variables.
// These variables should be configured in Vercel or .env.local.
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_NAME;

if (!apiKey || !baseId || !tableName) {
  console.warn('Airtable environment variables are not defined.');
}

const base = new Airtable({ apiKey }).base(baseId || '');

export async function fetchPoliticians() {
  const records = await base(tableName || '').select().all();
  return records.map((record) => ({
    id: record.id,
    fields: record.fields,
  }));
}

export async function fetchPoliticianById(id: string) {
  const record = await base(tableName || '').find(id);
  return { id: record.id, fields: record.fields };
}