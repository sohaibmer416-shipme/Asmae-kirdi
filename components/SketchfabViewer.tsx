
import React from 'react';

interface SketchfabViewerProps {
  modelId: string;
  title: string;
}

const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ modelId, title }) => {
  // Construct the iframe URL with parameters for a cleaner, auto-playing, high-performance view
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_watermark=0&ui_hint=2&preload=1&transparent=1`;

  return (
    <div className="w-full h-full relative group">
      <iframe
        title={title}
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        className="w-full h-full pointer-events-auto"
      />
      {/* Visual frame overlay to keep it in the game's style */}
      <div className="absolute inset-0 border-2 border-white/5 pointer-events-none rounded-xl" />
    </div>
  );
};

export default SketchfabViewer;
