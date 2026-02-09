import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, CloudRain, FolderClock, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [farmerName] = useState('Farmer');

  useEffect(() => {
    // In a real app, we'd have a name. For now, just generic.
    const profile = localStorage.getItem('farmerProfile');
    if (!profile) {
      navigate('/setup');
    }
  }, [navigate]);

  const menuItems = [
    { 
      title: "Suggest Crops", 
      icon: <Search size={32} />, 
      path: "/suggest",
      color: "bg-blue-100 text-blue-600",
      desc: "Find best crops to plant"
    },
    { 
      title: "Market Trends", 
      icon: <TrendingUp size={32} />, 
      path: "/market",
      color: "bg-purple-100 text-purple-600",
      desc: "Track price changes"
    },
    { 
      title: "Climate Risk", 
      icon: <CloudRain size={32} />, 
      path: "/climate",
      color: "bg-orange-100 text-orange-600",
      desc: "Rainfall & heat alerts"
    },
    { 
      title: "My History", 
      icon: <FolderClock size={32} />, 
      path: "/history",
      color: "bg-gray-100 text-gray-600",
      desc: "Past recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold">Hello, {farmerName} 👋</h1>
            <p className="opacity-90 text-sm">Welcome back to CropWise</p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('farmerProfile');
              navigate('/');
            }}
            className="p-2 bg-green-700 rounded-full hover:bg-green-800 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 grid gap-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center text-left"
          >
            <div className={`p-4 rounded-xl ${item.color} mr-4`}>
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
