import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

export const InfiniteMovingCards = ({
  items = [],
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  renderItem
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-[scroll_var(--animation-duration,_40s)_var(--animation-direction,_forwards)_linear_infinite]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[320px] md:w-[400px] max-w-full relative rounded-3xl border border-neutral-800/90 flex-shrink-0 bg-neutral-900/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700/90 hover:bg-neutral-900 hover:-translate-y-1 shadow-2xl group flex flex-col justify-between cursor-pointer"
            key={item.title || item.name || idx}
          >
            {renderItem ? (
              renderItem(item, idx)
            ) : (
              <div className="space-y-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  {item.icon && (
                    <div className="w-10 h-10 rounded-xl bg-[#00a6e0]/15 border border-[#7bd0ff]/30 text-[#7bd0ff] flex items-center justify-center transition-all duration-300 group-hover:bg-[#00a6e0]/25 group-hover:border-[#7bd0ff]/50 group-hover:shadow-[0_0_16px_rgba(123,208,255,0.3)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                  )}
                  {item.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.14em] bg-[#131719] text-[#bec6e0] border border-[#272a2c]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-neutral-100">
                    {item.title || item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {item.description || item.quote}
                  </p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteMovingCards;
