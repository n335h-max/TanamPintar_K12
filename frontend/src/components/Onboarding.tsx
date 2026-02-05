import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-4 rounded-full shadow-xl mb-8 animate-bounce-slow">
        <Sprout size={64} className="text-green-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-green-800 mb-4">CropWise</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-xs mx-auto">
        "Plant the right crop at the right time."
      </p>

      <button
        onClick={() => navigate('/setup')}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transform transition hover:scale-105"
      >
        Start
      </button>
    </div>
  );
};

export default Onboarding;
