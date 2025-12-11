'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, Zap, Clock, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface StatItemProps {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  index: number;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

function StatCard({ label, value, change, icon: Icon, color, index }: StatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-[1px] bg-gradient-to-r ${color} rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
      />

      {/* Card */}
      <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${color}`}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0 
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div 
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20"
            animate={{ y: isHovered ? -2 : 0 }}
          >
            <ArrowUpRight className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-semibold">{change}</span>
          </motion.div>
        </div>

        {/* Value */}
        <motion.h3 
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          animate={{ scale: isHovered ? 1.02 : 1 }}
        >
          {value}
        </motion.h3>

        {/* Label */}
        <p className="text-gray-400 text-sm">{label}</p>

        {/* Hover indicator line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-b-2xl`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />
      </div>
    </motion.div>
  );
}

const stats = [
  {
    label: 'Total Value Locked',
    value: '$43.7M',
    change: '+24.5%',
    icon: DollarSign,
    color: 'from-green-400 to-emerald-500',
  },
  {
    label: 'Total Zaps',
    value: '128,291',
    change: '+12.3%',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
  },
  {
    label: 'Unique Users',
    value: '15,432',
    change: '+18.7%',
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    label: 'Avg. APY',
    value: '12.5%',
    change: '+2.1%',
    icon: TrendingUp,
    color: 'from-orange-400 to-amber-500',
  },
];

const highlights = [
  { icon: Clock, text: 'Avg. 28s bridge time', color: 'text-cyan-400' },
  { icon: Shield, text: '0 security incidents', color: 'text-green-400' },
  { icon: Activity, text: '99.9% uptime', color: 'text-purple-400' },
];

export function Stats() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Protocol Stats</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Growing <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Every Day</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 py-6 px-8 bg-white/[0.02] rounded-2xl border border-white/5"
        >
          {highlights.map((highlight, i) => (
            <motion.div
              key={highlight.text}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <highlight.icon className={`w-5 h-5 ${highlight.color}`} />
              <span className="text-gray-400 text-sm">{highlight.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
