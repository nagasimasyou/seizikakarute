import { useEffect, useState } from 'react';
import PoliticianCard from '@/components/PoliticianCard';

type Politician = {
  id: string;
  fields: {
    Name: string;
    Party?: string;
    EvaluationScore?: number;
  };
};

export default function Home() {
  const [records, setRecords] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/politicians');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRecords(data.records);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">政治家一覧</h1>
      {loading && <p>読み込み中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {records.map((rec) => (
          <PoliticianCard
            key={rec.id}
            id={rec.id}
            name={rec.fields.Name}
            party={rec.fields.Party}
            score={rec.fields.EvaluationScore}
          />
        ))}
      </div>
    </div>
  );
}