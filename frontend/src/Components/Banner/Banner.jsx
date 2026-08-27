import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";

import bannerImg1 from "../../assets/banner/banner1.jpg";
import bannerImg2 from "../../assets/banner/banner2.jpg";
import bannerImg3 from "../../assets/banner/banner3.jpg";
import bannerImg4 from "../../assets/banner/banner4.jpg";
import bannerImg5 from "../../assets/banner/banner5.jpg";
import bannerImg6 from "../../assets/banner/banner6.jpg";
import bannerImg7 from "../../assets/banner/banner7.jpg";
import bannerImg8 from "../../assets/banner/banner8.jpg";
import bannerImg9 from "../../assets/banner/banner9.jpg";
import bannerImg10 from "../../assets/banner/banner10.jpg";

const slides = [
  { img: bannerImg1, description: "Track Broken Streetlights", tag: "Infrastructure" },
  { img: bannerImg2, description: "Report Potholes Quickly", tag: "Road Safety" },
  { img: bannerImg3, description: "Submit Water Leakage Issues", tag: "Utilities" },
  { img: bannerImg4, description: "CityFIX Ensures Clean Streets", tag: "Sanitation" },
  { img: bannerImg5, description: "Monitor Damaged Footpaths", tag: "Infrastructure" },
  { img: bannerImg6, description: "Highlight Urgent Issues Easily", tag: "Priority" },
  { img: bannerImg7, description: "Staff Efficiently Assigned", tag: "Management" },
  { img: bannerImg8, description: "Follow Issue Timelines", tag: "Tracking" },
  { img: bannerImg9, description: "Receive Updates Instantly", tag: "Notifications" },
  { img: bannerImg10, description: "Make Your City Better", tag: "Community" },
];

const tagGradients = {
  Infrastructure: "from-primary to-primary-dark",
  "Road Safety": "from-secondary to-secondary-dark",
  Utilities: "from-info to-info-dark",
  Sanitation: "from-success to-success-dark",
  Priority: "from-accent to-accent-dark",
  Management: "from-info to-info-dark",
  Tracking: "from-primary to-primary-dark",
  Notifications: "from-accent to-accent-dark",
  Community: "from-success to-success-dark",
};

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pad = (n) => String(n + 1).padStart(2, "0");

  return (
    <div className="relative w-full select-none">
      <Carousel
        autoPlay
        interval={4500}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        swipeable
        emulateTouch
        transitionTime={600}
        onChange={(i) => setCurrentIndex(i)}
        renderArrowPrev={(clickHandler) => (
          <button
            onClick={clickHandler}
            className="
              absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20
              w-11 h-11 md:w-13 md:h-13 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center text-white
              hover:bg-white/25 hover:scale-110
              transition-all duration-300 cursor-pointer
            "
            aria-label="Previous slide"
          >
            <FiChevronLeft size={22} />
          </button>
        )}
        renderArrowNext={(clickHandler) => (
          <button
            onClick={clickHandler}
            className="
              absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20
              w-11 h-11 md:w-13 md:h-13 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center text-white
              hover:bg-white/25 hover:scale-110
              transition-all duration-300 cursor-pointer
            "
            aria-label="Next slide"
          >
            <FiChevronRight size={22} />
          </button>
        )}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[480px] md:h-[560px] lg:h-[620px] overflow-hidden">
            <img
              src={slide.img}
              alt={slide.description}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-40% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Text Content */}
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="w-full px-6 md:px-14 lg:px-20 pb-24 md:pb-0">
                <div className="max-w-2xl">
                  {/* Tag Badge */}
                  <span
                    className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${tagGradients[slide.tag]} text-white text-xs font-semibold tracking-wide uppercase mb-4`}
                  >
                    {slide.tag}
                  </span>

                  {/* Heading */}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                    {slide.description}
                  </h2>

                  {/* Slide Counter */}
                  <p className="text-white/50 text-sm font-mono mt-4 tracking-wider">
                    {pad(index)} <span className="text-white/20">—</span> {pad(slides.length - 1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Progress Bar Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-1 rounded-full transition-all duration-700 cursor-pointer ${
              i === currentIndex
                ? "w-10 bg-primary"
                : "w-4 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter — Desktop */}
      <div className="hidden md:block absolute bottom-6 right-10 z-20">
        <span className="text-white/60 text-sm font-mono tracking-widest">
          {pad(currentIndex)} / {pad(slides.length - 1)}
        </span>
      </div>

      {/* Action Buttons */}
      <div
        className="
          flex items-center gap-3 z-20
          absolute left-6 md:left-14 bottom-6 md:bottom-6
        "
      >
        <Link to="/dashboard/citizen/report-issue">
          <button className="group flex items-center gap-2.5 bg-primary text-white font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 cursor-pointer text-sm md:text-base">
            Report Issue
            <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white text-primary flex items-center justify-center group-hover:rotate-45 transition-transform">
              <FiArrowUpRight size={14} />
            </span>
          </button>
        </Link>

        <Link to="/all-issues">
          <button className="px-5 py-2.5 md:px-6 md:py-3 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer text-sm md:text-base">
            View All Issues
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
