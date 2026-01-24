"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Dummy data
const influencer = {
  id: 1,
  name: "Shreya",
  description:
    "Lifestyle influencer sharing wellness, fashion, and mindful living.",
  price: "₹1,500",
};

const videos = [
  {
    id: 1,
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Morning Routine",
  },
  {
    id: 2,
    video_url: "https://www.w3schools.com/html/movie.mp4",
    title: "Skincare Ritual",
  },
  {
    id: 3,
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Outfit of the Day",
  },
];

export default function InfluencerPage() {
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 mb-24">
      {/* 🎥 Main Video */}
      <Card className="overflow-hidden rounded-3xl shadow-2xl bg-black">
        <div className="relative">
          <video
            key={activeVideo.id}
            src={activeVideo.video_url}
            controls
            autoPlay
            className="w-full aspect-video object-cover"
          />

          {/* subtle glass overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        </div>
      </Card>

      {/* 🎞 Premium Video Slider */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {videos.map((video) => {
          const isActive = activeVideo.id === video.id;

          return (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`group min-w-[160px] rounded-2xl overflow-hidden transition-all duration-300
                ${
                  isActive
                    ? "scale-105 ring-2 ring-blue-500/60 shadow-xl"
                    : "opacity-70 hover:opacity-100 hover:scale-[1.03]"
                }`}
            >
              <div className="relative">
                <video
                  src={video.video_url}
                  muted
                  className="h-28 w-full object-cover"
                />

                {/* play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition">
                  <Play className="text-white drop-shadow-md" />
                </div>
              </div>

              <div className="bg-background px-3 py-2">
                <p className="text-sm font-medium truncate">
                  {video.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 👤 Influencer Info */}
      <Card className="rounded-3xl shadow-xl border border-border/60">
        <CardContent className="space-y-6 pt-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {influencer.name}
            </h1>
            <p className="text-muted-foreground mt-2 leading-relaxed max-w-xl">
              {influencer.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking Price</p>
              <p className="text-2xl font-bold">{influencer.price}</p>
            </div>

            <Button
              size="lg"
              className="rounded-2xl px-8 py-6 text-lg font-semibold
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:from-blue-600 hover:to-indigo-700
              shadow-lg hover:shadow-xl transition-all"
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
