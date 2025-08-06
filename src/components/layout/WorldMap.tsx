'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

// 世界地圖 TopoJSON 資料 URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 合作學校數據與真實地理坐標
const partnerSchools = [
  // 美洲
  {
    name: '美國密西根大學',
    students: 150,
    flag: '🇺🇸',
    coordinates: [-83.743, 42.2808] as [number, number],
  },
  {
    name: '美國明尼蘇達大學',
    students: 120,
    flag: '🇺🇸',
    coordinates: [-93.265, 44.9778] as [number, number],
  },

  // 歐洲
  {
    name: '英國艾賽克斯大學',
    students: 80,
    flag: '🇬🇧',
    coordinates: [0.9426, 51.886] as [number, number],
  },
  {
    name: '英國諾丁漢特倫特大學',
    students: 90,
    flag: '🇬🇧',
    coordinates: [-1.1581, 52.9548] as [number, number],
  },
  {
    name: '法國雷恩商學院',
    students: 70,
    flag: '🇫🇷',
    coordinates: [-1.6778, 48.1173] as [number, number],
  },
  {
    name: '德國佛茨海姆大學',
    students: 60,
    flag: '🇩🇪',
    coordinates: [8.696, 48.8566] as [number, number],
  },

  // 大洋洲
  {
    name: '澳洲昆士蘭大學',
    students: 100,
    flag: '🇦🇺',
    coordinates: [153.0137, -27.4975] as [number, number],
  },

  // 亞洲
  {
    name: '日本早稻田大學',
    students: 85,
    flag: '🇯🇵',
    coordinates: [139.7319, 35.709] as [number, number],
  },
  {
    name: '韓國延世大學',
    students: 75,
    flag: '🇰🇷',
    coordinates: [126.9384, 37.5665] as [number, number],
  },
  {
    name: '新加坡國立大學',
    students: 95,
    flag: '🇸🇬',
    coordinates: [103.7764, 1.2966] as [number, number],
  },
];

// 台灣坐標
const taiwanCoordinates: [number, number] = [120.9605, 23.6978];

// 世界地圖組件
export default function WorldMap() {
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl p-6">
      {/* 標題區域 */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-50 mb-2">
          全球合作學校分布
        </h3>
        <p className="text-primary-100">遍佈全球近30個國家的教育合作網絡</p>
      </div>

      {/* 世界地圖 */}
      <div className="relative w-full max-w-full h-[400px] md:h-[500px] mb-6 rounded-xl overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 190,
            center: [0, 30],
          }}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
          }}
          className="overflow-hidden"
        >
          {/* 世界各國地理輪廓 */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(74, 86, 83, 0.8)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      fill: 'rgba(74, 86, 83, 0.8)',
                      stroke: 'rgba(255, 255, 255, 0.4)',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: 'rgba(93, 104, 101, 0.9)',
                      stroke: 'rgba(245, 158, 11, 0.6)',
                      strokeWidth: 1,
                      outline: 'none',
                    },
                    pressed: {
                      fill: 'rgba(111, 122, 119, 0.9)',
                      stroke: 'rgba(245, 158, 11, 0.8)',
                      strokeWidth: 1.2,
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* 從台灣到各合作學校的連接線 */}
          {partnerSchools.map((school, index) => (
            <Line
              key={`line-${index}`}
              from={taiwanCoordinates}
              to={school.coordinates}
              stroke="rgba(245, 158, 11, 0.6)"
              strokeWidth={1}
              strokeDasharray="3,3"
              strokeLinecap="round"
            />
          ))}

          {/* 台灣標記 */}
          <Marker coordinates={taiwanCoordinates}>
            <g>
              <circle
                r={6}
                fill="rgb(245, 158, 11)"
                stroke="#ffffff"
                strokeWidth={2}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))',
                }}
              />
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fontFamily: 'system-ui',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fill: '#ffffff',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
                }}
              >
                🇹🇼 台灣
              </text>
            </g>
          </Marker>

          {/* 合作學校標記 */}
          {partnerSchools.map((school) => {
            const radius = Math.max(4, school.students / 25);
            const isHovered = hoveredSchool === school.name;

            return (
              <Marker key={school.name} coordinates={school.coordinates}>
                <g>
                  {/* 脈衝背景動畫 */}
                  <circle
                    r={radius * 2}
                    fill="rgba(245, 158, 11, 0.4)"
                    className="animate-ping"
                  />

                  {/* 主要標記點 */}
                  <circle
                    r={radius}
                    fill="rgb(245, 158, 11)"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isHovered
                        ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.8))'
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredSchool(school.name)}
                    onMouseLeave={() => setHoveredSchool(null)}
                  />

                  {/* 懸停時顯示學校信息 */}
                  {isHovered && (
                    <g>
                      {/* 信息框背景 */}
                      <rect
                        x={-80}
                        y={-50}
                        width={160}
                        height={35}
                        rx={8}
                        fill="rgba(0, 0, 0, 0.9)"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1}
                      />

                      {/* 學校名稱 */}
                      <text
                        textAnchor="middle"
                        y={-35}
                        style={{
                          fontFamily: 'system-ui',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          fill: '#ffffff',
                        }}
                      >
                        {school.flag} {school.name}
                      </text>

                      {/* 學生數量 */}
                      <text
                        textAnchor="middle"
                        y={-20}
                        style={{
                          fontFamily: 'system-ui',
                          fontSize: '12px',
                          fill: 'rgb(245, 158, 11)',
                        }}
                      >
                        {school.students} 位交流學生
                      </text>
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">10</div>
          <div className="text-sm text-primary-200">合作學校</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">925</div>
          <div className="text-sm text-primary-200">交流學生</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">8</div>
          <div className="text-sm text-primary-200">合作國家</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">4</div>
          <div className="text-sm text-primary-200">合作大洲</div>
        </div>
      </div>

      {/* 圖例說明 */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
          <span className="text-white font-medium">合作學校位置</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
          <span className="text-white font-medium">台灣位置</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-1 bg-amber-500/50 rounded shadow-sm"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, rgb(245, 158, 11) 0, rgb(245, 158, 11) 3px, transparent 3px, transparent 6px)',
            }}
          ></div>
          <span className="text-white font-medium">合作連線</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-medium">
            點大小代表交流學生數量
          </span>
        </div>
      </div>
    </div>
  );
}
