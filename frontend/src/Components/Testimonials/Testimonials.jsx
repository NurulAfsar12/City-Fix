import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaQuoteLeft, FaStar, FaCheckCircle } from "react-icons/fa";

const testimonials = [
  {
    name: "Zubair Ahmed",
    role: "Citizen",
    feedback:
      "CityFIX helped me report a broken streetlight, and it was fixed within 2 days!",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    verified: true,
  },
  {
    name: "Abuzar Giffari",
    role: "Citizen",
    feedback:
      "I love how easy it is to track the progress of my reported issues in real-time.",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    verified: true,
  },
  {
    name: "Ali Khan",
    role: "Staff",
    feedback:
      "Assigning and resolving issues is so much easier now with CityFIX!",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    verified: true,
  },
  {
    name: "Sara Rahman",
    role: "Citizen",
    feedback:
      "Boosting issue priority for urgent matters is very convenient and efficient.",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    verified: false,
  },
  {
    name: "Murshida Rahman",
    role: "Citizen",
    feedback:
      "The platform is user-friendly and makes reporting issues fast and easy.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    verified: true,
  },
  {
    name: "Rehana Begum",
    role: "Citizen",
    feedback:
      "CityFIX helped me stay informed about the status of local infrastructure problems.",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 5,
    verified: true,
  },
  {
    name: "Abdur Rahman Molla",
    role: "Staff",
    feedback:
      "Tracking and updating assigned tasks has never been easier. Great system!",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    verified: true,
  },
  {
    name: "Fatima Noor",
    role: "Citizen",
    feedback:
      "I reported a pothole near my street, and it got fixed in a week. Amazing service!",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    verified: false,
  },
  {
    name: "Rashed Khan",
    role: "Citizen",
    feedback:
      "The dashboard is very intuitive. I can see all my reported issues and their statuses.",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4,
    verified: true,
  },
  {
    name: "Laila Ahmed",
    role: "Citizen",
    feedback:
      "Boosting priority for urgent issues is extremely helpful during emergencies.",
    avatar: "https://i.pravatar.cc/150?img=10",
    rating: 5,
    verified: true,
  },
  {
    name: "Omar Faruk",
    role: "Staff",
    feedback:
      "Assigning issues to staff and updating progress is streamlined with CityFIX.",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    verified: true,
  },
  {
    name: "Nadim Haque",
    role: "Citizen",
    feedback:
      "I love the transparency. I can see exactly how my issues are being handled.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    verified: true,
  },
  {
    name: "Rehan Siddique",
    role: "Citizen",
    feedback:
      "The subscription feature for premium users is very convenient for frequent reporters.",
    avatar: "https://i.pravatar.cc/150?img=13",
    rating: 4,
    verified: false,
  },
  {
    name: "Hira Rayhan",
    role: "Citizen",
    feedback:
      "CityFIX encourages citizen engagement and improves our city services.",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 5,
    verified: true,
  },
  {
    name: "Mustafa Ali",
    role: "Staff",
    feedback:
      "I can manage all assigned issues efficiently. The timeline feature is extremely useful.",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    verified: true,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-secondary" : "text-base-content/10"}
          size={14}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            What Our Users Say
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Hear from citizens and staff who use CityFIX every day.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-base-100 p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-base-300 group hover:border-primary/30">
                {/* Top: Quote + Rating */}
                <div className="flex items-start justify-between mb-5">
                  <FaQuoteLeft className="text-primary/30 text-3xl group-hover:text-primary/50 transition-colors" />
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Feedback */}
                <p className="text-base-content/70 mb-6 flex-grow leading-relaxed">
                  "{testimonial.feedback}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-base-300/50">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-base-content flex items-center gap-1.5">
                      {testimonial.name}
                      {testimonial.verified && (
                        <FaCheckCircle className="text-info text-xs" title="Verified User" />
                      )}
                    </h3>
                    <p className="text-sm text-base-content/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
