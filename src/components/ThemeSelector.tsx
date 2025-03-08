import { useState, useEffect } from 'react';
import { Moon, Palette, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';
type ColorTheme = 'purple' | 'blue' | 'green' | 'pink' | 'orange';

const ThemeSelector = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });
  
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme;
    return savedColorTheme || 'purple';
  });
  
  const [showColors, setShowColors] = useState(false);
  
  useEffect(() => {
    // Apply theme to body
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // Remove all color themes first
    document.body.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-pink', 'theme-orange');
    
    // Apply new color theme
    document.body.classList.add(`theme-${colorTheme}`);
    
    // Save color theme preference
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const colors: {[key in ColorTheme]: string} = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    orange: 'bg-yellow-500'
  };
  
  return (
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      
      <div className="relative ml-2">
        <button
          onClick={() => setShowColors(!showColors)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Change color theme"
        >
          <Palette size={20} />
        </button>
        
        {showColors && (
          <div className="absolute right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border dark:border-gray-700">
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(colors).map(([name, colorClass]) => (
                <button
                  key={name}
                  onClick={() => {
                    setColorTheme(name as ColorTheme);
                    setShowColors(false);
                  }}
                  className={`w-6 h-6 rounded-full ${colorClass} ${
                    colorTheme === name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  aria-label={`${name} theme`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
