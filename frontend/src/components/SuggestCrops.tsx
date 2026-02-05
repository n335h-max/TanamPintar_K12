import { useState, useEffect } from 'react';
import api from '../api';
import { Camera, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CropRecommendation {
  crop_name: string;
  profit_per_ha: number;
  risk_factor: string;
  details: {
    min_temp: number;
    max_temp: number;
    base_price: number;
  };
}

const SuggestCrops = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    land_size: 1,
    planting_month: 'January',
    budget: 'medium' // New field
  });

  // Load profile data on mount
  useEffect(() => {
    const profile = localStorage.getItem('farmerProfile');
    if (profile) {
      const { location, landSize } = JSON.parse(profile);
      setFormData(prev => ({
        ...prev,
        location: location || '',
        land_size: Number(landSize) || 1
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/recommend', {
        location: formData.location,
        land_size: formData.land_size,
        planting_month: formData.planting_month
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const count = localStorage.getItem('tanamPintar_uploads');
    if (count) setUploadCount(parseInt(count));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImageAnalysis(null);
      setError('');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    if (uploadCount >= 5) {
      setShowPaywall(true);
      return;
    }

    setAnalyzingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('file', selectedImage);

    try {
      const response = await api.post('/analyze-land', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageAnalysis(response.data);
      
      const newCount = uploadCount + 1;
      setUploadCount(newCount);
      localStorage.setItem('tanamPintar_uploads', newCount.toString());

    } catch (err) {
      console.error(err);
      setError('Failed to analyze image.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 p-4 text-white flex items-center shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Suggest Crops</h1>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Planting Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Planting Month</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.planting_month}
                onChange={e => setFormData({...formData, planting_month: e.target.value})}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600">Budget Level</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Analyzing...' : 'Get Recommendations'}
            </button>
          </form>
        </div>

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-800">Top Recommendations</h2>
            {recommendations.map((crop, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{crop.crop_name}</h3>
                    <p className="text-sm text-gray-500">Est. Profit: RM {crop.profit_per_ha.toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    crop.risk_factor === 'Low' ? 'bg-green-100 text-green-700' : 
                    crop.risk_factor === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    Risk: {crop.risk_factor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Land Analysis Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">AI Land Analysis</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Upload a photo of your land for soil & crop analysis.</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>Free uploads remaining: <span className="font-bold text-blue-600">{5 - uploadCount}</span></span>
            </div>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-100 file:text-blue-700
                hover:file:bg-blue-200"
            />
          </div>

          {selectedImage && (
            <button
              onClick={handleAnalyzeImage}
              disabled={analyzingImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {analyzingImage ? 'Analyzing...' : 'Analyze Land'}
            </button>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {imageAnalysis && (
            <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 text-sm">
              <h3 className="font-bold text-gray-800 mb-2">Analysis Result</h3>
              <p><span className="font-semibold">Soil Type:</span> {imageAnalysis.soil_type}</p>
              <p><span className="font-semibold">Terrain:</span> {imageAnalysis.terrain}</p>
              <div className="mt-2">
                <span className="font-semibold">Suggested Crops:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {imageAnalysis.suggested_crops?.map((c: string, i: number) => (
                    <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{c}</span>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-gray-600 italic">"{imageAnalysis.analysis}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <Lock size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Limit Reached</h2>
            <p className="text-gray-600 mb-6">
              You've used your 5 free AI land analyses. Upgrade to <span className="font-bold text-green-700">TanamPintar+</span> to unlock unlimited access.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
              <p className="text-3xl font-bold text-green-700">RM 15<span className="text-sm font-normal text-gray-500">/month</span></p>
              <ul className="text-left text-sm mt-3 space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited AI Land Analysis</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Advanced Market Predictions</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority Support</li>
              </ul>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md">
              Upgrade Now
            </button>
            <button 
              onClick={() => setShowPaywall(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestCrops;
