import React from 'react';

export default function PieChart({ data, title }) {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const total = Object.values(data).reduce((sum, value) => sum + value.total, 0);

    const segments = Object.entries(data).map(([key, value], index) => {
        const percentage = total > 0 ? (value.total / total) * 100 : 0;
        const colors = [
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // yellow
            '#EF4444', // red
            '#8B5CF6', // purple
            '#06B6D4', // cyan
            '#F97316', // orange
            '#84CC16', // lime
        ];

        return {
            key,
            value: value.total,
            count: value.count,
            percentage: percentage.toFixed(1),
            color: colors[index % colors.length]
        };
    });

    // Sort by value descending
    segments.sort((a, b) => b.value - a.value);

    const getTypeLabel = (type) => {
        const typeLabels = {
            'fek': 'ΦΕΚ',
            'book': 'Βιβλία',
            'cd': 'CD',
            'other': 'Άλλα',
            'product': 'Προϊόντα'
        };
        return typeLabels[type] || type;
    };

    const getTypeIcon = (type) => {
        const typeIcons = {
            'fek': '📄',
            'book': '📚',
            'cd': '💿',
            'other': '📦',
            'product': '🏪'
        };
        return typeIcons[type] || '📋';
    };

    return (
        <div className="bg-white border rounded-lg p-4">
            {title && <h3 className="font-bold mb-4 text-lg text-center">{title}</h3>}

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Pie Chart */}
                <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {segments.map((segment, index) => {
                            const radius = 40;
                            const circumference = 2 * Math.PI * radius;
                            const offset = segments.slice(0, index).reduce((sum, s) => sum + (parseFloat(s.percentage) / 100 * circumference), 0);
                            const strokeDasharray = `${(parseFloat(segment.percentage) / 100) * circumference} ${circumference}`;

                            return (
                                <circle
                                    key={segment.key}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="8"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={-offset}
                                    className="transition-all duration-300 hover:stroke-width-10"
                                />
                            );
                        })}
                    </svg>

                    {/* Center total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-lg font-bold">€{total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Σύνολο</div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {segments.map((segment) => (
                        <div key={segment.key} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: segment.color }}
                                ></div>
                                <span className="mr-1">{getTypeIcon(segment.key)}</span>
                                <span className="font-medium">{getTypeLabel(segment.key)}</span>
                                <span className="text-sm text-gray-500">({segment.count})</span>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">€{segment.value.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">{segment.percentage}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
