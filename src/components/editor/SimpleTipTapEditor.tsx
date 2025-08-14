'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface SimpleTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

function SimpleTipTapEditor({
  content,
  onChange,
  className = '',
}: SimpleTipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
        <div className="text-gray-500">編輯器載入中...</div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* 簡單工具列 */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-md">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('bold')
                ? 'bg-blue-200 text-blue-800'
                : 'bg-white text-gray-700'
            }`}
          >
            粗體
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('italic')
                ? 'bg-blue-200 text-blue-800'
                : 'bg-white text-gray-700'
            }`}
          >
            斜體
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-200 text-blue-800'
                : 'bg-white text-gray-700'
            }`}
          >
            標題
          </button>
        </div>
      </div>

      {/* 編輯區域 */}
      <div className="p-4 min-h-[300px]">
        <EditorContent
          editor={editor}
          className="focus:outline-none min-h-[200px]"
        />
      </div>
    </div>
  );
}

export default SimpleTipTapEditor;
