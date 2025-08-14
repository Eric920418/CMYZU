'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  geocodeLocation,
  getCountryFlag,
  GeocodingResult,
} from '@/lib/geocoding';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WorldMapStats {
  schools: number;
  students: number;
  countries: number;
  continents: number;
}

interface PartnerSchool {
  id: string;
  name: string;
  students: number;
  flag: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  order: number;
}

// 可排序的學校項目元件
function SortableSchoolItem({
  school,
  onEdit,
  onDelete,
}: {
  school: PartnerSchool;
  onEdit: (school: PartnerSchool) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: school.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 拖拽手把 */}
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
            {...attributes}
            {...listeners}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </button>
          <span className="text-xl sm:text-2xl">{school.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base truncate">
              {school.name}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              <div className="sm:hidden">
                {/* 手機版：分行顯示 */}
                <div>{school.students} 位交流學生</div>
                <div>
                  位置: {school.latitude.toFixed(4)},{' '}
                  {school.longitude.toFixed(4)}
                </div>
              </div>
              <div className="hidden sm:block">
                {/* 桌面版：單行顯示 */}
                {school.students} 位交流學生 | 位置:{' '}
                {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
          <div
            className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {school.isActive ? '顯示中' : '已隱藏'}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => onEdit(school)}
              className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm sm:text-base"
            >
              編輯
            </button>
            <button
              onClick={() => onDelete(school.id)}
              className="text-red-600 hover:text-red-800 px-2 py-1 text-sm sm:text-base"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorldMapManagementPage() {
  const [stats, setStats] = useState<WorldMapStats>({
    schools: 10,
    students: 925,
    countries: 8,
    continents: 4,
  });
  const [schools, setSchools] = useState<PartnerSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<PartnerSchool | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>(
    []
  );
  const [geocodingQuery, setGeocodingQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 拖拽排序感應器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 新增學校表單資料
  const [newSchool, setNewSchool] = useState({
    name: '',
    students: 0,
    flag: '',
    latitude: 0,
    longitude: 0,
  });

  // 載入資料
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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
        setSchools(schoolsData);
      }
    } catch (err) {
      setError('載入資料失敗: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 更新統計數字
  const updateStats = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/worldmap/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });

      if (!response.ok) {
        throw new Error('更新失敗');
      }

      alert('統計數字更新成功！');
    } catch (err) {
      setError('更新統計數字失敗: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // 驗證表單
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newSchool.name.trim()) {
      errors.name = '學校名稱為必填項目';
    } else if (newSchool.name.length < 2) {
      errors.name = '學校名稱至少需要2個字元';
    }

    if (!newSchool.flag.trim()) {
      errors.flag = '國家旗幟為必填項目';
    }

    if (newSchool.students < 0) {
      errors.students = '交流學生數不能為負數';
    }

    if (newSchool.latitude < -90 || newSchool.latitude > 90) {
      errors.latitude = '緯度必須在 -90 到 90 之間';
    }

    if (newSchool.longitude < -180 || newSchool.longitude > 180) {
      errors.longitude = '經度必須在 -180 到 180 之間';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 新增學校
  const addSchool = async () => {
    if (!validateForm()) {
      setError('請檢查表單中的錯誤並修正後再試');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/worldmap/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchool),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '新增失敗');
      }

      setSuccessMessage('學校新增成功！');
      setNewSchool({
        name: '',
        students: 0,
        flag: '',
        latitude: 0,
        longitude: 0,
      });
      setFieldErrors({});
      setShowAddForm(false);
      fetchData();

      // 3秒後清除成功訊息
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('新增學校失敗: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // 更新學校
  const updateSchool = async (school: PartnerSchool) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/worldmap/schools/${school.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(school),
      });

      if (!response.ok) {
        throw new Error('更新失敗');
      }

      alert('學校更新成功！');
      setEditingSchool(null);
      fetchData();
    } catch (err) {
      setError('更新學校失敗: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // 刪除學校
  const deleteSchool = async (id: string) => {
    if (!confirm('確定要刪除這所學校嗎？')) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/worldmap/schools/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('刪除失敗');
      }

      alert('學校刪除成功！');
      fetchData();
    } catch (err) {
      setError('刪除學校失敗: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // 地理編碼查詢座標
  const handleGeocoding = async () => {
    if (!geocodingQuery.trim()) {
      setError('請輸入學校名稱和位置進行查詢');
      return;
    }

    try {
      setIsGeocoding(true);
      setError(null);
      const results = await geocodeLocation(geocodingQuery);
      setGeocodingResults(results);
    } catch (err) {
      setError('座標查詢失敗: ' + (err as Error).message);
      setGeocodingResults([]);
    } finally {
      setIsGeocoding(false);
    }
  };

  // 選擇地理編碼結果
  const selectGeocodingResult = (result: GeocodingResult) => {
    setNewSchool({
      ...newSchool,
      latitude: result.latitude,
      longitude: result.longitude,
      flag: newSchool.flag || getCountryFlag(result.countryCode),
    });
    setGeocodingResults([]);
    setGeocodingQuery('');
  };

  // 處理拖拽排序結束
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = schools.findIndex((school) => school.id === active.id);
      const newIndex = schools.findIndex((school) => school.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // 重新排序本地狀態
        const newSchools = arrayMove(schools, oldIndex, newIndex);
        setSchools(newSchools);

        // 更新資料庫中的順序
        try {
          const updatePromises = newSchools.map((school, index) =>
            fetch(`/api/worldmap/schools/${school.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...school, order: index }),
            })
          );

          await Promise.all(updatePromises);
          setSuccessMessage('學校順序更新成功！');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          setError('更新學校順序失敗: ' + (err as Error).message);
          // 如果更新失敗，重新載入資料
          fetchData();
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          全球合作地圖管理
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                關閉
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="mt-2 text-sm text-green-600 hover:text-green-800"
              >
                關閉
              </button>
            </div>
          )}

          {/* 統計數字調整 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">統計數字設定</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  合作學校
                </label>
                <input
                  type="number"
                  value={stats.schools}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      schools: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  交流學生
                </label>
                <input
                  type="number"
                  value={stats.students}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      students: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  合作國家
                </label>
                <input
                  type="number"
                  value={stats.countries}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      countries: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  合作大洲
                </label>
                <input
                  type="number"
                  value={stats.continents}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      continents: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              onClick={updateStats}
              disabled={saving}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? '更新中...' : '更新統計數字'}
            </button>
          </div>

          {/* 合作學校管理 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">合作學校管理</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {showAddForm ? '取消新增' : '新增學校'}
              </button>
            </div>

            {/* 新增學校表單 */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">新增合作學校</h3>

                {/* 基本資訊 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    基本資訊
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        學校名稱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="請輸入學校全名"
                        value={newSchool.name}
                        onChange={(e) => {
                          setNewSchool({ ...newSchool, name: e.target.value });
                          if (fieldErrors.name) {
                            setFieldErrors({ ...fieldErrors, name: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          fieldErrors.name
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        國家旗幟 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="如: 🇺🇸 🇯🇵 🇬🇧"
                        value={newSchool.flag}
                        onChange={(e) => {
                          setNewSchool({ ...newSchool, flag: e.target.value });
                          if (fieldErrors.flag) {
                            setFieldErrors({ ...fieldErrors, flag: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          fieldErrors.flag
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                      />
                      {fieldErrors.flag ? (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.flag}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          輸入國家旗幟 emoji，可複製貼上
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 交流資訊 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    交流資訊
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        交流學生數
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={newSchool.students || ''}
                        onChange={(e) => {
                          setNewSchool({
                            ...newSchool,
                            students: parseInt(e.target.value) || 0,
                          });
                          if (fieldErrors.students) {
                            setFieldErrors({ ...fieldErrors, students: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          fieldErrors.students
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                      />
                      {fieldErrors.students && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.students}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 地理位置 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    地理位置座標
                  </h4>

                  {/* 自動查詢座標 */}
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                    <h5 className="text-sm font-medium text-yellow-800 mb-2">
                      🔍 自動查詢座標 (推薦)
                    </h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="輸入學校名稱和城市，如：Harvard University Cambridge USA"
                        value={geocodingQuery}
                        onChange={(e) => setGeocodingQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleGeocoding()
                        }
                      />
                      <button
                        type="button"
                        onClick={handleGeocoding}
                        disabled={isGeocoding || !geocodingQuery.trim()}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isGeocoding ? '查詢中...' : '查詢座標'}
                      </button>
                    </div>

                    {/* 查詢結果 */}
                    {geocodingResults.length > 0 && (
                      <div className="mt-3 max-h-48 overflow-y-auto">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          選擇正確的位置：
                        </p>
                        {geocodingResults.map((result, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectGeocodingResult(result)}
                            className="w-full text-left p-2 mb-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {getCountryFlag(result.countryCode)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {result.displayName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  座標: {result.latitude.toFixed(6)},{' '}
                                  {result.longitude.toFixed(6)}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 手動輸入座標 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        緯度 (Latitude)
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-90"
                        max="90"
                        placeholder="如: 25.0330 (台北)"
                        value={newSchool.latitude || ''}
                        onChange={(e) => {
                          setNewSchool({
                            ...newSchool,
                            latitude: parseFloat(e.target.value) || 0,
                          });
                          if (fieldErrors.latitude) {
                            setFieldErrors({ ...fieldErrors, latitude: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          fieldErrors.latitude
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                      />
                      {fieldErrors.latitude && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.latitude}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        經度 (Longitude)
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-180"
                        max="180"
                        placeholder="如: 121.5654 (台北)"
                        value={newSchool.longitude || ''}
                        onChange={(e) => {
                          setNewSchool({
                            ...newSchool,
                            longitude: parseFloat(e.target.value) || 0,
                          });
                          if (fieldErrors.longitude) {
                            setFieldErrors({ ...fieldErrors, longitude: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          fieldErrors.longitude
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                      />
                      {fieldErrors.longitude && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 手動查詢說明 */}
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      💡 <strong>手動取得座標：</strong>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      1. 在 Google Maps 搜尋學校位置 <br />
                      2. 右鍵點選該位置，選擇「這是哪裡？」
                      <br />
                      3. 點選座標數字即可複製貼上
                    </p>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={addSchool}
                    disabled={saving || !newSchool.name || !newSchool.flag}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? '新增中...' : '新增學校'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewSchool({
                        name: '',
                        students: 0,
                        flag: '',
                        latitude: 0,
                        longitude: 0,
                      });
                      setFieldErrors({});
                      setGeocodingResults([]);
                      setGeocodingQuery('');
                    }}
                    className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 學校列表 */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="hidden sm:inline">
                    💡 拖拽學校項目可以重新排序顯示順序
                  </span>
                  <span className="sm:hidden">💡 長按拖拽可重新排序</span>
                </p>
              </div>

              {editingSchool ? (
                // 編輯模式 - 不允許拖拽
                <div className="space-y-2">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      {editingSchool.id === school.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={editingSchool.name}
                            onChange={(e) =>
                              setEditingSchool({
                                ...editingSchool,
                                name: e.target.value,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            value={editingSchool.students}
                            onChange={(e) =>
                              setEditingSchool({
                                ...editingSchool,
                                students: parseInt(e.target.value) || 0,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            value={editingSchool.flag}
                            onChange={(e) =>
                              setEditingSchool({
                                ...editingSchool,
                                flag: e.target.value,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            step="any"
                            value={editingSchool.latitude}
                            onChange={(e) =>
                              setEditingSchool({
                                ...editingSchool,
                                latitude: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            step="any"
                            value={editingSchool.longitude}
                            onChange={(e) =>
                              setEditingSchool({
                                ...editingSchool,
                                longitude: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateSchool(editingSchool)}
                              disabled={saving}
                              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                              儲存
                            </button>
                            <button
                              onClick={() => setEditingSchool(null)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <SortableSchoolItem
                          school={school}
                          onEdit={setEditingSchool}
                          onDelete={deleteSchool}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // 一般模式 - 可拖拽排序
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={schools.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {schools.map((school) => (
                        <SortableSchoolItem
                          key={school.id}
                          school={school}
                          onEdit={setEditingSchool}
                          onDelete={deleteSchool}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {schools.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <p>尚未新增任何合作學校</p>
                  <p className="text-sm mt-1">
                    點擊上方「新增學校」按鈕開始建立合作學校資料
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
