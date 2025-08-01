'use client';

import React from 'react';
import { Tabs, TabPanel } from '../../components/ui/tabs';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  return (
    <main className="min-h-screen bg-[#020817] text-white px-4 md:px-10 py-20">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 text-center"
      >
        User Dashboard
      </motion.h1>

      <Tabs className="max-w-6xl mx-auto">
        <TabPanel label="Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                Personal Information
              </h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> Gourav Das</p>
                <p><strong>Email:</strong> gourav@example.com</p>
                <p><strong>Phone:</strong> +91-9876543210</p>
                <p><strong>City:</strong> Rourkela</p>
              </div>
            </motion.div>

            {/* Physical Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                Physical Stats
              </h2>
              <div className="space-y-2">
                <p><strong>Height:</strong> 5&apos;9&quot;</p>
                <p><strong>Weight:</strong> 63 kg</p>
                <p><strong>Pull-Ups:</strong> 5 reps</p>
                <p><strong>Push-Ups:</strong> 15 × 3 sets</p>
                <p><strong>Squats:</strong> 25 × 4 sets</p>
              </div>
            </motion.div>
          </div>
        </TabPanel>

        <TabPanel label="Upcoming Bookings">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-md"
          >
            <p className="text-gray-400">No upcoming bookings available.</p>
          </motion.div>
        </TabPanel>

        <TabPanel label="History">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-md"
          >
            <p className="text-gray-400">No past booking history yet.</p>
          </motion.div>
        </TabPanel>
      </Tabs>
    </main>
  );
};

export default UserDashboard;
