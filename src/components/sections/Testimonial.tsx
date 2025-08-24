'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const testimonials = [
  {
    name: 'Anisha Kumari',
    feedback: 'The best fitness program I have ever joined! Highly recommend it to anyone serious about results.',
  },
  {
    name: 'Jane Smith',
    feedback: 'Amazing coaches, great environment, and visible results in just a few weeks!',
  },
  {
    name: 'k. Sidhaart',
    feedback: 'Their personalized training plans really helped me stay consistent and motivated.',
  },
  {
    name: 'Emily Brown',
    feedback: 'I love the energy and vibe here! My fitness journey has become enjoyable.',
  },
  {
    name: 'Michael White',
    feedback: 'Super effective training and a very supportive community. Worth every penny!',
  },
  {
    name: 'Chirag R.',
    feedback: 'Professional staff and flexible timing slots helped me fit workouts into my routine.',
  },
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
          What Our Members Say
        </h2>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
  <div className="bg-black/50 backdrop-blur-md text-white rounded-2xl shadow-lg p-6 min-h-[220px] h-full flex flex-col justify-between transition-transform duration-300 transform hover:scale-[1.02]">
    <p className="text-lg italic text-center pt-5 mb-4 leading-relaxed">
      {testimonial.feedback}
    </p>
    <p className="text-sm font-semibold text-center pb-2 text-yellow-200 mt-auto">
      - {testimonial.name}
    </p>
  </div>
</SwiperSlide>

          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
