'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Star, TrendingUp, Zap, Shield, Flame, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { VaultModal } from '@/components/modals/VaultModal';

interface Vault {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: string;
  token: string;
  tokenIcon: string;
  risk: 'Low' | 'Medium' | 'High';
  protocol: string;
  featured?: boolean;
  trending?: boolean;
  chainCount?: number;
}

const vaults: Vault[] = [
  {
    id: '1',
    name: 'USDC Stable Yield',
    description: 'Low-risk stablecoin lending across Aave & Compound. Perfect for conservative yield seekers.',
    apy: 5.2,
    tvl: '$12.4M',
    token: 'USDC',
    tokenIcon: '💵',
    risk: 'Low',
    protocol: 'Aave + Compound',
    featured: true,
    chainCount: 7,
  },
  {
    id: '2',
    name: 'ETH Liquid Staking',
    description: 'Earn staking rewards while keeping your ETH liquid. Powered by Lido derivatives.',
    apy: 8.1,
    tvl: '$8.2M',
    token: 'ETH',
    tokenIcon: '💎',
    risk: 'Low',
    protocol: 'Lido + Rocket Pool',
    chainCount: 5,
  },
  {
    id: '3',
    name: 'Delta Neutral BTC',
    description: 'Market-neutral strategy capturing funding rates on perpetual exchanges.',
    apy: 12.5,
    tvl: '$5.6M',
    token: 'USDC',
    tokenIcon: '⚖️',
    risk: 'Medium',
    protocol: 'GMX + dYdX',
    trending: true,
    chainCount: 4,
  },
  {
    id: '4',
    name: 'Leveraged USDC',
    description: 'Amplified stablecoin yields using recursive lending. Higher risk, higher reward.',
    apy: 18.2,
    tvl: '$3.2M',
    token: 'USDC',
    tokenIcon: '🚀',
    risk: 'High',
    protocol: 'Morpho + Euler',
    chainCount: 3,
  },
  {
    id: '5',
    name: 'ETH Covered Calls',
    description: 'Generate premium income by selling call options on your ETH holdings.',
    apy: 25.4,
    tvl: '$2.1M',
    token: 'ETH',
    tokenIcon: '📈',
    risk: 'High',
    protocol: 'Ribbon + Lyra',
    chainCount: 2,
  },
  {
    id: '6',
    name: 'POL Ecosystem Yield',
    description: 'Optimized farming across native Polygon DeFi protocols.',
    apy: 11.8,
    tvl: '$4.5M',
    token: 'POL',
    tokenIcon: '🟣',
    risk: 'Medium',
    protocol: 'QuickSwap + Balancer',
    chainCount: 1,
  },
  {
    id: '7',
    name: 'zkEVM Alpha',
    description: 'Early access to emerging zkEVM protocols. High risk, high potential rewards.',
    apy: 32.5,
    tvl: '$890K',
    token: 'ETH',
    tokenIcon: '⚡',
    risk: 'High',
    protocol: 'Native zkEVM',
    trending: true,
    chainCount: 2,
  },
  {
    id: '8',
    name: 'Real Yield Index',
    description: 'Diversified exposure to protocols generating real revenue, not emissions.',
    apy: 14.2,
    tvl: '$6.8M',
    token: 'USDC',
    tokenIcon: '📊',
    risk: 'Medium',
    protocol: 'GMX + GNS + SNX',
    chainCount: 6,
  },
];

const riskColors = {
  Low: 'text-green-400 bg-green-400/10 border-green-400/30',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  High: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const riskIcons = {
  Low: Shield,
  Medium: TrendingUp,
  High: Flame,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function VaultGrid() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Vaults');
  const [hoveredVault, setHoveredVault] = useState<string | null>(null);

  const filters = [
    { label: 'All Vaults', icon: Sparkles },
    { label: 'Low Risk', icon: Shield },
    { label: 'Medium Risk', icon: TrendingUp },
    { label: 'High Risk', icon: Flame },
    { label: 'USDC', icon: Lock },
    { label: 'ETH', icon: Zap },
  ];

  const filteredVaults = vaults.filter((vault) => {
    if (activeFilter === 'All Vaults') return true;
    if (activeFilter === 'Low Risk') return vault.risk === 'Low';
    if (activeFilter === 'Medium Risk') return vault.risk === 'Medium';
    if (activeFilter === 'High Risk') return vault.risk === 'High';
    if (activeFilter === 'USDC') return vault.token === 'USDC';
    if (activeFilter === 'ETH') return vault.token === 'ETH';
    return true;
  });

  return (
    <section id="vaults" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Cross-Chain Yield</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Yield{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Vaults
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Choose from curated vaults across the Polygon ecosystem.
            Deposit from <span className="text-white font-medium">any chain</span>, we handle the rest.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.label;
            return (
              <motion.button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                {filter.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Vault Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredVaults.map((vault) => {
              const RiskIcon = riskIcons[vault.risk];
              return (
                <motion.div
                  key={vault.id}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredVault(vault.id)}
                  onHoverEnd={() => setHoveredVault(null)}
                  onClick={() => setSelectedVault(vault)}
                  className="group relative cursor-pointer"
                >
                  {/* Card Glow Effect */}
                  <motion.div
                    className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                    animate={{
                      backgroundPosition: hoveredVault === vault.id ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                  />

                  {/* Card Content */}
                  <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
                    {/* Badges */}
                    <div className="absolute -top-3 -right-3 flex gap-2">
                      {vault.featured && (
                        <motion.div
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg shadow-amber-500/30"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-3 h-3" />
                          Featured
                        </motion.div>
                      )}
                      {vault.trending && (
                        <motion.div
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg shadow-green-500/30"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </motion.div>
                      )}
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-2xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {vault.tokenIcon}
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all text-sm">
                            {vault.name}
                          </h3>
                          <p className="text-xs text-gray-500">{vault.protocol}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{vault.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-black/20 rounded-xl">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">APY</p>
                        <motion.p
                          className="text-lg font-bold text-green-400"
                          animate={{ scale: hoveredVault === vault.id ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {vault.apy}%
                        </motion.p>
                      </div>
                      <div className="text-center border-x border-white/5">
                        <p className="text-xs text-gray-500 mb-1">TVL</p>
                        <p className="text-sm font-bold text-white">{vault.tvl}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Chains</p>
                        <p className="text-sm font-bold text-purple-400">{vault.chainCount || 1}</p>
                      </div>
                    </div>

                    {/* Risk Badge & CTA */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${riskColors[vault.risk]}`}
                      >
                        <RiskIcon className="w-3 h-3" />
                        {vault.risk} Risk
                      </span>
                      <motion.div
                        className="flex items-center gap-1 text-purple-400 text-sm font-medium"
                        animate={{ x: hoveredVault === vault.id ? 4 : 0 }}
                      >
                        Deposit
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {filteredVaults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-400 text-lg">No vaults match your filter.</p>
              <p className="text-gray-500 text-sm mt-1">Try a different category.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors"
          >
            View All Vaults
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Vault Modal */}
      <AnimatePresence>
        {selectedVault && (
          <VaultModal vault={selectedVault} onClose={() => setSelectedVault(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
