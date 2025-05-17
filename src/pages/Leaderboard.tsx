import React from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  winRate: string;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "CryptoChampion", score: 2500, winRate: "75%" },
  { rank: 2, username: "BlockMaster", score: 2350, winRate: "71%" },
  { rank: 3, username: "NFTWarrior", score: 2200, winRate: "68%" },
  { rank: 4, username: "TokenKing", score: 2100, winRate: "65%" },
  { rank: 5, username: "ChainLegend", score: 2000, winRate: "63%" },
];

function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((entry) => (
                <tr key={entry.rank} className={entry.rank === 1 ? "bg-yellow-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{entry.rank}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.winRate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;