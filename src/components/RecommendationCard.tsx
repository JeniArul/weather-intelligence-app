import React from 'react';
import { WeatherRecommendation } from '../types';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  Shirt, 
  Footprints, 
  Home, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: WeatherRecommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const {
    summary,
    persona,
    outdoorSuitability,
    indoorSuitability,
    travelStatus,
    travelStatusReason,
    outdoorActivities,
    indoorActivities,
    clothingSuggestions,
    healthSafetyTips,
  } = recommendation;

  // Travel status visual mappings
  const getTravelBadgeStyles = (status: typeof travelStatus) => {
    switch (status) {
      case 'Go':
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          text: 'text-emerald-700',
          indicator: 'bg-emerald-500',
          label: 'Safe to Travel (Go)',
          icon: CheckCircle2,
        };
      case 'Caution':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-700',
          indicator: 'bg-amber-500',
          label: 'Proceed with Caution',
          icon: AlertTriangle,
        };
      case 'Delay':
        return {
          bg: 'bg-orange-50 border-orange-100',
          text: 'text-orange-700',
          indicator: 'bg-orange-500',
          label: 'Expect Delays',
          icon: AlertTriangle,
        };
      case 'Dangerous':
        return {
          bg: 'bg-red-50 border-red-100',
          text: 'text-red-700',
          indicator: 'bg-red-500',
          label: 'Dangerous (Postpone)',
          icon: ShieldAlert,
        };
    }
  };

  const travelStyles = getTravelBadgeStyles(travelStatus);
  const StatusIcon = travelStyles.icon;

  // Rating color maps
  const getSuitabilityColor = (rating: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    switch (rating) {
      case 'Excellent':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Good':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Fair':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Poor':
        return 'text-red-600 bg-red-50 border-red-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm" id="recommendations-container">
      {/* Engine Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Local Intelligence Engine
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">
              Planner AI Persona: <span className="text-indigo-600">{persona}</span>
            </h3>
          </div>
        </div>
        
        {/* Travel Advisory Badge */}
        <div className={`px-4 py-2.5 rounded-2xl border ${travelStyles.bg} flex items-center gap-2.5 shrink-0`}>
          <StatusIcon className={`w-5 h-5 ${travelStyles.text}`} />
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-wider text-gray-400`}>
              Transit Index
            </div>
            <div className={`text-xs font-bold ${travelStyles.text}`}>
              {travelStyles.label}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Message */}
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl flex items-start gap-3 border border-gray-100">
        <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 font-sans">
          <span className="font-semibold text-gray-900">Transit Advisory: </span>
          {travelStatusReason}
        </div>
      </div>

      {/* Primary recommendation summary */}
      <div className="mb-8 p-5 bg-indigo-600 text-white rounded-2xl shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-100 mb-1">Intelligence Summary</h4>
        <p className="text-base md:text-lg font-medium leading-relaxed font-sans">{summary}</p>
      </div>

      {/* Suitability Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-5 border border-gray-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400">Outdoor Suitability</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">Active Recreation</div>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getSuitabilityColor(outdoorSuitability)}`}>
            {outdoorSuitability}
          </span>
        </div>

        <div className="p-5 border border-gray-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400">Indoor Suitability</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">Sheltered Activities</div>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getSuitabilityColor(indoorSuitability)}`}>
            {indoorSuitability}
          </span>
        </div>
      </div>

      {/* Recommended Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Outdoor Activities list */}
        <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-xs"></span>
            Outdoor Recommendations
          </h4>
          <ul className="space-y-3">
            {outdoorActivities.map((act, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Indoor Activities list */}
        <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-500 rounded-xs"></span>
            Indoor Recommendations
          </h4>
          <ul className="space-y-3">
            {indoorActivities.map((act, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Clothing & Health Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clothing Suggestions */}
        <div className="p-6 border border-gray-100 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-600" />
            Clothing &amp; Gear Checklist
          </h4>
          <div className="flex flex-wrap gap-2">
            {clothingSuggestions.map((item, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-indigo-50/30 text-indigo-700 text-xs font-medium rounded-xl border border-indigo-100/50"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Health & Safety guidelines */}
        <div className="p-6 border border-red-100/50 bg-red-50/10 rounded-2xl">
          <h4 className="text-sm font-bold text-red-950 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            Health &amp; Safety Guidelines
          </h4>
          <ul className="space-y-2.5">
            {healthSafetyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-red-900/80 font-medium font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
