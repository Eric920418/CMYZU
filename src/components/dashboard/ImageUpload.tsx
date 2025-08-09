'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload?: (imageUrl: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
}

export default function ImageUpload({
  onUpload,
  currentImage,
  accept = 'image/*',
  maxSize = 5,
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 當 currentImage 變化時，同步更新 preview
  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > maxSize * 1024 * 1024) {
      setError(`檔案大小超過 ${maxSize}MB 限制`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.success) {
        const newImageUrl = data.data.url;
        console.log('UPLOAD CALLBACK - Calling onUpload with:', newImageUrl);
        setPreview(newImageUrl);
        console.log('UPLOAD - About to call onUpload callback');
        if (onUpload) {
          onUpload(newImageUrl);
          console.log('UPLOAD - onUpload callback completed');
        } else {
          console.log('UPLOAD - No onUpload callback provided');
        }
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUpload?.('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上傳區域 */}
      <div className="relative">
        {!preview ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">點擊上傳</span> 或拖放檔案
              </p>
              <p className="text-xs text-gray-500">
                支援 PNG、JPG、GIF、WebP (最大 {maxSize}MB)
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="relative group">
            <div className="relative w-full h-64">
              <Image
                src={
                  preview.startsWith('data:')
                    ? preview
                    : preview.includes('?')
                      ? preview
                      : `${preview}?t=${Date.now()}`
                }
                alt="預覽"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* 覆蓋層操作按鈕 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                更換圖片
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                移除圖片
              </motion.button>
            </div>
          </div>
        )}

        {/* 上傳中覆蓋層 */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>上傳中...</p>
            </div>
          </div>
        )}
      </div>

      {/* 隱藏的檔案輸入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {/* 錯誤訊息 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* 上傳狀態 */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm"
        >
          正在上傳圖片，請稍候...
        </motion.div>
      )}
    </div>
  );
}
