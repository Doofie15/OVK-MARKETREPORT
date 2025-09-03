
import React from 'react';

interface AuctionSelectorProps {
  weeks: { id: string; label: string }[];
  selectedWeekId: string;
  onWeekChange: (weekId: string) => void;
}

const Selector: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={label.toLowerCase()}
      name={label.toLowerCase()}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AuctionSelector: React.FC<AuctionSelectorProps> = ({ weeks, selectedWeekId, onWeekChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Selector
          label="Commodity"
          value="wool"
          onChange={() => {}} // No-op for now
          options={[{ value: 'wool', label: 'Wool' }]}
        />
        <Selector
          label="Season"
          value="2025/26"
          onChange={() => {}} // No-op for now
          options={[{ value: '2025/26', label: '2025/26' }]}
        />
        <Selector
          label="Auction Week"
          value={selectedWeekId}
          onChange={(e) => onWeekChange(e.target.value)}
          options={weeks.map(w => ({ value: w.id, label: w.label }))}
        />
      </div>
    </div>
  );
};

export default AuctionSelector;
