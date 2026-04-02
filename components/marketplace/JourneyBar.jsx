'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = ['Browse', 'Strategy', 'Creator', 'Checkout', 'Subscribed'];

export default function JourneyBar({ currentStep = 0, completedSteps = [] }) {
  return (
    <div className="w-full max-w-[600px] mx-auto py-6 flex items-center justify-between px-4">
      {steps.map((step, index) => {
        const isUpcoming = index > currentStep;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep || completedSteps.includes(index);

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2 relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#00E676' : isActive ? '#FFD700' : 'transparent',
                  borderColor: isCompleted ? '#00E676' : isActive ? '#FFD700' : 'rgba(255,255,255,0.15)',
                  scale: isActive ? 1.1 : 1
                }}
                className={`w-7 h-7 rounded-full border-1.5 flex items-center justify-center z-10`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-[11px] font-black ${isActive ? 'text-black' : 'text-white/30'}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span className={`text-[9px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap ${isActive ? 'text-[#FFD700]' : isCompleted ? 'text-[#00E676]' : 'text-white/20'}`}>
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] bg-white/10 mx-2 relative -top-3">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                    backgroundColor: '#00E676'
                  }}
                  className="h-full"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
