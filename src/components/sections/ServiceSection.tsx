'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
}

const services: Service[] = [
  {
    id: 1,
    title: '🥊 Boxing Fitness',
    image: '/images/service1.jpg',
    description:
      'Unleash your inner fighter with our boxing workouts. Burn fat, build endurance, and boost confidence—no experience needed. Master techniques while transforming your body and spirit.',
  },
  {
    id: 2,
    title: '💪 Strength and Muscle Building',
    image: '/images/service2.jpg',
    description:
      'Build lean muscle and raw strength with tailored resistance workouts. Whether you are bulking or toning, our expert coaches assist in sculpting your body correctly — using progressive, science-backed training.',
  },
  {
    id: 3,
    title: '🧘 Hatha Yoga',
    image: '/images/service3.jpg',
    description:
      'Balance your body and mind with the classical art of Hatha Yoga. Improve flexibility, reduce stress, and gain inner strength through guided poses, breathwork, and deep relaxation techniques.',
  },
  {
    id: 4,
    title: '🛠️ Posture Correction & Rehab',
    image: '/images/service4.jpg',
    description:
      'Fix muscular imbalances and relieve chronic pain with targeted rehab and posture training. Ideal for desk workers, athletes, and anyone recovering from injuries — move better, live pain-free.',
  },
  {
    id: 5,
    title: '🤸 Calisthenics & Bodyweight Training',
    image: '/images/service5.jpg',
    description:
      'Train like an athlete using just your body. Master movements like push-ups, pull-ups, and handstands while building core strength, agility, and control — anywhere, anytime.',
  },
  {
    id: 6,
    title: '🍽️ Nutrition Consultancy',
    image: '/images/service6.jpg',
    description:
      'Fuel your fitness with customized meal plans and expert guidance. Whether your goal is fat loss, muscle gain, or balanced living, our coaches help you eat smart — without boring diets.',
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-black text-white px-4 py-16 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="w-full h-52 sm:h-56 md:h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-6 lg:p-7">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
