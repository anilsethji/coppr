'use client';

import React from 'react';
import VaultView from '@/components/dashboard/VaultView';
import { motion } from 'framer-motion';

export default function BotsPage() {
  return (
    <div className="min-h-screen pb-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <VaultView typeFilter="MT5_EA" />
      </motion.div>
    </div>
  );
}
