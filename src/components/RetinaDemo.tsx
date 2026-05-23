export default function RetinaDemo() {
  return (
    <div className="relative">
      {/* Video container */}
      <div className="relative shadow-2xl aspect-video" style={{ clipPath: 'inset(0 round 32px)' }}>
        {/* Desktop: 1080p AV1 with MP4 fallback */}
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline=""
          preload="auto"
          poster="/retina-video-poster.webp"
          className="hidden lg:block w-full h-full object-cover transform-gpu"
        >
          <source src="/feature_ai_graphics_1080p.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
          <source src="/feature_ai_graphics_1080p.webm" type="video/webm" />
          <source src="/feature_ai_graphics_wide.mp4" type="video/mp4" />
        </video>
        {/* Mobile: 720p AV1 with WebM fallback */}
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline=""
          preload="auto"
          poster="/retina-video-poster.webp"
          className="lg:hidden w-full h-full object-cover transform-gpu"
        >
          <source src="/feature_ai_graphics_720p.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
          <source src="/feature_ai_graphics_720p.webm" type="video/webm" />
          <source src="/feature_ai_graphics_wide.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Subtle reflection/glow beneath */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-transparent to-purple-500/10 blur-xl" />
    </div>
  );
}
