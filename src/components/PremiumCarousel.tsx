"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import "./PremiumCarousel.css";
import { WebflowContext } from "../contexts/WebflowContext";
import { useRouter } from "next/navigation";

const PremiumCarousel = () => {
  const { data } = useContext(WebflowContext);
  const creators = data?.creators || [];

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>([]); // track loaded state

  const cardRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();
  useEffect(() => {
    setLoaded(creators.map(() => false)); // initialize loaded array
  }, [creators]);

  const handleVideoLoaded = (i: number) => {
    setLoaded((prev) => {
      const arr = [...prev];
      arr[i] = true;
      return arr;
    });
  };

  /** UPDATE CAROUSEL CLASSES */
  const updateCarousel = () => {
    const total = creators.length;
    if (total === 0) return;

    const active = index % total;
    const left1 = (index - 1 + total) % total;
    const right1 = (index + 1) % total;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      card.className = "card";

      if (i === active) card.classList.add("active");
      else if (i === left1) card.classList.add("left1");
      else if (i === right1) card.classList.add("right1");
      else card.classList.add("hidden");
    });

    // Play only active video
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  /** NAVIGATION */
  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((p) => (p + 1) % creators.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((p) => (p - 1 + creators.length) % creators.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (i: number) => {
    if (isAnimating || i === index) return;
    setIsAnimating(true);
    setIndex(i);
    setTimeout(() => setIsAnimating(false), 700);
  };

  /** UPDATE ON INDEX CHANGE */
  useEffect(() => {
    updateCarousel();
  }, [index, loaded]);

  if (creators.length === 0) return <div></div>;

  return (
    <div className="premium-carousel-container">
      <div className="heading">
        <h3>Book Media Celebrity For Brand Promotions</h3>
      </div>

      <div className="scene">
        {creators.map((creator, i) => (
         <div
  key={creator.id}
  ref={(el) => {
    if (el) cardRefs.current[i] = el;
  }}
  data-name={creator.name}
  className="card"
  onClick={() => router.push(`/influencer-page/${creator.id}`)}
  style={{ cursor: "pointer" }}
>
            {/* Lazy render only active + neighbors */}
            {(i === index ||
              i === (index - 1 + creators.length) % creators.length ||
              i === (index + 1) % creators.length) && (
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={`https://api.thegroome.com${creator.video_url}`}
                muted
                autoPlay={i === index} // only autoPlay active
                loop
                playsInline
                preload="metadata" // lighter than auto
                style={{ pointerEvents: "none", display: loaded[i] ? "block" : "none" }}
                onLoadedData={() => handleVideoLoaded(i)}
                onTimeUpdate={(e) => {
                  if (e.currentTarget.currentTime >= 3) e.currentTarget.currentTime = 0;
                }}
              />
            )}

            {/* Placeholder until video loads */}
            {!loaded[i] && (
              <div className="video-placeholder">
                <p>Loading video...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="controls">
        <button className="nav-btn" onClick={prev}>
          ‹
        </button>

        <div className="indicators">
          {creators.map((_, i) => (
            <button
              key={i}
              className={`indicator ${i === index ? "active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>

        <button className="nav-btn" onClick={next}>
          ›
        </button>
      </div>
    </div>
  );
};

export default PremiumCarousel;
