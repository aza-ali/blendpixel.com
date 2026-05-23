import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Folder from '../components/Folder/Folder';

// Copyright year helper
const startYear = 2025;
const currentYear = new Date().getFullYear();
const copyrightYear = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

// Spring configs
const contentSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 20,
  mass: 0.8,
};

// Stagger delays for content reveal
const stagger = {
  logo: 0,
  title: 0.05,
  tagline: 0.1,
  preview: 0.15,
  cta: 0.25,
};

// Folder items for Orbit
const orbitFolderItems = [
  <div key="logo" className="w-full h-full flex items-center justify-center">
    <img src="/orbit-logo.svg" alt="" className="w-7 h-7 object-contain drop-shadow-md" />
  </div>,
  <div key="preview" className="w-full h-full overflow-hidden rounded-md bg-gradient-to-br from-[#5c1a30] to-[#2a0c28]">
    <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/orbit-smartunfollow-poster.webp" className="w-full h-full object-cover">
      <source src="/orbit-smartunfollow.webm" type="video/webm" />
      <source src="/orbit-smartunfollow.mp4" type="video/mp4" />
    </video>
  </div>,
  <div key="cta" className="w-full h-full flex items-center justify-center">
    <span className="text-[6px] font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">Explore Orbit</span>
  </div>,
];

// Folder items for Retina
const retinaFolderItems = [
  <div key="logo" className="w-full h-full flex items-center justify-center">
    <picture>
      <source srcSet="/retina-logo.webp" type="image/webp" />
      <img src="/retina-logo.png" alt="" className="w-7 h-7 object-contain rounded-[22%] drop-shadow-md" />
    </picture>
  </div>,
  <div key="preview" className="w-full h-full overflow-hidden rounded-md bg-gradient-to-br from-[#101c36] to-[#060a14]">
    <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/retina-video-poster.webp" className="w-full h-full object-cover">
      <source src="/feature_ai_graphics_720p.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
      <source src="/feature_ai_graphics_720p.webm" type="video/webm" />
      <source src="/feature_ai_graphics_wide.mp4" type="video/mp4" />
    </video>
  </div>,
  <div key="cta" className="w-full h-full flex items-center justify-center">
    <span className="text-[6px] font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full whitespace-nowrap">Explore Retina</span>
  </div>,
];

// Folder items for Listval
const listvalFolderItems = [
  <div key="logo" className="w-full h-full flex items-center justify-center">
    <picture>
      <source srcSet="/listval-logo.webp" type="image/webp" />
      <img src="/listval-logo.png" alt="" className="w-7 h-7 object-contain rounded-[22%] drop-shadow-md" />
    </picture>
  </div>,
  <div key="preview" className="w-full h-full overflow-hidden rounded-md bg-gradient-to-br from-[#0c2040] to-[#0a2838]">
    <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/listval-video-poster.webp" className="w-full h-full object-cover">
      <source src="/listval-web.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
      <source src="/listval-web.webm" type="video/webm" />
      <source src="/listval-web.mp4" type="video/mp4" />
    </video>
  </div>,
  <div key="cta" className="w-full h-full flex items-center justify-center">
    <span className="text-[6px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">Explore Listval</span>
  </div>,
];

// Orbit content component (reusable)
function OrbitContent({ isOpen, mobile = false }: { isOpen: boolean; mobile?: boolean }) {
  return (
    <div className={mobile ? "flex flex-col items-center text-center h-full" : "contents"}>
      <motion.div
        className="mb-4 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{
          scale: isOpen ? 1 : 0,
          y: isOpen ? 0 : 200,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.logo : 0 }}
      >
        <img src="/orbit-logo.svg" alt="Orbit" className="w-16 h-16 lg:w-20 lg:h-20" />
      </motion.div>

      <motion.h2
        className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.title : 0 }}
      >
        Orbit
      </motion.h2>

      <motion.p
        className="text-base lg:text-lg text-white/90 mb-4 lg:mb-6 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.tagline : 0 }}
      >
        Instagram growth that runs itself
      </motion.p>

      <motion.div
        className="relative w-full mb-4 lg:mb-6 flex-1 min-h-0 flex items-center justify-center"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.preview : 0 }}
      >
        <a href="https://chromewebstore.google.com/detail/instagram-auto-like-autom/ialabgnikmojmnhoahngjiegigmfhghd" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full p-4">
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30 cursor-pointer hover:scale-[1.02] transition-transform duration-300 aspect-video max-h-full max-w-full">
            <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/orbit-smartunfollow-poster.webp" className="w-full h-full object-cover">
              <source src="/orbit-smartunfollow.webm" type="video/webm" />
              <source src="/orbit-smartunfollow.mp4" type="video/mp4" />
            </video>
          </div>
        </a>
      </motion.div>

      <motion.div
        className="flex-shrink-0 pb-4 lg:pb-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.cta : 0 }}
      >
        <a
          href="https://chromewebstore.google.com/detail/instagram-auto-like-autom/ialabgnikmojmnhoahngjiegigmfhghd"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium hover:bg-white/30 transition-colors"
        >
          Explore Orbit
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}

// Retina content component (reusable)
function RetinaContent({ isOpen, mobile = false }: { isOpen: boolean; mobile?: boolean }) {
  return (
    <div className={mobile ? "flex flex-col items-center text-center h-full" : "contents"}>
      <motion.div
        className="mb-4 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.logo : 0 }}
      >
        <picture>
          <source srcSet="/retina-logo.webp" type="image/webp" />
          <img src="/retina-logo.png" alt="Retina" className="w-16 h-16 lg:w-20 lg:h-20 rounded-[22%] shadow-lg" />
        </picture>
      </motion.div>

      <motion.h2
        className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.title : 0 }}
      >
        Retina
      </motion.h2>

      <motion.p
        className="text-base lg:text-lg text-white/90 mb-4 lg:mb-6 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.tagline : 0 }}
      >
        Screen recordings, auto-tuned
      </motion.p>

      <motion.div
        className="relative w-full mb-4 lg:mb-6 flex-1 min-h-0 flex items-center justify-center"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.preview : 0 }}
      >
        <Link to="/products/retina" className="flex items-center justify-center h-full p-4">
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30 cursor-pointer hover:scale-[1.02] transition-transform duration-300 aspect-video max-h-full max-w-full">
            <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/retina-video-poster.webp" className="w-full h-full object-cover">
              <source src="/feature_ai_graphics_720p.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
              <source src="/feature_ai_graphics_720p.webm" type="video/webm" />
              <source src="/feature_ai_graphics_wide.mp4" type="video/mp4" />
            </video>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="flex-shrink-0 pb-4 lg:pb-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.cta : 0 }}
      >
        <Link
          to="/products/retina"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium hover:bg-white/30 transition-colors"
        >
          Explore Retina
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}

// Listval content component (reusable)
function ListvalContent({ isOpen, mobile = false }: { isOpen: boolean; mobile?: boolean }) {
  return (
    <div className={mobile ? "flex flex-col items-center text-center h-full" : "contents"}>
      <motion.div
        className="mb-4 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.logo : 0 }}
      >
        <picture>
          <source srcSet="/listval-logo.webp" type="image/webp" />
          <img src="/listval-logo.png" alt="Listval" className="w-16 h-16 lg:w-20 lg:h-20 rounded-[22%] shadow-lg" />
        </picture>
      </motion.div>

      <motion.h2
        className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.title : 0 }}
      >
        Listval
      </motion.h2>

      <motion.p
        className="text-base lg:text-lg text-white/90 mb-4 lg:mb-6 flex-shrink-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.tagline : 0 }}
      >
        Turn your values into daily action
      </motion.p>

      <motion.div
        className="relative w-full mb-4 lg:mb-6 flex-1 min-h-0 flex items-center justify-center"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.preview : 0 }}
      >
        <a href="https://listval.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full p-4">
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30 cursor-pointer hover:scale-[1.02] transition-transform duration-300 aspect-video max-h-full max-w-full">
            <video autoPlay loop muted playsInline webkit-playsinline="" preload="metadata" poster="/listval-video-poster.webp" className="w-full h-full object-cover">
              <source src="/listval-web.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
              <source src="/listval-web.webm" type="video/webm" />
              <source src="/listval-web.mp4" type="video/mp4" />
            </video>
          </div>
        </a>
      </motion.div>

      <motion.div
        className="flex-shrink-0 pb-4 lg:pb-0"
        initial={{ scale: 0, y: 200, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0, y: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ ...contentSpring, delay: isOpen ? stagger.cta : 0 }}
      >
        <a
          href="https://listval.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium hover:bg-white/30 transition-colors"
        >
          Explore Listval
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}

// Desktop: Orbit card (original behavior)
function OrbitCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-12 min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#5c1a30] via-[#441438] to-[#2a0c28]"
        animate={{ scale: isOpen ? 1.02 : 1 }}
        transition={contentSpring}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[85%]">
        <OrbitContent isOpen={isOpen} />
        <motion.div className="mt-8" animate={{ y: isOpen ? 40 : -150 }} transition={contentSpring}>
          <Folder
            color="#5AC8FA"
            size={1.5}
            open={isOpen}
            onToggle={() => setIsOpen(prev => !prev)}
            label="Orbit"
            icon={<img src="/orbit-logo.svg" alt="" />}
            items={orbitFolderItems}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Desktop: Retina card (original behavior)
function RetinaCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-12 min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#080c1a] via-[#101c36] to-[#060a14]"
        animate={{ scale: isOpen ? 1.02 : 1 }}
        transition={contentSpring}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[85%]">
        <RetinaContent isOpen={isOpen} />
        <motion.div className="mt-8" animate={{ y: isOpen ? 40 : -150 }} transition={contentSpring}>
          <Folder
            color="#5AC8FA"
            size={1.5}
            open={isOpen}
            onToggle={() => setIsOpen(prev => !prev)}
            label="Retina"
            icon={<picture><source srcSet="/retina-logo.webp" type="image/webp" /><img src="/retina-logo.png" alt="" className="rounded-[22%]" /></picture>}
            items={retinaFolderItems}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Desktop: Listval card (original behavior)
function ListvalCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-12 min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0c2040] via-[#103050] to-[#0a2838]"
        animate={{ scale: isOpen ? 1.02 : 1 }}
        transition={contentSpring}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[85%]">
        <ListvalContent isOpen={isOpen} />
        <motion.div className="mt-8" animate={{ y: isOpen ? 40 : -150 }} transition={contentSpring}>
          <Folder
            color="#5AC8FA"
            size={1.5}
            open={isOpen}
            onToggle={() => setIsOpen(prev => !prev)}
            label="Listval"
            icon={<picture><source srcSet="/listval-logo.webp" type="image/webp" /><img src="/listval-logo.png" alt="" className="rounded-[22%]" /></picture>}
            items={listvalFolderItems}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Mobile layout: content at top, folders at bottom (viewport-locked, no scroll)
function MobileHome() {
  const [selected, setSelected] = useState<'orbit' | 'retina' | 'listval' | null>(null);

  const handleToggle = (product: 'orbit' | 'retina' | 'listval') => {
    setSelected(prev => prev === product ? null : product);
  };

  return (
    <div className="h-dvh flex flex-col overflow-auto">
      {/* Background - changes based on selection */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: selected === 'orbit'
            ? 'linear-gradient(to bottom right, #5c1a30, #441438, #2a0c28)'
            : selected === 'retina'
            ? 'linear-gradient(to bottom right, #080c1a, #101c36, #060a14)'
            : selected === 'listval'
            ? 'linear-gradient(to bottom right, #0c2040, #103050, #0a2838)'
            : 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f172a)',
        }}
        transition={{ duration: 0.5 }}
      />
      <div
        className="fixed inset-0 opacity-10 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content area - flexes to fill available space */}
      <div className="flex-1 min-h-[565px] flex flex-col items-center justify-center px-1 py-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {selected === 'orbit' && (
            <motion.div
              key="orbit"
              className="w-full h-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <OrbitContent isOpen={true} mobile={true} />
            </motion.div>
          )}
          {selected === 'retina' && (
            <motion.div
              key="retina"
              className="w-full h-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RetinaContent isOpen={true} mobile={true} />
            </motion.div>
          )}
          {selected === 'listval' && (
            <motion.div
              key="listval"
              className="w-full h-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ListvalContent isOpen={true} mobile={true} />
            </motion.div>
          )}
          {!selected && (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg text-white/60 mb-1">BlendPixel: Software for modern workflows</p>
              <p className="text-lg text-white/60">Tap a folder to explore</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Folders at bottom - fixed height, never resizes */}
      <div className="flex-shrink-0 pt-4 pb-4 px-4">
        <div className="flex justify-center gap-6">
          <Folder
            color="#5AC8FA"
            size={1}
            open={selected === 'orbit'}
            onToggle={() => handleToggle('orbit')}
            label="Orbit"
            icon={<img src="/orbit-logo.svg" alt="" />}
            items={orbitFolderItems}
          />
          <Folder
            color="#5AC8FA"
            size={1}
            open={selected === 'retina'}
            onToggle={() => handleToggle('retina')}
            label="Retina"
            icon={<picture><source srcSet="/retina-logo.webp" type="image/webp" /><img src="/retina-logo.png" alt="" className="rounded-[22%]" /></picture>}
            items={retinaFolderItems}
          />
          <Folder
            color="#5AC8FA"
            size={1}
            open={selected === 'listval'}
            onToggle={() => handleToggle('listval')}
            label="Listval"
            icon={<picture><source srcSet="/listval-logo.webp" type="image/webp" /><img src="/listval-logo.png" alt="" className="rounded-[22%]" /></picture>}
            items={listvalFolderItems}
          />
        </div>
      </div>

      {/* Footer - flows naturally below folders */}
      <div className="flex-shrink-0 pb-4 text-center">
        <p className="text-white/60 text-sm">© {copyrightYear} BlendPixel</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden h-dvh">
        <MobileHome />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        <OrbitCard />
        <div className="w-px bg-white/20" />
        <RetinaCard />
        <div className="w-px bg-white/20" />
        <ListvalCard />
        <div className="absolute bottom-4 left-0 right-0 text-center z-20">
          <p className="text-white/60 text-sm">© {copyrightYear} BlendPixel</p>
        </div>
      </div>
    </>
  );
}
