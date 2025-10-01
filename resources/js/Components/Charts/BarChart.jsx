import React from 'react';

export default function BarChart({ data, title, xAxisLabel, yAxisLabel }) {
    if (!data || data.length === 0) {
        return null;
    }

    const maxValue = Math.max(...data.map(item => item.total_revenue || item.value || 0));
    const maxHeight = 200; // pixels

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="bg-white border rounded-lg p-4">
            {title && <h3 className="font-bold mb-4 text-lg text-center">{title}</h3>}

            <div className="relative">
                {/* Chart Area */}
                <div className="flex items-end justify-between gap-2 mb-4" style={{ height: maxHeight + 'px' }}>
                    {data.map((item, index) => {
                        const value = item.total_revenue || item.value || 0;
                        const height = maxValue > 0 ? (value / maxValue) * maxHeight : 0;
                        const colors = [
                            'bg-blue-500 hover:bg-blue-600',
                            'bg-green-500 hover:bg-green-600',
                            'bg-yellow-500 hover:bg-yellow-600',
                            'bg-red-500 hover:bg-red-600',
                            'bg-purple-500 hover:bg-purple-600',
                            'bg-indigo-500 hover:bg-indigo-600',
                            'bg-pink-500 hover:bg-pink-600',
                        ];

                        return (
                            <div key={index} className="relative flex-1 flex flex-col items-center group">
                                {/* Bar */}
                                <div
                                    className={`w-full ${colors[index % colors.length]} transition-all duration-300 rounded-t cursor-pointer relative`}
                                    style={{ height: height + 'px' }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {formatCurrency(value)}
                                        {item.receipts_count && (
                                            <div className="text-center">{item.receipts_count} αποδείξεις</div>
                                        )}
                                    </div>
                                </div>

                                {/* Label */}
                                <div className="mt-2 text-xs text-center font-medium">
                                    {item.date || item.label || item.name}
                                </div>

                                {/* Value */}
                                <div className="text-xs text-gray-600 text-center">
                                    €{value.toFixed(0)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12 w-10 text-right">
                    <span>€{maxValue.toFixed(0)}</span>
                    <span>€{(maxValue * 0.75).toFixed(0)}</span>
                    <span>€{(maxValue * 0.5).toFixed(0)}</span>
                    <span>€{(maxValue * 0.25).toFixed(0)}</span>
                    <span>€0</span>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((line) => (
                        <div key={line} className="border-t border-gray-200 border-dashed"></div>
                    ))}
                </div>
            </div>

            {/* Axis Labels */}
            {(xAxisLabel || yAxisLabel) && (
                <div className="mt-4 text-center text-sm text-gray-600">
                    {yAxisLabel && <div className="mb-2">{yAxisLabel}</div>}
                    {xAxisLabel && <div>{xAxisLabel}</div>}
                </div>
            )}
        </div>
    );
}
