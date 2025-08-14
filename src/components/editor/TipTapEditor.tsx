'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  MinusIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

function TipTapEditor({
  content,
  onChange,
  className = '',
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      Blockquote,
      HorizontalRule,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
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

  // 工具列按鈕樣式
  const getButtonClass = (isActive = false) =>
    `p-2 rounded-md hover:bg-gray-100 ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
    }`;

  // 新增圖片
  const addImage = () => {
    const url = window.prompt('請輸入圖片網址:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // 新增連結
  const addLink = () => {
    const url = window.prompt('請輸入連結網址:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // 移除連結
  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // 設定標題層級
  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* 工具列 */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-md">
        <div className="flex flex-wrap gap-1">
          {/* 撤銷/重做 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={getButtonClass()}
            title="撤銷"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={getButtonClass()}
            title="重做"
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 標題 */}
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                setHeading(level as 1 | 2 | 3 | 4 | 5 | 6);
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            value={
              editor.isActive('heading', { level: 1 })
                ? 1
                : editor.isActive('heading', { level: 2 })
                  ? 2
                  : editor.isActive('heading', { level: 3 })
                    ? 3
                    : editor.isActive('heading', { level: 4 })
                      ? 4
                      : editor.isActive('heading', { level: 5 })
                        ? 5
                        : editor.isActive('heading', { level: 6 })
                          ? 6
                          : 0
            }
          >
            <option value={0}>段落</option>
            <option value={1}>標題 1</option>
            <option value={2}>標題 2</option>
            <option value={3}>標題 3</option>
            <option value={4}>標題 4</option>
            <option value={5}>標題 5</option>
            <option value={6}>標題 6</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 文字樣式 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={getButtonClass(editor.isActive('bold'))}
            title="粗體"
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={getButtonClass(editor.isActive('italic'))}
            title="斜體"
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={getButtonClass(editor.isActive('underline'))}
            title="底線"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={getButtonClass(editor.isActive('strike'))}
            title="刪除線"
          >
            <StrikethroughIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={getButtonClass(editor.isActive('code'))}
            title="行內程式碼"
          >
            <CodeBracketIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 列表 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={getButtonClass(editor.isActive('bulletList'))}
            title="項目符號"
          >
            <ListBulletIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={getButtonClass(editor.isActive('orderedList'))}
            title="編號列表"
          >
            <NumberedListIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={getButtonClass(editor.isActive('blockquote'))}
            title="引言"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 對齊 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
            title="靠左對齊"
          >
            L
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
            title="置中對齊"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
            title="靠右對齊"
          >
            R
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 插入 */}
          <button
            type="button"
            onClick={addImage}
            className={getButtonClass()}
            title="插入圖片"
          >
            <PhotoIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={editor.isActive('link') ? removeLink : addLink}
            className={getButtonClass(editor.isActive('link'))}
            title={editor.isActive('link') ? '移除連結' : '插入連結'}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={getButtonClass()}
            title="插入分隔線"
          >
            <MinusIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 文字顏色 */}
          <input
            type="color"
            onInput={(event) =>
              editor
                .chain()
                .focus()
                .setColor((event.target as HTMLInputElement).value)
                .run()
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            title="文字顏色"
          />

          {/* 螢光筆 */}
          <input
            type="color"
            onInput={(event) =>
              editor
                .chain()
                .focus()
                .setHighlight({
                  color: (event.target as HTMLInputElement).value,
                })
                .run()
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            title="螢光筆"
          />
        </div>
      </div>

      {/* 編輯區域 */}
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} className="focus:outline-none" />
      </div>
    </div>
  );
}

export default TipTapEditor;
