export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'discover',  icon: '🐾', label: 'Discover' },
    { id: 'matches',   icon: '❤️',  label: 'Matches' },
    { id: 'mypet',     icon: '🏠', label: 'My Pet' },
    { id: 'community', icon: '👥', label: 'Community' },
    { id: 'map',       icon: '🗺️', label: 'Map' },
    { id: 'health',    icon: '🏥', label: 'Health' },
    { id: 'profile',   icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] safe-area-bottom">
      <div className="flex">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all duration-200 ${
                isActive ? 'text-[#FF6B35]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#FF6B35] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
