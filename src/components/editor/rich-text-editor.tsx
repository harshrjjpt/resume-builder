"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";
import { useEffect } from "react";
import { Bold, Heading1, Heading2, Heading3, Heading4, Italic, Link2, List, ListOrdered, Pilcrow, Quote, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

const LinkMark = Mark.create({
  name: "link",
  inclusive: false,
  addAttributes() {
    return {
      href: { default: null },
      target: { default: "_blank" },
      rel: { default: "noopener noreferrer nofollow" }
    };
  },
  parseHTML() {
    return [{ tag: "a[href]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["a", mergeAttributes(HTMLAttributes), 0];
  }
});

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editor = useEditor({
    extensions: [
      LinkMark,
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] }
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-32 rounded-b-xl border-x border-b bg-background px-3 py-2 text-sm outline-none [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:text-lg [&_h4]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_a]:text-sky-500 [&_a]:underline [&_a]:underline-offset-2"
      }
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML())
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  if (!editor) {
    return <div className="min-h-32 rounded-xl border bg-background" />;
  }

  const controls = [
    { icon: Pilcrow, label: "P", active: editor.isActive("paragraph"), onClick: () => editor.chain().focus().setParagraph().run() },
    { icon: Heading1, label: "H1", active: editor.isActive("heading", { level: 1 }), onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: Heading2, label: "H2", active: editor.isActive("heading", { level: 2 }), onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: Heading3, label: "H3", active: editor.isActive("heading", { level: 3 }), onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: Heading4, label: "H4", active: editor.isActive("heading", { level: 4 }), onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
    { icon: Bold, label: "Bold", active: editor.isActive("bold"), onClick: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, label: "Italic", active: editor.isActive("italic"), onClick: () => editor.chain().focus().toggleItalic().run() },
    {
      icon: Link2,
      label: "Link",
      active: editor.isActive("link"),
      onClick: () => {
        const current = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Enter URL", current ?? "https://");
        if (!url) return;
        editor.chain().focus().setMark("link", { href: url.trim() }).run();
      }
    },
    { icon: Unlink, label: "Unlink", active: false, onClick: () => editor.chain().focus().unsetMark("link").run() },
    { icon: List, label: "UL", active: editor.isActive("bulletList"), onClick: () => editor.chain().focus().toggleBulletList().run() },
    { icon: ListOrdered, label: "OL", active: editor.isActive("orderedList"), onClick: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: Quote, label: "Quote", active: editor.isActive("blockquote"), onClick: () => editor.chain().focus().toggleBlockquote().run() }
  ];

  return (
    <div>
      <div className="rounded-t-xl border bg-muted/40 p-1 flex flex-wrap gap-1">
        {controls.map((control) => (
          <button
            key={control.label}
            type="button"
            onClick={control.onClick}
            className={cn(
              "h-7 min-w-7 px-2 rounded-md text-xs inline-flex items-center justify-center gap-1 transition",
              control.active ? "bg-accent border" : "hover:bg-accent/70"
            )}
            title={control.label}
          >
            <control.icon size={13} />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
