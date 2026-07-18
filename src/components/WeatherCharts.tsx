import React, { useState } from 'react';
import { DailyForecastDay } from '../types';
import { TrendingUp, Percent, CloudRain } from 'lucide-react';

interface WeatherChartsProps {
  dailyForecast: DailyForecastDay[];
}

export default function WeatherCharts({ dailyForecast }: WeatherChartsProps) {
  const [activeChart, setActiveChart] = useState<'temperature' | 'precipitation'>('temperature');

  if (!dailyForecast || dailyForecast.length === 0) return null;

  // Formatting dates to Short Day string (e.g. "Mon")
  const getDayLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    } catch {
      return dateStr;
    }
  };

  // Dimensions & padding
  const svgWidth = 600;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 35;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Coordinate helpers
  const getX = (index: number) => {
    return paddingX + (index / (dailyForecast.length - 1)) * chartWidth;
  };

  // 1. Temperature Chart calculations
  const allMaxs = dailyForecast.map((d) => d.tempMax);
  const allMins = dailyForecast.map((d) => d.tempMin);
  const absoluteMax = Math.max(...allMaxs);
  const absoluteMin = Math.min(...allMins);
  const tempRange = absoluteMax - absoluteMin || 1;
  const tempBuffer = tempRange * 0.15; // 15% buffer top & bottom

  const getTempY = (temp: number) => {
    const minBound = absoluteMin - tempBuffer;
    const maxBound = absoluteMax + tempBuffer;
    const percent = (temp - minBound) / (maxBound - minBound);
    return paddingY + chartHeight - percent * chartHeight;
  };

  // SVG Paths for Temperature Lines
  const maxPoints = dailyForecast.map((d, i) => ({ x: getX(i), y: getTempY(d.tempMax) }));
  const minPoints = dailyForecast.map((d, i) => ({ x: getX(i), y: getTempY(d.tempMin) }));

  const maxPathD = maxPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const minPathD = minPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Gradient path area definitions
  const maxAreaPathD = `${maxPathD} L ${getX(dailyForecast.length - 1)} ${paddingY + chartHeight} L ${getX(0)} ${paddingY + chartHeight} Z`;
  const minAreaPathD = `${minPathD} L ${getX(dailyForecast.length - 1)} ${paddingY + chartHeight} L ${getX(0)} ${paddingY + chartHeight} Z`;

  // 2. Precipitation Chart calculations
  const allProbs = dailyForecast.map((d) => d.precipitationProbability);
  const getPrecipY = (prob: number) => {
    return paddingY + chartHeight - (prob / 100) * chartHeight;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm" id="weather-charts-container">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            7-Day Visual Forecast Trends
          </h3>
          <p className="text-xs text-gray-400 mt-1">Interactive visualization of weekly cycles and precipitation indices</p>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            id="chart-toggle-temp"
            onClick={() => setActiveChart('temperature')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'temperature'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Temperature (°C)
          </button>
          <button
            type="button"
            id="chart-toggle-precip"
            onClick={() => setActiveChart('precipitation')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'precipitation'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            Rain Chance (%)
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full overflow-x-auto select-none" id="svg-canvas-wrapper">
        <div className="min-w-[500px]">
          {activeChart === 'temperature' ? (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              {/* Definitions for gradients */}
              <defs>
                <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={svgWidth - paddingX} y2={paddingY + chartHeight / 2} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={paddingX} y1={paddingY + chartHeight} x2={svgWidth - paddingX} y2={paddingY + chartHeight} stroke="#e5e7eb" strokeWidth="1" />

              {/* Vertical alignment guides */}
              {dailyForecast.map((_, i) => (
                <line
                  key={i}
                  x1={getX(i)}
                  y1={paddingY}
                  x2={getX(i)}
                  y2={paddingY + chartHeight}
                  stroke="#f9fafb"
                  strokeWidth="1.5"
                />
              ))}

              {/* Gradient Areas */}
              <path d={maxAreaPathD} fill="url(#maxTempGrad)" />
              <path d={minAreaPathD} fill="url(#minTempGrad)" />

              {/* Low Temp Path */}
              <path d={minPathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* High Temp Path */}
              <path d={maxPathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Low Circles & Text values */}
              {minPoints.map((p, i) => (
                <g key={`min-${i}`}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y + 16}
                    textAnchor="middle"
                    className="text-[10px] font-bold font-mono text-cyan-600"
                  >
                    {Math.round(dailyForecast[i].tempMin)}°
                  </text>
                </g>
              ))}

              {/* High Circles & Text values */}
              {maxPoints.map((p, i) => (
                <g key={`max-${i}`}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-bold font-mono text-amber-600"
                  >
                    {Math.round(dailyForecast[i].tempMax)}°
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {dailyForecast.map((d, i) => (
                <text
                  key={`lbl-${i}`}
                  x={getX(i)}
                  y={paddingY + chartHeight + 22}
                  textAnchor="middle"
                  className="text-[11px] font-bold text-gray-400 font-sans"
                >
                  {getDayLabel(d.date)}
                </text>
              ))}
            </svg>
          ) : (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              <defs>
                <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Guidelines */}
              <line x1={paddingX} y1={getPrecipY(100)} x2={svgWidth - paddingX} y2={getPrecipY(100)} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={paddingX} y1={getPrecipY(50)} x2={svgWidth - paddingX} y2={getPrecipY(50)} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={paddingX} y1={getPrecipY(0)} x2={svgWidth - paddingX} y2={getPrecipY(0)} stroke="#e5e7eb" strokeWidth="1" />

              {/* Y Axis percentage markers */}
              <text x={paddingX - 10} y={getPrecipY(100) + 3} textAnchor="end" className="text-[9px] font-mono font-bold text-gray-300">100%</text>
              <text x={paddingX - 10} y={getPrecipY(50) + 3} textAnchor="end" className="text-[9px] font-mono font-bold text-gray-300">50%</text>
              <text x={paddingX - 10} y={getPrecipY(0) + 3} textAnchor="end" className="text-[9px] font-mono font-bold text-gray-300">0%</text>

              {/* Precipitation Probability Bars */}
              {dailyForecast.map((d, i) => {
                const x = getX(i);
                const barWidth = 28;
                const topY = getPrecipY(d.precipitationProbability);
                const bottomY = paddingY + chartHeight;
                const barHeight = Math.max(bottomY - topY, 4); // minimum 4px height so empty days show a thin line
                
                return (
                  <g key={`precip-bar-${i}`} className="group">
                    <rect
                      x={x - barWidth / 2}
                      y={topY}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill="url(#precipGrad)"
                      className="hover:fill-blue-600 transition-colors cursor-pointer"
                    />
                    
                    {/* Value on top of the bar */}
                    <text
                      x={x}
                      y={topY - 8}
                      textAnchor="middle"
                      className="text-[10px] font-extrabold font-mono text-blue-600"
                    >
                      {d.precipitationProbability}%
                    </text>
                    
                    {/* Water drop icon overlay inside bar if space permits */}
                    {d.precipitationProbability >= 30 && (
                      <svg
                        x={x - 5}
                        y={bottomY - 18}
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="opacity-75"
                      >
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    )}
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {dailyForecast.map((d, i) => (
                <text
                  key={`lbl-precip-${i}`}
                  x={getX(i)}
                  y={paddingY + chartHeight + 22}
                  textAnchor="middle"
                  className="text-[11px] font-bold text-gray-400 font-sans"
                >
                  {getDayLabel(d.date)}
                </text>
              ))}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
