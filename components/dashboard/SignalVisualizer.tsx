'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, createSeriesMarkers, IChartApi, ISeriesApi, SeriesMarker, Time } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

interface SignalVisualizerProps {
    symbol: string;
    logs: any[];
}

export const SignalVisualizer: React.FC<SignalVisualizerProps> = ({ symbol, logs }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const [loading, setLoading] = useState(true);

    const getBinanceSymbol = (sym: string) => {
        const s = sym.toUpperCase().replace('/', '');
        if (s.includes('BTC')) return 'BTCUSDT';
        if (s.includes('ETH')) return 'ETHUSDT';
        if (s.includes('XAU') || s.includes('GOLD')) return 'PAXGUSDT';
        if (s.endsWith('USD')) return s + 'T';
        return s;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let unmounted = false;

        // Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.4)',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            crosshair: {
                mode: 0,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#00E676',
            downColor: '#FF5252',
            borderVisible: false,
            wickUpColor: '#00E676',
            wickDownColor: '#FF5252',
        });

        chartInstance.current = chart;

        const handleResize = () => {
            if (!unmounted && chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        // Fetch Data
        const fetchData = async () => {
            try {
                const binanceSym = getBinanceSymbol(symbol);
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=1m&limit=100`);
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
                setLoading(false);

                // Add Signal Markers
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
                    const seriesMarkers = createSeriesMarkers(candlestickSeries);
                    markers.sort((a, b) => (a.time as number) - (b.time as number));
                    seriesMarkers.setMarkers(markers);
                }

            } catch (err) {
                if (!unmounted) {
                    console.error('Signal Chart Error:', err);
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            unmounted = true;
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [symbol, logs]);

    return (
        <div className="relative w-full h-[300px] group bg-black/40 rounded-[32px] border border-white/5 overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                </div>
            )}
            <div ref={chartContainerRef} className="w-full h-full" />
            
            <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none">
                <div className="px-4 py-2 bg-black/80 border border-[#FFD700]/20 rounded-full flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{symbol}</span>
                </div>
                {!loading && (
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                        Live Feed: Binance Protocol
                    </div>
                )}
            </div>
        </div>
    );
};
