import React, { useState } from 'react';

// Reusable SimpleDatePicker Component
function SimpleDatePicker({ label, defaultValue, onChange, style }) {
  // Set the default value to today if no defaultValue is provided
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState('');
  // Handle date changes
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate); // Update local state
    if (onChange) {
      onChange(newDate); // Notify parent component
    }
  };

  return (
    <span style={{ margin: '3px', ...style }}>
      {/* Accessible Label */}
      {label && <span htmlFor="date-picker" style={{ display: 'block', marginBottom: '5px' }}>{label}</span>}

      {/* Date Picker Input */}
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{
          padding: '8px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    </span>
  );
}

export default SimpleDatePicker;