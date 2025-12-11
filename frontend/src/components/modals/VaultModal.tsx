'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, CheckCircle2, AlertCircle, Zap, Shield, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ZapProgress } from '@/components/ui/ZapProgress';

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
}

interface VaultModalProps {
  vault: Vault;
  onClose: () => void;
}

type ZapStep = 'input' | 'confirm' | 'zapping' | 'success' | 'error';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  },
};

export function VaultModal({ vault, onClose }: VaultModalProps) {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<ZapStep>('input');
  const [currentZapStep, setCurrentZapStep] = useState(0);

  // Simulate zapping process
  useEffect(() => {
    if (step === 'zapping') {
      const timer = setInterval(() => {
        setCurrentZapStep(prev => {
          if (prev >= 4) {
            clearInterval(timer);
            setTimeout(() => setStep('success'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('zapping');
    setCurrentZapStep(0);
  };

  const estimatedReceive = amount ? (parseFloat(amount) * 0.999).toFixed(2) : '0';
  const protocolFee = amount ? (parseFloat(amount) * 0.001).toFixed(4) : '0';

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg glass-strong rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center text-xl">
                {vault.tokenIcon}
              </div>
              <div>
                <h2 className="font-semibold text-white">{vault.name}</h2>
                <p className="text-xs text-dark-400">{vault.protocol}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'input' && (
              <InputStep
                vault={vault}
                amount={amount}
                setAmount={setAmount}
                estimatedReceive={estimatedReceive}
                protocolFee={protocolFee}
                isConnected={isConnected}
                onDeposit={handleDeposit}
              />
            )}

            {step === 'confirm' && (
              <ConfirmStep
                vault={vault}
                amount={amount}
                estimatedReceive={estimatedReceive}
                protocolFee={protocolFee}
                onConfirm={handleConfirm}
                onBack={() => setStep('input')}
              />
            )}

            {step === 'zapping' && (
              <ZappingStep
                vault={vault}
                amount={amount}
                currentStep={currentZapStep}
              />
            )}

            {step === 'success' && (
              <SuccessStep
                vault={vault}
                amount={amount}
                estimatedReceive={estimatedReceive}
                onClose={onClose}
              />
            )}

            {step === 'error' && (
              <ErrorStep
                onRetry={() => setStep('input')}
                onClose={onClose}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Input Step Component
function InputStep({ 
  vault, 
  amount, 
  setAmount, 
  estimatedReceive, 
  protocolFee,
  isConnected,
  onDeposit 
}: {
  vault: Vault;
  amount: string;
  setAmount: (val: string) => void;
  estimatedReceive: string;
  protocolFee: string;
  isConnected: boolean;
  onDeposit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* APY Banner */}
      <div className="bg-gradient-to-r from-success-500/10 to-success-500/5 rounded-xl p-4 mb-6 border border-success-500/20">
        <div className="flex items-center justify-between">
          <span className="text-dark-300">Current APY</span>
          <span className="text-2xl font-bold text-success-400">{vault.apy}%</span>
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-dark-400">Deposit Amount</label>
          <span className="text-xs text-dark-500">Balance: 1,234.56 {vault.token}</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full input-glow text-2xl font-semibold pr-24"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
              onClick={() => setAmount('1234.56')}
              className="text-xs text-accent-400 hover:text-accent-300"
            >
              MAX
            </button>
            <span className="text-dark-400 font-medium">{vault.token}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-3 mb-6 p-4 bg-dark-900/50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-400">You will receive</span>
          <span className="text-white font-medium">{estimatedReceive} zapLP</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-400">Protocol fee (0.1%)</span>
          <span className="text-dark-300">{protocolFee} {vault.token}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-400">Destination</span>
          <span className="text-accent-400">Polygon zkEVM</span>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-3 bg-dark-900/30 rounded-lg mb-6">
        <Shield className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-dark-400">
          Your funds are secured by the Polygon AggLayer. The bridgeAndCall() operation is atomic - 
          if anything fails, your funds are returned to your wallet.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDeposit}
        disabled={!isConnected || !amount || parseFloat(amount) <= 0}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {!isConnected ? (
          'Connect Wallet'
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Zap {amount || '0'} {vault.token}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// Confirm Step Component
function ConfirmStep({
  vault,
  amount,
  estimatedReceive,
  protocolFee,
  onConfirm,
  onBack,
}: {
  vault: Vault;
  amount: string;
  estimatedReceive: string;
  protocolFee: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-500/20 flex items-center justify-center">
          <Zap className="w-8 h-8 text-accent-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Confirm Zap</h3>
        <p className="text-dark-400">Review your cross-chain deposit</p>
      </div>

      {/* Flow Visualization */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-1">From</p>
            <p className="font-semibold text-white">Polygon PoS</p>
            <p className="text-lg font-bold text-accent-400">{amount} {vault.token}</p>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-0.5 bg-gradient-to-r from-accent-500 to-cyan-500 relative">
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-y-0 w-1/4 bg-white/50"
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-1">To</p>
            <p className="font-semibold text-white">zkEVM</p>
            <p className="text-lg font-bold text-success-400">{estimatedReceive} zapLP</p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-dark-400">Protocol Fee</span>
          <span className="text-white">{protocolFee} {vault.token}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Estimated Time</span>
          <span className="text-white">~30 seconds</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Destination Vault</span>
          <span className="text-white">{vault.name}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 glass rounded-xl font-medium text-dark-300 hover:text-white transition-colors"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="flex-1 btn-primary"
        >
          <span>Confirm Zap</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Zapping Step Component
function ZappingStep({
  vault,
  amount,
  currentStep,
}: {
  vault: Vault;
  amount: string;
  currentStep: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center"
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">Zapping in Progress</h3>
        <p className="text-dark-400">Cross-chain magic happening...</p>
      </div>

      <ZapProgress currentStep={currentStep} amount={amount} token={vault.token} />
    </motion.div>
  );
}

// Success Step Component
function SuccessStep({
  vault,
  amount,
  estimatedReceive,
  onClose,
}: {
  vault: Vault;
  amount: string;
  estimatedReceive: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center"
      >
        <CheckCircle2 className="w-10 h-10 text-success-400" />
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-2">Zap Successful! 🎉</h3>
      <p className="text-dark-400 mb-6">Your funds are now earning yield on zkEVM</p>

      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-400">Deposited</span>
          <span className="font-semibold text-white">{amount} {vault.token}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-400">Received</span>
          <span className="font-semibold text-success-400">{estimatedReceive} zapLP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dark-400">Earning APY</span>
          <span className="font-semibold text-accent-400">{vault.apy}%</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 px-6 py-3 glass rounded-xl font-medium text-dark-300 hover:text-white transition-colors flex items-center justify-center gap-2">
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="flex-1 btn-primary"
        >
          <span>Done</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Error Step Component
function ErrorStep({
  onRetry,
  onClose,
}: {
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-4"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">Zap Failed</h3>
      <p className="text-dark-400 mb-6">
        Don't worry - your funds are safe. The transaction was reverted.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 glass rounded-xl font-medium text-dark-300 hover:text-white transition-colors"
        >
          Close
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="flex-1 btn-primary"
        >
          <span>Try Again</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
