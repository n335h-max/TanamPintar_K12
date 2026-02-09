import { useState, useEffect } from 'react';
import { ArrowLeft, CloudRain, Sun, Thermometer, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface ClimateData {
  rainfall: string;
  heat_risk: string;
  warnings: string[];
}

const ClimateRisk = () => {
  const navigate = useNavigate();
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClimate = async () => {
      try {
        const response = await api.get('/climate-risk');
        setClimate(response.data);
      } catch (error) {
        console.error("Failed to fetch climate data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClimate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-orange-500 p-4 text-white flex items-center shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="mr-4 hover:bg-orange-600 p-2 rounded-full transition">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Climate Risk</h1>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <p className="text-gray-600 mb-6">Seasonal forecasts to protect your crops from extreme weather.</p>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading climate forecast...</div>
        ) : climate ? (
          <div className="space-y-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <CloudRain size={24} />
                  <span className="font-semibold">Rainfall</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{climate.rainfall}</p>
                <p className="text-xs text-gray-500 mt-1">Expected volume</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Thermometer size={24} />
                  <span className="font-semibold">Heat Risk</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{climate.heat_risk}</p>
                <p className="text-xs text-gray-500 mt-1">Temperature stress</p>
              </div>
            </div>

            {/* Warnings Section */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <div className="flex items-center gap-2 text-red-700 mb-4">
                <AlertOctagon size={24} />
                <h3 className="text-lg font-bold">Active Warnings</h3>
              </div>
              <ul className="space-y-3">
                {climate.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span className="text-gray-700 font-medium text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advisory Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Sun className="text-blue-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> With high rainfall expected, ensure your drainage systems are clear. Consider raised beds for new plantings.
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center text-red-500">Failed to load data.</div>
        )}
      </div>
    </div>
  );
};

export default ClimateRisk;
