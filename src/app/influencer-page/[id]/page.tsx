"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Play } from "lucide-react";

export default function InfluencerPage() {
  const { id } = useParams();

  const [influencer, setInfluencer] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.thegroome.com/influencer/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInfluencer(data);
        setActiveVideo(data.videos?.[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-24">Loading...</p>;
  if (!influencer)
    return <p className="text-center mt-24">Influencer not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-14 pb-32 space-y-20">
      {/* 🎬 HERO REEL */}
      {activeVideo && (
        <div className="flex justify-center">
          <div
            className="
              relative w-full max-w-[360px] h-[520px]
              rounded-[3rem] overflow-hidden bg-black
              shadow-[0_40px_120px_rgba(0,0,0,0.45)]
              animate-fade-in-premium
            "
          >
            <video
              key={activeVideo.id}
              src={`https://api.thegroome.com${activeVideo.video_url}`}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 p-6 text-white">
              <h1 className="text-lg font-medium tracking-tight">
                {influencer.name}
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-white/60 mt-1">
                Available for Brand Promotions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🎞 REEL PICKER */}
      <div className="flex justify-center gap-4 overflow-x-auto scrollbar-hide">
        {influencer.videos.map((video: any) => {
          const isActive = activeVideo?.id === video.id;

          return (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`
                relative min-w-[90px] h-[140px]
                rounded-2xl overflow-hidden transition-all duration-300
                ${
                  isActive
                    ? "scale-110 opacity-100 shadow-xl"
                    : "opacity-50 hover:opacity-80"
                }
              `}
            >
              <video
                src={`https://api.thegroome.com${video.video_url}`}
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />

              {!isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 💎 BOOKING CARD */}
      <Card className="max-w-md mx-auto rounded-3xl border-0 bg-white/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
        <CardContent className="px-10 py-10 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {influencer.name}
            </h2>
             <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-light tracking-tight text-white">
                  {influencer.name}
                </h2>
               
                  <a
                    href={influencer.instagram_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                    title="View Instagram Profile"
                  >
                    <Instagram size={18} className="mt-1" />
                  </a>
            
              </div>
            {/* About with Read More */}
            <div className="text-muted-foreground text-sm leading-relaxed">
              <p className={expanded ? "" : "line-clamp-3"}>
                {influencer.about_you}
              </p>

              {influencer.about_you?.length > 120 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-xs font-medium tracking-wide text-black/70 hover:text-black transition"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>

          {/* Price + CTA (Responsive) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Brand Promotion starts at
              </p>
              <p className="text-3xl font-semibold">
                ₹{influencer.booking_price}
              </p>
            </div>

            <Button
              size="lg"
              className="
                w-full sm:w-auto
                rounded-2xl px-10 py-6 text-base font-medium
                bg-black text-white
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]
                hover:bg-black/90 transition
              "
            >
              Request booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
