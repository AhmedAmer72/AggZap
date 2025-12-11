'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PortfolioPosition {
  id: string;
  vault: string;
  vaultType: string;
  chain: string;
  depositToken: string;
  depositedAmount: string;
  currentValue: string;
  lpTokens: string;
  apy: number;
  pnl: number;
  pnlPercent: number;
  riskLevel: number;
  depositDate: Date;
}

interface PortfolioStats {
  totalDeposited: number;
  totalValue: number;
  totalPnL: number;
  avgAPY: number;
  positions: number;
}

// Mock portfolio data - replace with real data from contracts
const mockPositions: PortfolioPosition[] = [
  {
    id: '1',
    vault: 'USDC Stable Yield',
    vaultType: 'Stable Yield',
    chain: 'Polygon zkEVM',
    depositToken: 'USDC',
    depositedAmount: '5,000',
    currentValue: '5,125.50',
    lpTokens: '4,987.25',
    apy: 5.2,
    pnl: 125.50,
    pnlPercent: 2.51,
    riskLevel: 1,
    depositDate: new Date(Date.now() - 30 * 86400000),
  },
  {
    id: '2',
    vault: 'ETH Liquid Staking',
    vaultType: 'Liquid Staking',
    chain: 'Polygon zkEVM',
    depositToken: 'ETH',
    depositedAmount: '2.5',
    currentValue: '2.58',
    lpTokens: '2.49',
    apy: 8.1,
    pnl: 0.08,
    pnlPercent: 3.2,
    riskLevel: 2,
    depositDate: new Date(Date.now() - 45 * 86400000),
  },
  {
    id: '3',
    vault: 'Delta Neutral BTC',
    vaultType: 'Delta Neutral',
    chain: 'Polygon zkEVM',
    depositToken: 'USDC',
    depositedAmount: '10,000',
    currentValue: '10,450.00',
    lpTokens: '9,850.00',
    apy: 12.5,
    pnl: 450.00,
    pnlPercent: 4.5,
    riskLevel: 3,
    depositDate: new Date(Date.now() - 60 * 86400000),
  },
  {
    id: '4',
    vault: 'Leveraged USDC',
    vaultType: 'Leveraged Yield',
    chain: 'Polygon zkEVM',
    depositToken: 'USDC',
    depositedAmount: '3,000',
    currentValue: '3,180.00',
    lpTokens: '2,940.00',
    apy: 18.2,
    pnl: 180.00,
    pnlPercent: 6.0,
    riskLevel: 4,
    depositDate: new Date(Date.now() - 15 * 86400000),
  },
];

const mockStats: PortfolioStats = {
  totalDeposited: 18000,
  totalValue: 18955.50,
  totalPnL: 955.50,
  avgAPY: 10.5,
  positions: 4,
};

const riskLabels = ['', 'Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'];
const riskColors = ['', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];

export default function Portfolio() {
  const [positions] = useState<PortfolioPosition[]>(mockPositions);
  const [stats] = useState<PortfolioStats>(mockStats);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  return (
    <section className="py-16 px-4" id="portfolio">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your positions across all AggZap vaults
          </p>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 md:p-6">
            <div className="text-sm text-gray-400 mb-1">Total Value</div>
            <div className="text-2xl md:text-3xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="text-sm text-gray-400 mb-1">Total Deposited</div>
            <div className="text-xl md:text-2xl font-bold">
              ${stats.totalDeposited.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="text-sm text-gray-400 mb-1">Total P&L</div>
            <div className={`text-xl md:text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="text-sm text-gray-400 mb-1">Avg APY</div>
            <div className="text-xl md:text-2xl font-bold text-purple-400">
              {stats.avgAPY}%
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="text-sm text-gray-400 mb-1">Positions</div>
            <div className="text-xl md:text-2xl font-bold">
              {stats.positions}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Portfolio Allocation</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', 'ALL'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Bars */}
          <div className="space-y-4">
            {positions.map((pos, index) => {
              const percentage = (parseFloat(pos.currentValue.replace(',', '')) / stats.totalValue) * 100;
              return (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{pos.vault}</span>
                    <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, 
                          ${index === 0 ? '#8B5CF6' : index === 1 ? '#3B82F6' : index === 2 ? '#10B981' : '#F59E0B'} 0%,
                          ${index === 0 ? '#D946EF' : index === 1 ? '#06B6D4' : index === 2 ? '#34D399' : '#FBBF24'} 100%)`,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Positions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Active Positions</h3>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPosition(selectedPosition === position.id ? null : position.id)}
                className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 md:p-6 cursor-pointer transition-all ${
                  selectedPosition === position.id
                    ? 'border-purple-500/50 bg-purple-500/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Vault Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-2xl">
                      {position.vaultType === 'Stable Yield' && '🏦'}
                      {position.vaultType === 'Liquid Staking' && '💎'}
                      {position.vaultType === 'Delta Neutral' && '⚖️'}
                      {position.vaultType === 'Leveraged Yield' && '🚀'}
                    </div>
                    <div>
                      <div className="font-semibold">{position.vault}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{position.chain}</span>
                        <span>•</span>
                        <span className={riskColors[position.riskLevel]}>
                          {riskLabels[position.riskLevel]} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Position Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <div>
                      <div className="text-sm text-gray-400">Deposited</div>
                      <div className="font-semibold">
                        {position.depositedAmount} {position.depositToken}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Current Value</div>
                      <div className="font-semibold">
                        {position.currentValue} {position.depositToken}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">P&L</div>
                      <div className={`font-semibold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}{position.pnl} ({position.pnlPercent}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">APY</div>
                      <div className="font-semibold text-purple-400">{position.apy}%</div>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <motion.div
                    animate={{ rotate: selectedPosition === position.id ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.div>
                </div>

                {/* Expanded Details */}
                {selectedPosition === position.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-400">LP Tokens</div>
                        <div className="font-medium">{position.lpTokens}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Deposit Date</div>
                        <div className="font-medium">
                          {position.depositDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Days Active</div>
                        <div className="font-medium">
                          {Math.floor((Date.now() - position.depositDate.getTime()) / 86400000)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Strategy</div>
                        <div className="font-medium">{position.vaultType}</div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <button className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors">
                        Deposit More
                      </button>
                      <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                        Withdraw
                      </button>
                      <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                        View Analytics
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {positions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No positions yet</h3>
            <p className="text-gray-400 mb-6">
              Start earning yield by depositing into a vault
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Explore Vaults
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
