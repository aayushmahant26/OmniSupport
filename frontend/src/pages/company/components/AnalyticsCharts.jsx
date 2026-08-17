import { useState } from 'react';

/**
 * LineChart - Displays questions asked over time (Days, Weeks, Months)
 */
export const LineChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-borderColor rounded-xl text-textSecondary text-xs">
        No data available for the selected period
      </div>
    );
  }

  // Dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value calculation for Y axis
  const maxVal = Math.max(...data.map(d => d.count), 0);
  const yMax = maxVal === 0 ? 10 : Math.ceil(maxVal * 1.15); // Add padding on top

  // Generate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.count / yMax) * chartHeight;
    return { x, y, label: d.date, count: d.count };
  });

  // SVG Line path string
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  // SVG Area path string for gradient fill
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const handleMouseMove = (e, index, point) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredIndex(index);
    setTooltipPos({ x, y: point.y - 45 });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Generate Y axis ticks
  const yTicks = [0, Math.floor(yMax / 2), yMax];

  // X axis labels grouping (don't print all of them if too many)
  const labelInterval = Math.max(Math.ceil(data.length / 6), 1);
  const xLabels = points.filter((_, idx) => idx % labelInterval === 0);

  return (
    <div className="relative w-full bg-bgSurface p-5 rounded-2xl border border-borderColor shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-textPrimary">Questions Over Time</h4>
        <span className="text-[11px] text-textSecondary font-semibold">Hover nodes for detail</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {/* Stroke gradient */}
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            {/* Fill gradient */}
            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / yMax) * chartHeight;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-borderColor"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-semibold fill-textSecondary font-sans"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Glowing Area Fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#fillGrad)" />
          )}

          {/* Smooth Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#strokeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Larger transparent hover capture circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, idx, p)}
                onMouseLeave={handleMouseLeave}
              />
              {/* Visual dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 4}
                className={`${
                  hoveredIndex === idx
                    ? 'fill-white stroke-accentPurple stroke-[2.5px]'
                    : 'fill-primary stroke-white stroke-[1.5px]'
                } transition-all duration-150 pointer-events-none`}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {xLabels.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              className="text-[10px] font-semibold fill-textSecondary font-sans"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Floating HTML Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-10 pointer-events-none bg-bgSurfaceElevated/95 border border-borderColor text-textPrimary px-3 py-2 rounded-lg shadow-md text-xs font-semibold backdrop-blur-md transition-all duration-75 flex flex-col gap-0.5"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${tooltipPos.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="text-[10px] text-textSecondary font-medium">
              {points[hoveredIndex].label}
            </span>
            <span className="text-sm font-extrabold text-primary">
              {points[hoveredIndex].count} {points[hoveredIndex].count === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * BarChart - Displays Active Hours
 */
export const BarChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Make sure we have hours 0 to 23 represented
  const fullHourData = Array.from({ length: 24 }, (_, hour) => {
    const existing = data?.find(d => d.hour === hour);
    return {
      hour,
      count: existing ? existing.count : 0,
      label: `${hour.toString().padStart(2, '0')}:00`,
    };
  });

  const maxCount = Math.max(...fullHourData.map(h => h.count), 0);
  const yMax = maxCount === 0 ? 10 : Math.ceil(maxCount * 1.15);

  const width = 600;
  const height = 200;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barWidth = (chartWidth / 24) * 0.7;
  const barGap = (chartWidth / 24) * 0.3;

  const handleMouseMove = (e, index, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoveredIndex(index);
    // Position tooltip above the bar
    const barHeight = (item.count / yMax) * chartHeight;
    const y = paddingTop + chartHeight - barHeight - 40;
    setTooltipPos({ x, y });
  };

  return (
    <div className="w-full bg-bgSurface p-5 rounded-2xl border border-borderColor shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-textPrimary">Hourly Activity Density</h4>
        <span className="text-[11px] text-textSecondary font-semibold">24-hour distribution</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Horizontal lines */}
          {[0, Math.floor(yMax / 2), yMax].map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / yMax) * chartHeight;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-borderColor"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-semibold fill-textSecondary font-sans"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Columns */}
          {fullHourData.map((item, idx) => {
            const barHeight = (item.count / yMax) * chartHeight;
            const x = paddingLeft + idx * (barWidth + barGap);
            const y = paddingTop + chartHeight - barHeight;

            return (
              <g key={idx}>
                {/* Visual bar (drawn with rounded corners on top) */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)} // Minimum height to show zero values nicely
                  rx={2}
                  className={`${
                    hoveredIndex === idx
                      ? 'fill-accentPurple'
                      : item.count > 0
                      ? 'fill-primary'
                      : 'fill-borderColor/40'
                  } transition-all duration-150 cursor-pointer`}
                  onMouseMove={(e) => handleMouseMove(e, idx, item)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* Hour labels (print every 4th hour to avoid crowding) */}
          {fullHourData.filter(h => h.hour % 4 === 0).map((item, idx) => {
            const x = paddingLeft + item.hour * (barWidth + barGap) + barWidth / 2;
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[9px] font-semibold fill-textSecondary font-sans"
              >
                {item.label}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && fullHourData[hoveredIndex] && (
          <div
            className="absolute z-10 pointer-events-none bg-bgSurfaceElevated/95 border border-borderColor text-textPrimary px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold backdrop-blur-md flex flex-col gap-0.5"
            style={{
              left: `${((paddingLeft + hoveredIndex * (barWidth + barGap) + barWidth / 2) / width) * 100}%`,
              top: `${tooltipPos.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="text-[10px] text-textSecondary font-medium">
              {fullHourData[hoveredIndex].label}
            </span>
            <span className="text-sm font-extrabold text-accentPurple">
              {fullHourData[hoveredIndex].count} {fullHourData[hoveredIndex].count === 1 ? 'Query' : 'Queries'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * HorizontalBarChart - Displays Top 10 Most Asked Topics
 */
export const HorizontalBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-borderColor rounded-xl text-textSecondary text-xs">
        No topic metrics available
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full bg-bgSurface p-5 rounded-2xl border border-borderColor shadow-sm">
      <h4 className="text-sm font-bold text-textPrimary mb-5">Top Most Asked Topics</h4>
      
      <div className="flex flex-col gap-4">
        {data.map((item, idx) => {
          const percentage = (item.count / maxVal) * 100;
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-textPrimary truncate max-w-[70%]" title={item.topic}>
                  {item.topic}
                </span>
                <span className="text-textSecondary text-[11px]">
                  {item.count} {item.count === 1 ? 'chat' : 'chats'}
                </span>
              </div>
              
              <div className="w-full h-2.5 bg-bgBase border border-borderColor/55 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accentPurple rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
