import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    landSize: '',
    farmingType: 'open_field',
    preferredCrops: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('farmerProfile', JSON.stringify(formData));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green-800 mb-2 text-center">Setup Profile</h2>
        <p className="text-gray-500 text-center mb-6">Tell us about your farm (One-time)</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (State/District)</label>
            <input
              required
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Kedah"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (Acres)</label>
            <input
              required
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., 2.5"
              value={formData.landSize}
              onChange={e => setFormData({...formData, landSize: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Farming</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.farmingType}
              onChange={e => setFormData({...formData, farmingType: e.target.value})}
            >
              <option value="open_field">Open Field</option>
              <option value="greenhouse">Greenhouse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Crops (Optional)</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Chili, Corn"
              value={formData.preferredCrops}
              onChange={e => setFormData({...formData, preferredCrops: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md mt-4 transition-colors"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
