"use client";
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function PriceTicker() {
  const [price, setPrice] = useState(2340.50);
  const [change, setChange] = useState(1.25);
  const [isUp, setIsUp] = useState(true);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const volatility = (Math.random() - 0.5) * 5; // -2.5 to 2.5
      setPrice(prev => {
        const newPrice = prev + volatility;
        setIsUp(newPrice >= prev);
        return parseFloat(newPrice.toFixed(2));
      });
      setChange(prev => parseFloat((prev + (volatility * 0.01)).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center py-4 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b">
      <div className="flex items-center space-x-6 text-sm md:text-base font-outfit">
        <span className="text-gray-400">XAU/USD (Gold)</span>
        <span className="font-bold text-white">${price.toFixed(2)}</span>
        <span className={`flex items-center space-x-1 font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{isUp ? '+' : ''}{change}%</span>
        </span>
      </div>
    </div>
  );
}
