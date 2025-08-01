import React from 'react';

export type PoliticianCardProps = {
  id: string;
  name: string;
  party?: string;
  score?: number;
};

export const PoliticianCard: React.FC<PoliticianCardProps> = ({ id, name, party, score }) => {
  return (
    <a
      href={`/politicians/${id}`}
      className="block border rounded p-4 shadow hover:bg-gray-100 transition-colors"
    >
      <h2 className="text-lg font-bold mb-1">{name}</h2>
      {party && <p className="text-sm text-gray-700">政党: {party}</p>}
      {score !== undefined && <p className="text-sm text-gray-700">評価: {score}</p>}
    </a>
  );
};

export default PoliticianCard;