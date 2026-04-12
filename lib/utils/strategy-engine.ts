/**
 * Strategy Performance Heuristic Engine
 * Generates high-fidelity simulated metrics for AI-generated Pine Scripts.
 */

export interface StrategyMetrics {
    winRate: number;
    totalTrades: number;
    avgGain: number;
    maxDrawdown: number;
    profitFactor: number;
    equityCurve: { x: number; y: number }[];
}

export function simulateStrategyPerformance(code: string): StrategyMetrics {
    // 1. Seed deterministic randomness based on the code content
    // This ensures same code -> same metrics
    let seed = 0;
    for (let i = 0; i < code.length; i++) {
        seed += code.charCodeAt(i);
    }
    
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    // 2. Generate Base Metrics within "Elite" ranges for premium feel
    const winRate = 58 + random() * 18; // 58% - 76%
    const totalTrades = Math.floor(120 + random() * 400); // 120 - 520 trades
    const avgGain = 1.2 + random() * 2.8; // 1.2% - 4.0%
    const maxDrawdown = 4 + random() * 11; // 4% - 15%
    const profitFactor = 1.6 + random() * 1.2; // 1.6 - 2.8

    // 3. Generate Equity Curve Data
    // Starting capital: 100,000
    const equityCurve = [];
    let currentEquity = 100000;
    equityCurve.push({ x: 0, y: currentEquity });

    // Simulate 50 data points for the chart
    for (let i = 1; i <= 50; i++) {
        const isWin = random() * 100 < winRate;
        const changeFactor = isWin 
            ? (1 + (avgGain / 100) * (0.8 + random() * 0.4)) 
            : (1 - (avgGain / 100) * (0.5 + random() * 0.5));
        
        currentEquity *= changeFactor;
        equityCurve.push({ x: i, y: Math.floor(currentEquity) });
    }

    return {
        winRate: parseFloat(winRate.toFixed(1)),
        totalTrades,
        avgGain: parseFloat(avgGain.toFixed(1)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
        profitFactor: parseFloat(profitFactor.toFixed(2)),
        equityCurve
    };
}
