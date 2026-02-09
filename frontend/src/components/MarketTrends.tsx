import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface MarketData {
  trend: string;
  price_change: number;
  oversupply_risk: boolean;
}

interface MarketTrendsResponse {
  [crop: string]: MarketData;
}

const MarketTrends = () => {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<MarketTrendsResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get('/market-trends');
        setTrends(response.data);
      } catch (error) {
        console.error("Failed to fetch market trends", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-purple-600 p-4 text-white flex items-center shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="mr-4 hover:bg-purple-700 p-2 rounded-full transition">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Market Trends</h1>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <p className="text-gray-600 mb-6">Real-time price movements and supply alerts to help you time your harvest.</p>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading market data...</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(trends).map(([crop, data]) => (
              <div key={crop} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{crop}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     {data.trend === 'Rising' && <span className="text-green-600 text-sm font-medium flex items-center"><TrendingUp size={16} className="mr-1"/> Rising</span>}
                     {data.trend === 'Falling' && <span className="text-red-600 text-sm font-medium flex items-center"><TrendingDown size={16} className="mr-1"/> Falling</span>}
                     {data.trend === 'Stable' && <span className="text-gray-500 text-sm font-medium flex items-center"><Minus size={16} className="mr-1"/> Stable</span>}
                     
                     <span className="text-xs text-gray-400">
                       ({data.price_change > 0 ? '+' : ''}{(data.price_change * 100).toFixed(0)}%)
                     </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {data.oversupply_risk ? (
                     <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-red-100">
                       <AlertTriangle size={12} className="mr-1" /> Oversupply
                     </div>
                  ) : (
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                       Balanced
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrends;
