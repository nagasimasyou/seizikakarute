import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Politician = {
  id: string;
  fields: Record<string, any>;
};

export default function PoliticianDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [record, setRecord] = useState<Politician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/politicians/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRecord(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p className="p-4">読み込み中...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!record) return <p className="p-4">データが見つかりません。</p>;

  const { fields } = record;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{fields.Name}</h1>
      <p className="mb-4">政党: {fields.Party || '不明'}</p>
      {fields.EvaluationScore !== undefined && (
        <p className="mb-4">評価スコア: {fields.EvaluationScore}</p>
      )}
      {/* Additional fields */}
      {fields.PolicyTags && (
        <div className="mb-4">
          <h2 className="font-semibold">政策タグ</h2>
          <ul className="list-disc list-inside">
            {fields.PolicyTags.map((tag: any) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
      {fields.Speeches && Array.isArray(fields.Speeches) && (
        <div className="mb-4">
          <h2 className="font-semibold">発言履歴</h2>
          <ul className="list-disc list-inside">
            {fields.Speeches.map((speech: any, idx: number) => (
              <li key={idx}>{speech}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}