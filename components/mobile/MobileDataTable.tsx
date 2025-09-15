import React from 'react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
}

interface MobileDataTableProps {
  columns: Column[];
  data: any[];
  compact?: boolean;
  striped?: boolean;
  className?: string;
}

const MobileDataTable: React.FC<MobileDataTableProps> = ({
  columns,
  data,
  compact = false,
  striped = true,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th 
                key={column.key}
                className={`px-2 py-2 text-left font-semibold border-r border-gray-200 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                style={{ 
                  color: 'var(--text-primary)',
                  width: column.width 
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index} 
              className={striped && index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
            >
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className={`px-2 py-1 border-r border-gray-200 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {column.render 
                    ? column.render(row[column.key], row, index)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MobileDataTable;