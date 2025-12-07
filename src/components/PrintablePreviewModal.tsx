import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  previewImg: string | null; // low-res JPG for preview
  title: string;
}

export default function PrintablePreviewModal({
  open,
  onClose,
  previewImg,
  title,
}: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.25 }}
  className="bg-white/95 rounded-xl p-6 shadow-xl border border-[#e4d5b8]"
>
  {/* modal content */}
</motion.div>

  // Render preview onto canvas with watermark
  useEffect(() => {
    if (!open || !previewImg) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous"; // helps avoid CORS issues

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the preview image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      ctx.font = "48px Cormorant Garamond";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.rotate(-0.2);
      ctx.fillText("Preview Only", img.width / 6, img.height / 2);
      ctx.rotate(0.2);
    };

    img.src = previewImg;
  }, [open, previewImg]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()} // disable right-click
    >
      <div
        className="bg-white rounded-xl p-4 shadow-xl max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#4b3b2f]">
          {title}
        </h2>

        {/* Canvas preview with watermark */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow max-h-[70vh]"
          />
        </div>

        {/* Close button */}
        <button
          className="mt-6 w-full py-3 bg-[#b8d3d5] rounded-xl shadow hover:bg-[#a2c1c3]"
          onClick={onClose}
        >
          Close Preview
        </button>
      </div>
    </div>
  );
}
