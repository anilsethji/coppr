'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import CreatorProfileContent from './CreatorProfileContent';

interface CreatorProfileModalProps {
  handle: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatorProfileModal({ handle, isOpen, onClose }: CreatorProfileModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && handle) {
      setLoading(true);
      fetch(`/api/creators/${handle}`)
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, handle]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-12 bottom-12 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[#080C14] border border-white/10 rounded-[32px] z-[101] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/40 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all z-[110]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="w-full h-full overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">ACCESSING CREATOR PROTOCOL...</span>
                </div>
              ) : data ? (
                <CreatorProfileContent initialData={data} isModal={true} onFollowToggle={() => {}} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                    Failed to load profile.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
