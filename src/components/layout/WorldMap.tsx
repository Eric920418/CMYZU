'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

// 世界地圖 TopoJSON 資料 URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 台灣坐標
const taiwanCoordinates: [number, number] = [120.9605, 23.6978];

// 資料介面定義
interface WorldMapStats {
  schools: number;
  students: number;
  countries: number;
  continents: number;
}

interface PartnerSchool {
  id: string;
  name: string;
  nameEn?: string | null;
  students: number;
  flag: string;
  latitude: number;
  longitude: number;
  coordinates: [number, number]; // 計算後的座標
}

// 根據語系獲取學校名稱
const getSchoolName = (school: PartnerSchool, locale: string): string => {
  if (locale === 'en' && school.nameEn) {
    return school.nameEn;
  }
  return school.name;
};

// 世界地圖組件
export default function WorldMap() {
  const t = useTranslations('WorldMap');
  const locale = useLocale();
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
  const [stats, setStats] = useState<WorldMapStats>({
    schools: 10,
    students: 925,
    countries: 8,
    continents: 4,
  });
  const [partnerSchools, setPartnerSchools] = useState<PartnerSchool[]>([]);
  const [loading, setLoading] = useState(true);

  // 載入資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, schoolsRes] = await Promise.all([
          fetch('/api/worldmap/stats'),
          fetch('/api/worldmap/schools'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (schoolsRes.ok) {
          const schoolsData = await schoolsRes.json();
          // 轉換資料格式，添加 coordinates 屬性
          const formattedSchools = schoolsData
            .filter((school: any) => school.isActive)
            .map((school: any) => ({
              ...school,
              coordinates: [school.longitude, school.latitude] as [
                number,
                number,
              ],
            }));
          setPartnerSchools(formattedSchools);
        }
      } catch (error) {
        console.error('Failed to load world map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl p-6">
      {/* 標題區域 */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-50 mb-2">
          {t('title')}
        </h3>
        <p className="text-primary-100">{t('subtitle')}</p>
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
                🇹🇼 {t('taiwan')}
              </text>
            </g>
          </Marker>

          {/* 合作學校標記 */}
          {partnerSchools.map((school) => {
            const radius = Math.max(4, school.students / 25);
            const schoolName = getSchoolName(school, locale);
            const isHovered = hoveredSchool === school.id;

            return (
              <Marker key={school.id} coordinates={school.coordinates}>
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
                    onMouseEnter={() => setHoveredSchool(school.id)}
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
                        {school.flag} {schoolName}
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
                        {school.students} {t('exchange_students')}
                      </text>
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* 載入狀態 */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-primary-200">{t('loading')}</p>
        </div>
      )}

      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {stats.schools}
          </div>
          <div className="text-sm text-primary-200">{t('partner_schools')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {stats.students}
          </div>
          <div className="text-sm text-primary-200">{t('students')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {stats.countries}
          </div>
          <div className="text-sm text-primary-200">{t('countries')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {stats.continents}
          </div>
          <div className="text-sm text-primary-200">{t('continents')}</div>
        </div>
      </div>

      {/* 圖例說明 */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
          <span className="text-white font-medium">
            {t('legend_partner_location')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></div>
          <span className="text-white font-medium">
            {t('legend_taiwan_location')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-1 bg-amber-500/50 rounded shadow-sm"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, rgb(245, 158, 11) 0, rgb(245, 158, 11) 3px, transparent 3px, transparent 6px)',
            }}
          ></div>
          <span className="text-white font-medium">
            {t('legend_connection')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-medium">
            {t('legend_size_hint')}
          </span>
        </div>
      </div>
    </div>
  );
}
