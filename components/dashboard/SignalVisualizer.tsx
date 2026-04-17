'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, LineData } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

interface SignalVisualizerProps {
    symbol: string;
    logs: any[];
    activeSymbols?: string[];
    onSymbolChange?: (symbol: string) => void;
}

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({ symbol, logs, activeSymbols = [], onSymbolChange }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('15m');

    const labels = [
        { label: '1M', value: '1m' },
        { label: '5M', value: '5m' },
        { label: '15M', value: '15m' },
        { label: '1H', value: '1h' },
        { label: '4H', value: '4h' },
        { label: '1D', value: '1d' },
    ];

    // 1. INITIALIZE CHART
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.05)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.05)',
                scaleMargins: { top: 0.1, bottom: 0.2 },
            },
            crosshair: {
                vertLine: { color: '#FFD700', width: 1, style: 2 },
                horzLine: { color: '#FFD700', width: 1, style: 2 },
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00E676',
            downColor: '#FF5252',
            borderVisible: false,
            wickUpColor: '#00E676',
            wickDownColor: '#FF5252',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight 
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []); // ONLY RUN ONCE

    // 2. DATA POLLING & UPDATES
    useEffect(() => {
        if (!seriesRef.current) return;

        let pollingInterval: NodeJS.Timeout;
        let isFirstLoad = true;

        const getAssetType = (sym: string): 'GLOBAL_EXCHANGE' | 'INSTITUTIONAL_INNER' => {
            const globalAssets = ['XAUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'SILVER', 'BTC', 'ETH'];
            const upperSym = sym.toUpperCase();
            if (globalAssets.some(a => upperSym.includes(a))) return 'GLOBAL_EXCHANGE';
            return 'INSTITUTIONAL_INNER';
        };

        const getBinanceSymbol = (sym: string) => {
            const map: Record<string, string> = {
                'XAUUSD': 'PAXGUSDT',
                'BTCUSD': 'BTCUSDT',
                'ETHUSD': 'ETHUSDT',
                'EURUSD': 'EURUSDT',
                'GBPUSD': 'GBPUSDT',
                'USDJPY': 'USDJPY',
                'SILVER': 'SLVUSDT'
            };
            return map[sym.toUpperCase()] || sym.toUpperCase().replace('/', '');
        };

        const fetchData = async (isBackground = false) => {
            try {
                if (!isBackground) {
                    setLoading(true);
                    // EXPLICIT RESET: Clear the current series data to provide the "Flash" effect
                    if (seriesRef.current) seriesRef.current.setData([]);
                    // Small delay to ensure the loader is visible for a "clean" reflection
                    await new Promise(r => setTimeout(r, 200));
                }
                
                const assetType = getAssetType(symbol);
                let klines = [];

                if (assetType === 'GLOBAL_EXCHANGE') {
                    const binanceSym = getBinanceSymbol(symbol);
                    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${timeframe}&limit=200`);
                    klines = await response.json();
                } else {
                    // Fallback to internal High-Fidelity Simulator for SBI, ICICI, NASDAQ etc.
                    const response = await fetch(`/api/market/history?symbol=${symbol}&timeframe=${timeframe}`);
                    klines = await response.json();
                    // If simulator returns objects, we handle them differently
                    if (klines.length > 0 && klines[0].open) {
                        seriesRef.current?.setData(klines);
                        if (isFirstLoad) { chartRef.current?.timeScale().fitContent(); isFirstLoad = false; }
                        return;
                    }
                }

                if (klines && klines.length > 0 && seriesRef.current) {
                    const formattedData = klines.map((d: any) => ({
                        time: (d[0] / 1000) as any,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4]),
                    }));
                    
                    seriesRef.current.setData(formattedData);
                    
                    if (isFirstLoad) {
                        chartRef.current?.timeScale().fitContent();
                        isFirstLoad = false;
                    }
                }

                // Add Signal Markers
                const markers: any[] = [];
                const subLogs = Array.isArray(logs) ? logs : [];
                
                subLogs.forEach((log: any) => {
                    const logTime = Math.floor(new Date(log.created_at).getTime() / 1000);
                    const intervalSeconds = timeframe.endsWith('m') ? parseInt(timeframe) * 60 : timeframe.endsWith('h') ? parseInt(timeframe) * 3600 : 86400;
                    const roundedTime = Math.floor(logTime / intervalSeconds) * intervalSeconds;

                    const action = log.action || log.details?.action;
                    
                    if (action === 'BUY') {
                        markers.push({ time: roundedTime, position: 'belowBar', color: '#00E676', shape: 'arrowUp', text: 'BUY' });
                    } else if (action === 'SELL') {
                        markers.push({ time: roundedTime, position: 'aboveBar', color: '#FF5252', shape: 'arrowDown', text: 'SELL' });
                    }
                });

                if (markers.length > 0 && seriesRef.current) {
                    markers.sort((a, b) => a.time - b.time);
                    seriesRef.current.setMarkers(markers);
                }

            } catch (err) {
                console.warn('Data Bridge Warning:', err);
            } finally {
                if (!isBackground) setLoading(false);
            }
        };

        fetchData();
        const intervalMs = process.env.NODE_ENV === 'development' ? 10000 : 3000;
        pollingInterval = setInterval(() => fetchData(true), intervalMs);

        return () => clearInterval(pollingInterval);
    }, [symbol, logs, timeframe]);

    return (
        <div className="flex flex-col h-full w-full relative group/chart">
            {/* 1M/5M/15M Selector Overlay */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {labels.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setTimeframe(item.value)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all ${timeframe === item.value ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'bg-black/60 text-white/20 hover:bg-black/80 hover:text-white/40 border border-white/5'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500">
                    <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                </div>
            )}

            <div ref={chartContainerRef} className="flex-1 w-full min-h-0" />

            {/* UNIVERSAL ASSET SWITCHER (BOTTOM RAIL) */}
            {activeSymbols.length > 1 && (
                <div className="absolute bottom-12 left-4 right-4 z-40 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {activeSymbols.map(sym => (
                        <button
                            key={sym}
                            onClick={() => onSymbolChange?.(sym)}
                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${symbol === sym ? 'bg-[#00E676] border-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'bg-black/90 border-white/10 text-white/40 hover:border-white/20'}`}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}
            
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{activeSymbols.length > 1 ? 'Universal Node Monitor' : 'Institutional Feed Mirroring'}</span>
                    <div className="flex gap-1 mt-1">
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse delay-75" />
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse delay-150" />
                    </div>
                </div>
            </div>
        </div>
    );
};
