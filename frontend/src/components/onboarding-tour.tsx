import * as React from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = {
  title: string;
  description: string;
  targetId: string | null; // null means centered dialog
  fallbacks?: string[]; // fallback IDs in order if targetId is missing or hidden
};

const TOUR_STEPS: Step[] = [
  {
    title: "Welcome to Resume Builder Pro! 🚀",
    description:
      "Let's take a quick 1-minute interactive tour to show you around and help you build your perfect resume.",
    targetId: null,
  },
  {
    title: "Start Your Resume",
    description:
      "Click 'Create New Resume' to open our guided wizard, or 'Import Resume' to upload and optimize an existing PDF or Word file.",
    targetId: "tour-hero-actions",
  },
  {
    title: "Live Resume Templates",
    description:
      "Browse dozens of professional, recruiter-approved, and ATS-friendly templates. Click here to check the layouts library.",
    targetId: "tour-sidebar-templates",
    fallbacks: ["tour-mobile-templates"],
  },
  {
    title: "Real-time ATS Analytics",
    description:
      "See your resume count, total downloads, and your average Applicant Tracking System (ATS) score to keep track of your job search progress.",
    targetId: "tour-stats",
  },
  {
    title: "AI Career Copilot",
    description:
      "Match your resume against any Job Description! Our Copilot will instantly scan for keyword gaps and grade your compatibility.",
    targetId: "tour-copilot",
  },
  {
    title: "Complete Your Profile",
    description:
      "Fill out your profile once. The builder will automatically auto-populate details for new resumes and generate tailored suggestions.",
    targetId: "tour-profile",
    fallbacks: ["tour-sidebar-profile", "tour-mobile-profile"],
  },
  {
    title: "You're All Set! 🎉",
    description:
      "Start building or importing your resume, and explore our AI-powered templates and features anytime. Good luck with your job hunt!",
    targetId: null,
  },
];

type Props = {
  forceStart?: boolean;
  onTourStarted?: () => void;
};

export function OnboardingTour({ forceStart, onTourStarted }: Props) {
  const [active, setActive] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [spotlightRect, setSpotlightRect] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Check if tour should auto-start on fresh load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("rbp_onboarding_completed");
      if (!completed) {
        // Delay slightly for render stability
        const timer = setTimeout(() => {
          setActive(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen to forced start from parent (Quick Tour button)
  React.useEffect(() => {
    if (forceStart) {
      setActive(true);
      setStepIndex(0);
      onTourStarted?.();
    }
  }, [forceStart, onTourStarted]);

  // Handle step elements scan and auto-scroll
  React.useEffect(() => {
    if (!active) {
      setSpotlightRect(null);
      return;
    }

    const currentStep = TOUR_STEPS[stepIndex];
    if (!currentStep.targetId) {
      setSpotlightRect(null);
      return;
    }

    const isElementVisible = (el: HTMLElement) => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    };

    const idsToCheck = [currentStep.targetId, ...(currentStep.fallbacks || [])].filter(
      Boolean,
    ) as string[];
    let element: HTMLElement | null = null;

    for (const id of idsToCheck) {
      const el = document.getElementById(id);
      if (el && isElementVisible(el)) {
        element = el;
        break;
      }
    }

    if (!element) {
      // Element not found - skip this step and advance
      const isMovingForward = stepIndex > 0; // estimate direction
      if (isMovingForward && stepIndex < TOUR_STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
      } else if (!isMovingForward && stepIndex > 0) {
        setStepIndex(stepIndex - 1);
      } else {
        setActive(false); // fallback
      }
      return;
    }

    // Scroll element into view smoothly
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Wait a brief moment for scroll behavior to finish before measuring
    const updatePosition = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setSpotlightRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };

    const timer = setTimeout(updatePosition, 300);

    // Re-measure on resize or scroll
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [active, stepIndex]);

  if (!active) return null;

  const currentStep = TOUR_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("rbp_onboarding_completed", "true");
    setActive(false);
  };

  const handleComplete = () => {
    localStorage.setItem("rbp_onboarding_completed", "true");
    setActive(false);
  };

  // Card Positioning logic
  let cardStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "320px",
    maxWidth: "calc(100vw - 32px)",
    zIndex: 50,
  };
  let arrowClass = "";

  if (spotlightRect) {
    const viewportWidth = window.innerWidth;
    const cardWidth = 320;
    const cardHeight = 220; // Estimated max height

    // Determine vertical placement
    const fitsBelow =
      spotlightRect.top + spotlightRect.height + cardHeight + 20 <
      window.innerHeight + window.scrollY;

    // Determine horizontal position (center aligned to target, bounded by viewport)
    let leftPos = spotlightRect.left + (spotlightRect.width - cardWidth) / 2;
    leftPos = Math.max(16, Math.min(viewportWidth - cardWidth - 16, leftPos));

    if (viewportWidth < 640) {
      // Mobile specific placement: fixed bottom-sheet layout
      cardStyle = {
        position: "fixed",
        bottom: "80px",
        left: "16px",
        right: "16px",
        width: "auto",
        maxWidth: "calc(100vw - 32px)",
        margin: "0 auto",
        zIndex: 50,
      };
      arrowClass = ""; // No arrows needed for fixed bottom card
    } else if (spotlightRect.left < 100) {
      // Sidebar target - position on the right
      cardStyle = {
        position: "absolute",
        top: spotlightRect.top + (spotlightRect.height - 180) / 2,
        left: spotlightRect.left + spotlightRect.width + 16,
        width: cardWidth,
        zIndex: 50,
      };
      arrowClass = "tour-arrow-left";
    } else if (fitsBelow) {
      cardStyle = {
        position: "absolute",
        top: spotlightRect.top + spotlightRect.height + 16,
        left: leftPos,
        width: cardWidth,
        zIndex: 50,
      };
      arrowClass = "tour-arrow-top";
    } else {
      // Position above
      cardStyle = {
        position: "absolute",
        top: spotlightRect.top - cardHeight - 16,
        left: leftPos,
        width: cardWidth,
        zIndex: 50,
      };
      arrowClass = "tour-arrow-bottom";
    }
  }

  // Calculate dot count. We count non-welcome / non-celebration steps for the index.
  const visualSteps = TOUR_STEPS.filter((s) => s.targetId !== null);
  const visualCurrentIndex = stepIndex - 1;

  return (
    <>
      {/* Background Blocker - stops all click events on backend layout */}
      <div className="fixed inset-0 z-30 bg-transparent pointer-events-auto" />

      {/* Spotlight Overlay */}
      {spotlightRect ? (
        <div
          className="fixed rounded-xl pointer-events-none transition-all duration-300 z-40 border-2 border-brand/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{
            top: spotlightRect.top - window.scrollY - 4,
            left: spotlightRect.left - window.scrollX - 4,
            width: spotlightRect.width + 8,
            height: spotlightRect.height + 8,
          }}
        />
      ) : (
        // Full dim screen backdrop for welcome/celebration modals
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 pointer-events-auto" />
      )}

      {/* Tour Dialog Card */}
      <div
        className="bg-card text-card-foreground rounded-2xl border border-border p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={cardStyle}
      >
        {/* Tooltip Arrow */}
        {arrowClass && <div className={arrowClass} />}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {!spotlightRect && (
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand">
                <Sparkles className="h-4 w-4" />
              </span>
            )}
            <h3 className="font-extrabold text-sm text-foreground tracking-tight">
              {currentStep.title}
            </h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground rounded-lg p-0.5 transition-colors"
            title="Skip Tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
          {currentStep.description}
        </p>

        {/* Footer Controls */}
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
          {/* Progress Indicators */}
          {spotlightRect && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium text-muted-foreground">
                Step {visualCurrentIndex + 1} of {visualSteps.length}
              </span>
              <div className="flex items-center gap-1">
                {visualSteps.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      idx === visualCurrentIndex ? "bg-brand w-3" : "bg-muted-foreground/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dialog steps default to centering */}
          {!spotlightRect && <div className="flex-1" />}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            {spotlightRect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={isFirst}
                className="h-8 rounded-lg text-xs font-semibold text-muted-foreground"
              >
                <ChevronLeft className="mr-0.5 h-3.5 w-3.5" /> Back
              </Button>
            )}

            {!isFirst && !isLast && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 rounded-lg text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive-soft"
              >
                Skip
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleNext}
              className="h-8 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold px-3.5"
            >
              {isFirst ? (
                "Start Tour"
              ) : isLast ? (
                "Finish"
              ) : (
                <>
                  Next <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Styled Arrow CSS */}
      <style>{`
        .tour-arrow-top {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-left: 1px solid hsl(var(--border));
          border-top: 1px solid hsl(var(--border));
          z-index: -1;
        }
        .tour-arrow-bottom {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-right: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          z-index: -1;
        }
        .tour-arrow-left {
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-left: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          z-index: -1;
        }
      `}</style>
    </>
  );
}
