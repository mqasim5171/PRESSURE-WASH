import React, { useRef, useState, useEffect } from "react";
import { Upload, X, Loader2, ImageOff } from "lucide-react";
import { api } from "../api";
import { resolveMediaUrl } from "../../lib/media";

/**
 * MediaPicker
 * -------------
 * Upload-in-place image field: shows the current image (if any), an upload
 * button, and a clear button. Uploading immediately creates a Media row and
 * calls onChange(mediaId, url) - the parent form just stores the id.
 */
export default function MediaPicker({ mediaId, url, category = "general", onChange, label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [url]);
  const resolvedUrl = resolveMediaUrl(url);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", category);
      const media = await api.upload("/api/admin/media/upload", form);
      onChange(media.id, media.url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {mediaId && resolvedUrl && !failed ? (
            <img src={resolvedUrl} alt="" className="w-full h-full object-cover" onError={() => setFailed(true)} />
          ) : (
            <ImageOff className="w-5 h-5 text-slate-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {mediaId ? "Replace" : "Upload"}
            </button>
            {mediaId && (
              <button
                type="button"
                onClick={() => onChange(null, null)}
                className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-slate-400">JPG, PNG or WebP</p>
        </div>
      </div>
    </div>
  );
}
