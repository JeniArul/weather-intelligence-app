import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertCircle, Sparkles, Navigation } from 'lucide-react';
import { CitySearchResult } from '../types';

interface CitySearchProps {
  onSelectCity: (city: CitySearchResult) => void;
  isLoading: boolean;
}

const QUICK_CITIES: Omit<CitySearchResult, 'id'>[] = [
  { name: 'Chennai', country: 'India', latitude: 13.0878, longitude: 80.2785, timezone: 'Asia/Kolkata' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
];

export default function CitySearch({ onSelectCity, isLoading }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Search function
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a city name to search.');
      return;
    }

    setSearching(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedQuery)}&count=10&language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to reach geocoding service. Please check your connection.');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setResults([]);
        setError(`No results found for "${trimmedQuery}". Try checking the spelling.`);
      } else {
        setResults(data.results);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during search.');
    } finally {
      setSearching(false);
    }
  };

  // Trigger search on select suggestion or first match
  const handleSelect = (city: CitySearchResult) => {
    onSelectCity(city);
    // Clear search panel to keep it tidy
    setResults([]);
    setQuery('');
    setHasSearched(false);
  };

  // Keyboard support for hitting enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="city-search-container">
      {/* Search Input Panel */}
      <form onSubmit={handleSearch} className="relative flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="city-search-input"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all font-sans"
            placeholder="Search city worldwide (e.g., Chennai, London, New York...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          type="submit"
          id="city-search-submit-btn"
          disabled={isLoading || searching}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-2xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer font-sans"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Quick Pin Cities */}
      <div className="flex flex-wrap items-center gap-2 mb-6" id="quick-pins-container">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Quick Test Pins:
        </span>
        {QUICK_CITIES.map((qc, idx) => (
          <button
            key={idx}
            type="button"
            id={`quick-pin-${qc.name.toLowerCase()}`}
            onClick={() => onSelectCity({ id: idx, ...qc } as CitySearchResult)}
            className="px-3.5 py-1.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-gray-400" />
            {qc.name}
            {qc.country && <span className="text-gray-400 font-normal">({qc.country})</span>}
          </button>
        ))}
      </div>

      {/* Search Results Dropdown/Card */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mb-6 divide-y divide-gray-100 animate-fade-in" id="search-results-dropdown">
          <div className="bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500 flex items-center justify-between">
            <span>Matching Locations ({results.length})</span>
            <span className="text-indigo-600">Select to view weather intelligence</span>
          </div>
          {results.map((res) => (
            <button
              key={res.id}
              type="button"
              id={`search-result-${res.id}`}
              onClick={() => handleSelect(res)}
              className="w-full text-left px-5 py-3.5 hover:bg-indigo-50/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {res.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {[res.admin1, res.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 text-xs font-mono text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                {res.latitude.toFixed(2)}°N, {res.longitude.toFixed(2)}°E
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Message Panel */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 mb-6 animate-fade-in" id="search-error-panel">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800">Search feedback</h4>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
