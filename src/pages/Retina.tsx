import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import RetinaDemo from '../components/RetinaDemo';

// =============================================================================
// CONSTANTS
// =============================================================================

// Animation timing constants (in seconds)
const TIMING = {
  contentFade: 0.35,      // Content fade out duration
  logoTransform: 0.5,     // Logo transform duration (spring-based, this is approximate)
  contentEnter: 0.4,      // Content fade in duration
} as const;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Animation State Machine
 *
 * Flow for opening info panel:
 *   idle → content-exiting → logo-transforming-to-info → info-entering → info-idle
 *
 * Flow for closing info panel:
 *   info-idle → info-exiting → logo-transforming-to-default → content-entering → idle
 */
type AnimationState =
  | 'idle'                        // Default view, stable
  | 'content-exiting'             // Default content fading out
  | 'logo-transforming-to-info'   // Logo scaling down + moving up
  | 'info-entering'               // Info content fading in
  | 'info-idle'                   // Info panel view, stable
  | 'info-exiting'                // Info content fading out
  | 'logo-transforming-to-default' // Logo scaling up + moving down
  | 'content-entering';           // Default content fading in

// =============================================================================
// COMPONENTS
// =============================================================================

// FAQ Accordion Item with Apple-style physics
const FaqItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer text-black min-[700px]:text-gray-700 hover:text-black transition-colors text-[15px] w-full text-left"
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 200,
          }}
          className="text-gray-400 text-lg"
        >
          ›
        </motion.span>
        {question}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, height: 'auto', y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, y: -12, scale: 0.96 }}
            transition={{
              type: 'spring',
              damping: 16,
              stiffness: 300,
              mass: 0.6,
            }}
            className="overflow-hidden"
          >
            <p className="text-black min-[700px]:text-gray-500 text-sm mt-2 ml-5 leading-relaxed pb-1">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Retina() {
  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollableWrapperRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [contentFaded, setContentFaded] = useState(false);
  const [showInfoParagraph, setShowInfoParagraph] = useState(false);
  const [infoClosing, setInfoClosing] = useState(false);
  const [logoTargetY, setLogoTargetY] = useState(-120); // Default fallback
  const [paragraphsTargetTop, setParagraphsTargetTop] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // Derived State
  // ---------------------------------------------------------------------------

  // Whether we're currently animating (to disable buttons)
  const isAnimating = ![
    'idle',
    'info-idle',
  ].includes(animationState);

  // Content visibility states
  const showDefaultContent = true;
  const showInfoContent = false;

  // ---------------------------------------------------------------------------
  // State Machine Transitions
  // ---------------------------------------------------------------------------

  const handleLearnMoreClick = useCallback(() => {
    if (animationState !== 'idle') return;

    // Calculate the y offset needed to position logo at target distance from viewport top
    const LOGO_TARGET_TOP = 40; // pixels from top of viewport
    const LOGO_SCALE = 0.65;
    const GAP_BELOW_LOGO = 48; // gap between logo and paragraphs

    if (logoRef.current && scrollableWrapperRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect();
      const wrapperRect = scrollableWrapperRef.current.getBoundingClientRect();
      const offsetY = -(logoRect.top - LOGO_TARGET_TOP);
      setLogoTargetY(offsetY);

      // Calculate paragraphs position relative to logo's final position
      // Logo final bottom = LOGO_TARGET_TOP + (logo height * scale)
      const scaledLogoHeight = logoRect.height * LOGO_SCALE;
      const paragraphsViewportTop = LOGO_TARGET_TOP + scaledLogoHeight + GAP_BELOW_LOGO;

      // Convert to position within the scrollable container
      const paragraphsTop = paragraphsViewportTop - wrapperRect.top;
      setParagraphsTargetTop(paragraphsTop);
    }

    // Trigger all animations simultaneously
    setAnimationState('logo-transforming-to-info');
    setContentFaded(true);
    setShowInfoParagraph(true);
  }, [animationState]);

  const handleBackClick = useCallback(() => {
    if (animationState !== 'info-idle') return;
    setAnimationState('info-exiting');
  }, [animationState]);

  // Called when default content finishes exiting
  const onDefaultContentExitComplete = useCallback(() => {
    if (animationState === 'content-exiting') {
      setAnimationState('logo-transforming-to-info');
    }
  }, [animationState]);

  // Called when info content finishes entering
  const onInfoContentEnterComplete = useCallback(() => {
    if (animationState === 'info-entering') {
      setAnimationState('info-idle');
    }
  }, [animationState]);

  // Called when info content finishes exiting
  const onInfoContentExitComplete = useCallback(() => {
    if (animationState === 'info-exiting') {
      setAnimationState('logo-transforming-to-default');
    }
  }, [animationState]);

  // Called when logo finishes transforming to default position
  const onLogoTransformToDefaultComplete = useCallback(() => {
    if (animationState === 'logo-transforming-to-default') {
      setAnimationState('content-entering');
    }
  }, [animationState]);

  // Called when default content finishes entering
  const onDefaultContentEnterComplete = useCallback(() => {
    if (animationState === 'content-entering') {
      setAnimationState('idle');
    }
  }, [animationState]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Animation Variants
  // ---------------------------------------------------------------------------

  // Logo transformation variants
  const logoVariants = {
    default: {
      scale: 1,
      y: 0,
    },
    info: {
      scale: 0.65,
      y: logoTargetY,
    },
  };

  // Get current logo variant based on state
  const getLogoVariant = () => {
    // If closing info, return to default
    if (infoClosing) {
      return 'default';
    }

    switch (animationState) {
      case 'idle':
      case 'content-exiting':
      case 'content-entering':
        return 'default';
      case 'logo-transforming-to-info':
      case 'info-entering':
      case 'info-idle':
      case 'info-exiting':
      case 'logo-transforming-to-default':
        // Stay in info position until logo transform back completes
        return animationState === 'logo-transforming-to-default' ? 'default' : 'info';
      default:
        return 'default';
    }
  };

  // Default content animation variants
  const defaultContentVariants = {
    visible: {
      opacity: 1,
      y: 0,
    },
    exitingUp: {
      opacity: 0,
      y: -20,
    },
    enteringFromBelow: {
      opacity: 0,
      y: 20,
    },
  };

  // Get default content animation state
  const getDefaultContentAnimate = () => {
    switch (animationState) {
      case 'idle':
        return 'visible';
      case 'content-exiting':
        return 'exitingUp';
      case 'content-entering':
        return 'visible';
      default:
        return 'visible';
    }
  };

  const getDefaultContentInitial = () => {
    if (animationState === 'content-entering') {
      return 'enteringFromBelow';
    }
    return 'visible';
  };

  // Info content animation variants
  const infoContentVariants = {
    visible: {
      opacity: 1,
      y: 0,
    },
    exitingDown: {
      opacity: 0,
      y: 20,
    },
    enteringFromBelow: {
      opacity: 0,
      y: 20,
    },
  };

  // Get info content animation state
  const getInfoContentAnimate = () => {
    switch (animationState) {
      case 'info-idle':
        return 'visible';
      case 'info-entering':
        return 'visible';
      case 'info-exiting':
        return 'exitingDown';
      default:
        return 'visible';
    }
  };

  const getInfoContentInitial = () => {
    if (animationState === 'info-entering') {
      return 'enteringFromBelow';
    }
    return 'visible';
  };

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  const features = [
    {
      title: 'Cinematic zoom,',
      accent: 'smooth moves.',
      description: 'I asked myself, how would the most intuitive zoom work? After hundreds of iterations, the result feels effortless.',
    },
    {
      title: 'Cursor polish,',
      accent: 'professional paths.',
      description: 'Jittery mouse movements are distracting. Retina replaces them with smooth, professional paths automatically.',
    },
    {
      title: 'Smart export,',
      accent: '4K quality.',
      description: 'Export in stunning 4K quality with optimized file sizes. Your recordings deserve to look their best.',
    },
  ];

  return (
    <div className="min-h-screen min-[700px]:h-screen min-[700px]:overflow-hidden min-[700px]:min-w-[800px] bg-[#faf9f7] text-[#000] selection:bg-purple-500/20">
      {/* Main Layout */}
      <div className="flex flex-col min-[700px]:flex-row min-h-screen min-[700px]:h-screen">

        {/* Left Sidebar - Sticky on desktop with shadow, HIDDEN on mobile */}
        <aside className="hidden min-[700px]:flex min-[700px]:fixed min-[700px]:left-0 min-[700px]:top-0 min-[700px]:h-screen min-[700px]:w-[28%] min-[700px]:min-w-[340px] min-[700px]:max-w-[400px] flex-col bg-[#faf9f7] min-[700px]:shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)] z-10">

          {/* Scrollable content wrapper */}
          <div ref={scrollableWrapperRef} className="relative flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 min-[700px]:px-5 min-[700px]:py-10 pb-20 scrollbar-thin-overlay">

          {/* Close button - appears when content fades */}
          {contentFaded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: infoClosing ? 0 : 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setInfoClosing(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-20"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}

          {/* Logo - persists and transforms between states - HIDDEN on mobile */}
          <motion.div
            ref={logoRef}
            className="relative z-10 hidden min-[700px]:block"
            variants={logoVariants}
            animate={getLogoVariant()}
            transition={{
              type: 'spring',
              damping: 21,
              stiffness: 300,
              mass: 0.8,
            }}
            onAnimationComplete={() => {
              // Handle logo transform completion
              if (animationState === 'logo-transforming-to-default') {
                onLogoTransformToDefaultComplete();
              }

              // Handle close completion - reset all states
              if (infoClosing) {
                setShowInfoParagraph(false);
                setContentFaded(false);
                setInfoClosing(false);
                setAnimationState('idle');
              }
            }}
          >
            <div className="absolute -top-2 -left-1 px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-[13px] font-semibold rounded-full z-10 rotate-[-12deg] shadow-md">
              beta
            </div>
            <picture>
              <source srcSet="/retina-logo.webp" type="image/webp" />
              <img src="/retina-logo.png" alt="Retina" className="w-28 h-28 min-[700px]:w-32 min-[700px]:h-32 rounded-[28%] shadow-lg" />
            </picture>
            <div className="absolute -bottom-1 -right-1 px-2.5 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-[13px] font-semibold rounded-full shadow-md">
              0.92
            </div>
          </motion.div>

          {/* Default Content - conditionally rendered */}
          {showDefaultContent && (
            <motion.div
              key="default-content"
              variants={defaultContentVariants}
              initial={getDefaultContentInitial()}
              animate={getDefaultContentAnimate()}
              transition={{
                duration: animationState === 'content-exiting' ? TIMING.contentFade : TIMING.contentEnter,
                ease: animationState === 'content-exiting' ? 'easeIn' : 'easeOut',
              }}
              onAnimationComplete={() => {
                if (animationState === 'content-exiting') {
                  onDefaultContentExitComplete();
                } else if (animationState === 'content-entering') {
                  onDefaultContentEnterComplete();
                }
              }}
              className="flex flex-col items-center"
            >
              {/* All content fades together with scale and physics - HIDDEN on mobile */}
              <motion.div
                animate={(contentFaded && !infoClosing) ? { opacity: 0, scale: 0.95, y: -8 } : { opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 350,
                  mass: 0.5,
                }}
                className="hidden min-[700px]:flex flex-col items-center"
              >
                {/* Tagline */}
                <h2 className="text-[22px] min-[700px]:text-2xl font-bold text-center mt-6 mb-2 text-black leading-[1.2]">
                  A new way to
                  <br />
                  create perfect recordings
                </h2>

                {/* Learn More Link */}
                <button
                  onClick={handleLearnMoreClick}
                  disabled={isAnimating}
                  className="text-gray-400 hover:text-gray-600 transition-colors mb-8 flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Learn more <span className="text-lg">→</span>
                </button>

                {/* CTAs */}
                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                  <a
                    href="https://retina.blendpixel.com/0.92.0/Retina-Mac-arm64-0.92.0-Installer.dmg"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-full font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                  >
                    Download for Mac
                  </a>
                </div>
              </motion.div>

              {/* Footer - separate from animated content to avoid transform issues */}
              <motion.div
                animate={(contentFaded && !infoClosing) ? { opacity: 0 } : { opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 350,
                  mass: 0.5,
                }}
                className="hidden min-[700px]:block absolute bottom-6 left-0 right-0"
              >
                <div className="flex flex-col items-center gap-0.5 text-[13px] text-[#c0c0c0]">
                  <Link to="/products/retina/terms" className="hover:text-gray-500 transition-colors">
                    Terms and privacy
                  </Link>
                  <span>
                    Made by{' '}
                    <a href="https://blendpixel.com" className="hover:text-gray-500 transition-colors">
                      BlendPixel
                    </a>
                  </span>
                </div>
              </motion.div>

              {/* Info content container - all fades up together */}
              {showInfoParagraph && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={infoClosing
                    ? { opacity: 0, y: 30, scale: 0.97 }
                    : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 400,
                    mass: 0.5,
                  }}
                  className="absolute left-8 min-[700px]:left-5 right-8 min-[700px]:right-5 text-left"
                  style={{ top: paragraphsTargetTop !== null ? `${paragraphsTargetTop}px` : '28%' }}
                >
                  {/* First paragraph */}
                  <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                    Retina is currently in public beta. While most functionality is available,
                    I'm refining the app while listening to feedback from every user.
                  </p>

                  {/* Second section - "What exactly is Retina?" */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-black mb-3">
                      What exactly is Retina?
                    </h3>
                    <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                      Retina is a new type of screen recording tool. My motto is: the details
                      you don't see still matter. That's why the only focus of Retina
                      is making screen recordings effortless and beautiful.
                    </p>
                  </div>

                  {/* Third section - Beta Pass ticket card */}
                  <div
                    className="relative mb-6 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 min-w-[260px] max-w-[275px] mx-auto"
                    style={{ '--rainbow-spin-duration': '8s' } as React.CSSProperties}
                  >
                    {/* Glow layer - blurred rainbow shadow */}
                    <div className="absolute -inset-[6px] rounded-xl overflow-hidden blur-md opacity-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-[800px] h-[800px] flex-shrink-0 rounded-full animate-spin"
                          style={{
                            background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)',
                            animationDuration: 'var(--rainbow-spin-duration)',
                          }}
                        />
                      </div>
                    </div>
                    {/* Background layer - creates outline illusion */}
                    <div className="absolute -inset-[2px] rounded-xl overflow-hidden flex items-center justify-center">
                      {/* Rotating rainbow gradient circle */}
                      <div
                        className="w-[800px] h-[800px] flex-shrink-0 rounded-full animate-spin"
                        style={{
                          background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)',
                          animationDuration: 'var(--rainbow-spin-duration)',
                        }}
                      />
                    </div>
                    {/* Inner layer */}
                    <div className="relative rounded-[22px] bg-white p-4 shadow-[0_8px_32px_-8px_rgba(139,92,246,0.35)]">
                          <div className="flex items-center gap-4">
                            {/* Left content */}
                            <div className="flex-1">
                              {/* Header with icon */}
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-sm font-extrabold text-purple-500 tracking-tight leading-none">
                                  BETA PASS
                                </h4>
                                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M4 4l4 16 4-8 8-4-16-4zm8.5 8.5l-1.5 3-1.5-6 6 1.5-3 1.5z" />
                                </svg>
                              </div>

                              {/* Zigzag decoration */}
                              <div className="text-purple-300 text-[8px] tracking-[0.15em] mb-1.5 font-mono">
                                ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
                              </div>

                              {/* Checklist */}
                              <ul className="text-[11px] text-purple-400 space-y-0">
                                <li className="flex items-center gap-1">
                                  early access to beta <span className="text-purple-500">✓</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  help shape the tool <span className="text-purple-500">✓</span>
                                </li>
                              </ul>
                            </div>

                            {/* Right side - Logo badge */}
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-purple-200/40">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-inner">
                                <picture>
                                  <source srcSet="/retina-logo.webp" type="image/webp" />
                                  <img src="/retina-logo.png" alt="Retina" className="w-10 h-10 rounded-lg" />
                                </picture>
                              </div>
                            </div>
                          </div>
                    </div>
                  </div>

                  {/* Download section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-black mb-2">Download</h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                      Free beta with full access. macOS only for now.
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://retina.blendpixel.com/0.92.0/Retina-Mac-arm64-0.92.0-Installer.dmg"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Download for Mac (Apple Silicon)
                      </a>
                      <a
                        href="https://retina.blendpixel.com/0.92.0/Retina-Mac-x64-0.92.0-Installer.dmg"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Download for Mac (Intel)
                      </a>
                    </div>
                  </div>

                  {/* Fourth section - FAQ */}
                  <div className="pb-8">
                    <h3 className="text-lg font-bold text-black mb-4">FAQ</h3>
                    <div className="space-y-2">
                      <FaqItem
                        question="Who is behind Retina?"
                        answer={
                          <>
                            My name is Aza. I'm a product manager who designs and builds workflow products for modern work.
                            <br /><br />
                            I got tired of screen recordings looking boring. The default output never matched the quality of the work being shown. So I built Retina to close that gap. What started as a simple recorder turned into a full editor with AI graphics, physics-based cursors, and cinematic zoom effects.
                          </>
                        }
                      />
                      <FaqItem
                        question="Does Retina work on Windows?"
                        answer="I work on a Mac, so macOS came first. Windows is definitely on the roadmap though! The core of the editor itself is already 90% cross-platform (React/WebGL), just need to swap in a Windows capture library. If that's what you need, let me know — it helps me prioritize what to build next."
                      />
                      <FaqItem
                        question="Got more questions?"
                        answer={
                          <>
                            Reach out at{' '}
                            <a href="https://blendpixel.com" className="text-purple-500 hover:underline">
                              blendpixel.com
                            </a>
                          </>
                        }
                      />
                    </div>

                    {/* Footer-like content */}
                    <div className="flex flex-col items-center gap-0.5 text-[13px] text-[#c0c0c0] pt-40">
                      <Link to="/products/retina/terms" className="hover:text-gray-500 transition-colors">
                        Terms and privacy
                      </Link>
                      <span>
                        Made by{' '}
                        <a href="https://blendpixel.com" className="hover:text-gray-500 transition-colors">
                          BlendPixel
                        </a>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Info Content - conditionally rendered */}
          {showInfoContent && (
            <motion.div
              key="info-content"
              variants={infoContentVariants}
              initial={getInfoContentInitial()}
              animate={getInfoContentAnimate()}
              transition={{
                duration: animationState === 'info-exiting' ? TIMING.contentFade : TIMING.contentEnter,
                ease: animationState === 'info-exiting' ? 'easeIn' : 'easeOut',
              }}
              onAnimationComplete={() => {
                if (animationState === 'info-entering') {
                  onInfoContentEnterComplete();
                } else if (animationState === 'info-exiting') {
                  onInfoContentExitComplete();
                }
              }}
              className="flex flex-col w-full"
            >
              {/* Back button */}
              <button
                onClick={handleBackClick}
                disabled={isAnimating}
                className="text-gray-400 hover:text-gray-600 transition-colors mb-6 flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">←</span> back
              </button>

              {/* Info Content */}
              <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">
                Retina is currently in public beta. While most functionality is available,
                I'm refining the app while listening to feedback from every user.
              </p>

              <h3 className="text-xl font-bold text-black mb-3">
                What exactly is Retina?
              </h3>
              <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">
                Retina is a new type of screen recording tool. My motto is: the details
                you don't see still matter. That's why the only focus of Retina
                is making screen recordings effortless and beautiful.
              </p>

              {/* FAQ */}
              <h3 className="text-lg font-bold text-black mb-4">FAQ</h3>
              <div className="space-y-2">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black transition-colors text-[15px]">
                    <span className="text-gray-400 group-open:rotate-90 transition-transform text-lg">›</span>
                    Who is behind Retina?
                  </summary>
                  <p className="text-gray-500 text-sm mt-2 ml-5 leading-relaxed">
                    My name is Aza. I'm a product manager who designs and builds workflow products for modern work.
                    <br /><br />
                    I got tired of screen recordings looking boring. The default output never matched the quality of the work being shown. So I built Retina to close that gap. What started as a simple recorder turned into a full editor with AI graphics, physics-based cursors, and cinematic zoom effects.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black transition-colors text-[15px]">
                    <span className="text-gray-400 group-open:rotate-90 transition-transform text-lg">›</span>
                    Does Retina work on Windows?
                  </summary>
                  <p className="text-gray-500 text-sm mt-2 ml-5 leading-relaxed">
                    I work on a Mac, so macOS came first. Windows is definitely on the roadmap though! The core of the editor itself is already 90% cross-platform (React/WebGL), just need to swap in a Windows capture library. If that's what you need, let me know — it helps me prioritize what to build next.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black transition-colors text-[15px]">
                    <span className="text-gray-400 group-open:rotate-90 transition-transform text-lg">›</span>
                    Got more questions?
                  </summary>
                  <p className="text-gray-500 text-sm mt-2 ml-5 leading-relaxed">
                    Reach out at{' '}
                    <a href="https://blendpixel.com" className="text-purple-500 hover:underline">
                      blendpixel.com
                    </a>
                  </p>
                </details>
              </div>
            </motion.div>
          )}

          </div>
          {/* End scrollable content wrapper */}

        </aside>

        {/* Desktop gradient - fixed position, outside main to avoid overflow clipping */}
        <div className="hidden min-[700px]:block fixed top-0 bottom-0 left-[320px] right-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 via-blue-300/30 to-cyan-300/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-[700px]:ml-[max(28%,340px)] min-[700px]:min-w-0 relative min-[700px]:h-screen min-[700px]:overflow-y-auto scrollbar-thin-overlay">
          {/* Mobile gradient background */}
          <div className="min-[700px]:hidden absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-[700px] bg-gradient-to-br from-purple-300/40 via-blue-300/30 to-cyan-300/40" />
            <div className="absolute inset-x-0 top-0 h-[700px] bg-gradient-to-b from-transparent via-transparent to-white" />
            <div className="absolute inset-x-0 top-[700px] bottom-0 bg-white" />
          </div>

          {/* Hero Section */}
          <section className="relative z-10 pt-12 min-[700px]:pt-[22px] pb-6">
            <div className="w-full max-w-[900px] mx-auto px-3 min-[700px]:px-8 flex flex-col items-center" style={{ containerType: 'inline-size' }}>
              {/* Mobile Logo - only shown on mobile */}
              <div className="min-[700px]:hidden relative mb-6">
                <div className="absolute -top-2 -left-1 px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-[13px] font-semibold rounded-full z-10 rotate-[-12deg] shadow-md">
                  beta
                </div>
                <picture>
                  <source srcSet="/retina-logo.webp" type="image/webp" />
                  <img src="/retina-logo.png" alt="Retina" className="w-24 h-24 rounded-[28%] shadow-lg" />
                </picture>
                <div className="absolute -bottom-1 -right-1 px-2.5 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-[13px] font-semibold rounded-full shadow-md">
                  0.92
                </div>
              </div>

              {/* Headline - responsive, centered above video */}
              <h1 className="text-[clamp(1.25rem,5cqw,3.25rem)] font-bold mb-[22px] text-center leading-[1.2] min-[700px]:whitespace-nowrap w-full">
                Your screen recordings,{' '}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  auto-tuned.
                </span>
              </h1>

              {/* App Preview */}
              <div className="relative w-full">
                {/* Animated Demo Component */}
                <RetinaDemo />
              </div>

              {/* Feature Triptych - always 3 columns */}
              <div className="grid grid-cols-3 gap-2 min-[700px]:gap-12 mt-6 min-[700px]:mt-8 w-full">
                {features.map((feature, i) => (
                  <div key={i}>
                    <h3 className="text-[clamp(0.75rem,2vw,1.25rem)] font-bold text-black mb-0.5">
                      {feature.title}
                    </h3>
                    <h4 className="text-[clamp(0.75rem,2vw,1.25rem)] font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-1 min-[700px]:mb-2">
                      {feature.accent}
                    </h4>
                    <p className="text-black min-[700px]:text-gray-500 text-[clamp(0.65rem,1.5vw,0.875rem)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile Info Section - Inline content that's hidden behind button on desktop */}
          <section className="min-[700px]:hidden px-3 py-10 relative z-10">
            {/* Beta explanation */}
            <p className="text-black text-[15px] leading-relaxed mb-8">
              Retina is currently in public beta. While most functionality is available,
              I'm refining the app while listening to feedback from every user.
            </p>

            {/* What exactly is Retina? */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black mb-3">
                What exactly is Retina?
              </h3>
              <p className="text-black text-[15px] leading-relaxed mb-4">
                Retina is a new type of screen recording tool. My motto is: the details
                you don't see still matter. That's why the only focus of Retina
                is making screen recordings effortless and beautiful.
              </p>
            </div>

            {/* Beta Pass Card */}
            <div
              className="relative mb-8 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 max-w-[320px] mx-auto"
              style={{ '--rainbow-spin-duration': '8s' } as React.CSSProperties}
            >
              <div className="absolute -inset-[6px] rounded-[24px] overflow-hidden blur-md opacity-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-[800px] h-[800px] flex-shrink-0 rounded-full animate-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)',
                      animationDuration: 'var(--rainbow-spin-duration)',
                    }}
                  />
                </div>
              </div>
              <div className="absolute -inset-[2px] rounded-[24px] overflow-hidden flex items-center justify-center">
                <div
                  className="w-[800px] h-[800px] flex-shrink-0 rounded-full animate-spin"
                  style={{
                    background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)',
                    animationDuration: 'var(--rainbow-spin-duration)',
                  }}
                />
              </div>
              <div className="relative rounded-[22px] bg-white p-4 shadow-[0_8px_32px_-8px_rgba(139,92,246,0.35)]">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="text-sm font-extrabold text-purple-500 tracking-tight leading-none">
                        BETA PASS
                      </h4>
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4l4 16 4-8 8-4-16-4zm8.5 8.5l-1.5 3-1.5-6 6 1.5-3 1.5z" />
                      </svg>
                    </div>
                    <div className="text-purple-300 text-[8px] tracking-[0.15em] mb-1.5 font-mono">
                      ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
                    </div>
                    <ul className="text-[11px] text-purple-400 space-y-0">
                      <li className="flex items-center gap-1">
                        early access to beta <span className="text-purple-500">✓</span>
                      </li>
                      <li className="flex items-center gap-1">
                        help shape the tool <span className="text-purple-500">✓</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-purple-200/40">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-inner">
                      <picture>
                        <source srcSet="/retina-logo.webp" type="image/webp" />
                        <img src="/retina-logo.png" alt="Retina" className="w-10 h-10 rounded-lg" />
                      </picture>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-2">Download</h3>
              <p className="text-black text-[15px] leading-relaxed mb-4">
                Free beta with full access. macOS only for now.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://retina.blendpixel.com/0.92.0/Retina-Mac-arm64-0.92.0-Installer.dmg"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Download for Mac (Apple Silicon)
                </a>
                <a
                  href="https://retina.blendpixel.com/0.92.0/Retina-Mac-x64-0.92.0-Installer.dmg"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Download for Mac (Intel)
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">FAQ</h3>
              <div className="space-y-2">
                <FaqItem
                  question="Who is behind Retina?"
                  answer={
                    <>
                      My name is Aza. I'm a product manager who designs and builds workflow products for modern work.
                      <br /><br />
                      I got tired of screen recordings looking boring. The default output never matched the quality of the work being shown. So I built Retina to close that gap. What started as a simple recorder turned into a full editor with AI graphics, physics-based cursors, and cinematic zoom effects.
                    </>
                  }
                />
                <FaqItem
                  question="Does Retina work on Windows?"
                  answer="I work on a Mac, so macOS came first. Windows is definitely on the roadmap though! The core of the editor itself is already 90% cross-platform (React/WebGL), just need to swap in a Windows capture library. If that's what you need, let me know — it helps me prioritize what to build next."
                />
                <FaqItem
                  question="Got more questions?"
                  answer={
                    <>
                      Reach out at{' '}
                      <a href="https://blendpixel.com" className="text-purple-500 hover:underline">
                        blendpixel.com
                      </a>
                    </>
                  }
                />
              </div>
            </div>
          </section>

          {/* Mobile Footer */}
          <div className="min-[700px]:hidden flex flex-col items-center gap-1 text-[13px] text-[#c0c0c0] py-8 relative z-10">
            <Link to="/products/retina/terms" className="hover:text-gray-500 transition-colors">
              Terms and privacy
            </Link>
            <span>
              Made by{' '}
              <a href="https://blendpixel.com" className="hover:text-gray-500 transition-colors">
                BlendPixel
              </a>
            </span>
          </div>
        </main>
      </div>

    </div>
  );
}
