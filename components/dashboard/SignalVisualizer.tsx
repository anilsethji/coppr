'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, SeriesMarker, Time } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

interface SignalVisualizerProps {
    symbol: string;
    logs: any[];
    activeSymbols?: string[];
    onSymbolChange?: (sym: string) => void;
}

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({ symbol, logs, activeSymbols = [], onSymbolChange }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const labels = [
        { label: '1m', value: '1m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '1h', value: '1h' },
    ];

    const [timeframe, setTimeframe] = useState('1m');
    const [loading, setLoading] = useState(true);

    const getBinanceSymbol = (sym: string) => {
        const s = sym.toUpperCase().replace('/', '').replace(' ', '');
        
        // Priority Mappings
        if (s.includes('BTC')) return 'BTCUSDT';
        if (s.includes('ETH')) return 'ETHUSDT';
        if (s.includes('SOL')) return 'SOLUSDT';
        if (s.includes('XRP')) return 'XRPUSDT';
        if (s.includes('XAU') || s.includes('GOLD')) return 'PAXGUSDT';
        
        // Forex & Indices Proxies
        if (s.includes('EURUSD') || s.includes('GBPUSD')) return 'EURUSDT';
        if (s.includes('US30') || s.includes('NAS100') || s.includes('NIFTY')) return 'BTCUSDT';
        
        if (s.endsWith('USD')) return s + 'T';
        if (s.endsWith('USDT')) return s;
        
        return s;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let unmounted = false;
        let pollingInterval: NodeJS.Timeout;

        // Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.4)',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: window.innerWidth < 768 ? 240 : 300,
            crosshair: {
                mode: 0,
                vertLine: { color: 'rgba(255, 215, 0, 0.2)', labelBackgroundColor: '#FFD700' },
                horzLine: { color: 'rgba(255, 215, 0, 0.2)', labelBackgroundColor: '#FFD700' },
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00E676',
            downColor: '#FF5252',
            borderVisible: false,
            wickUpColor: '#00E676',
            wickDownColor: '#FF5252',
            priceLineVisible: true,
            lastValueVisible: true,
        });

        chartInstance.current = chart;

        const handleResize = () => {
            if (!unmounted && chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        // Fetch Data
        const fetchData = async (isPoll = false) => {
            if (!isPoll) setLoading(true);
            try {
                const binanceSym = getBinanceSymbol(symbol);
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${timeframe}&limit=100`);
                const data = await res.json();
                
                if (unmounted) return;

                const formattedData = data.map((d: any) => ({
                    time: (d[0] / 1000) as Time,
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                }));

                candlestickSeries.setData(formattedData);
                if (!isPoll) setLoading(false);

                // Signal Markers
                const markers: SeriesMarker<Time>[] = [];
                logs.forEach(log => {
                    const timestamp = new Date(log.created_at).getTime() / 1000;
                    const details = log.details || {};
                    const action = log.action;
                    
                    if (action === 'SIGNAL_PROPAGATED' || action === 'SIGNAL_INGESTED') {
                        const tradeAction = details.action || (log.details?.details?.action);
                        
                        if (tradeAction === 'BUY') {
                            markers.push({
                                time: timestamp as Time,
                                position: 'belowBar',
                                color: '#00E676',
                                shape: 'arrowUp',
                                text: 'BUY',
                            });
                        } else if (tradeAction === 'SELL') {
                            markers.push({
                                time: timestamp as Time,
                                position: 'aboveBar',
                                color: '#FF5252',
                                shape: 'arrowDown',
                                text: 'SELL',
                            });
                        }
                    }
                });

                if (markers.length > 0) {
                    markers.sort((a, b) => (a.time as number) - (b.time as number));
                    candlestickSeries.setMarkers(markers);
                }

                if (!isPoll) chart.timeScale().fitContent();

            } catch (err) {
                if (!unmounted) {
                    console.error('Signal Chart Error:', err);
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Heartbeat
        pollingInterval = setInterval(() => {
            fetchData(true);
        }, 3000);

        return () => {
            unmounted = true;
            clearInterval(pollingInterval);
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [symbol, logs, timeframe]);

    return (
        <div className="relative w-full h-[240px] md:h-[300px] group bg-black/60 rounded-2xl md:rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                </div>
            )}
            <div ref={chartContainerRef} className="w-full h-full" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-[60]">
                <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                    <div className="px-2.5 py-1.5 md:px-4 md:py-2 bg-black/80 border border-white/10 rounded-full flex items-center gap-2 md:gap-3">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                        <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest leading-none">{symbol}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/5 pointer-events-auto">
                    {labels.map(tf => (
                        <button 
                            key={tf.value}
                            onClick={(e) => {
                                e.stopPropagation();
                                setTimeframe(tf.value);
                            }}
                            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${timeframe === tf.value ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10' : 'text-white/20 hover:text-white/40'}`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Universal Asset Switcher */}
            {activeSymbols.length > 1 && (
                <div className="absolute bottom-12 left-4 right-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 pt-1 pointer-events-auto z-[60]">
                    {activeSymbols.map(sym => (
                        <button 
                            key={sym}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSymbolChange?.(sym);
                            }}
                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 shadow-2xl ${symbol === sym ? 'bg-[#00E676] border-[#00E676] text-black shadow-[#00E676]/20' : 'bg-black/90 border-white/5 text-white/40 hover:border-white/20 hover:text-white/60'}`}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}

            <div className="absolute bottom-4 left-4 pointer-events-none opacity-40 z-[60]">
                <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black text-white/80 uppercase tracking-[0.5em] font-sans italic opacity-50">
                        {activeSymbols.length > 1 ? 'Universal Node Monitoring' : 'Institutional Feed Mirroring'}
                    </span>
                    <div className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse delay-75" />
                        <span className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse delay-150" />
                    </div>
                </div>
            </div>
        </div>
    );
};
