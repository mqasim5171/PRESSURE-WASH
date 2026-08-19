import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["blockquote"],
    ["clean"],
  ],
};

/**
 * RichTextEditor
 * -----------------
 * Blog post body editor. Quill's own output is sanitized HTML (no <script>,
 * no inline event handlers), which the public BlogPost page renders with
 * dangerouslySetInnerHTML - safe specifically because it only ever holds
 * markup Quill itself produced, not raw user/attacker-supplied HTML.
 */
export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[280px] [&_.ql-editor]:text-sm">
      <ReactQuill theme="snow" value={value || ""} onChange={onChange} modules={MODULES} />
    </div>
  );
}
