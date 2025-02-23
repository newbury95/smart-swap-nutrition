
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrackingData } from "./hooks/useTrackingData";
import { MeasurementForm } from "./components/MeasurementForm";
import { CurrentBMI } from "./components/CurrentBMI";
import { ProgressChart } from "./components/ProgressChart";

const TrackingPage = () => {
  const navigate = useNavigate();
  const {
    timeRange,
    setTimeRange,
    weight,
    setWeight,
    height,
    setHeight,
    trackingData,
    handleSubmit,
  } = useTrackingData();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 mb-8"
          >
            <MeasurementForm
              weight={weight}
              height={height}
              onWeightChange={setWeight}
              onHeightChange={setHeight}
              onSubmit={handleSubmit}
            />
            <CurrentBMI trackingData={trackingData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProgressChart
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              trackingData={trackingData}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;
