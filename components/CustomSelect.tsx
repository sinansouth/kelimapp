
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = "Seçiniz", icon, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group options
  const groups: Record<string, Option[]> = {};
  const noGroupOptions: Option[] = [];

  options.forEach(opt => {
    if (opt.group) {
      if (!groups[opt.group]) groups[opt.group] = [];
      groups[opt.group].push(opt);
    } else {
      noGroupOptions.push(opt);
    }
  });

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center justify-between text-left ${isOpen ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className={`truncate ${selectedOption ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          {Object.entries(groups).map(([groupName, groupOptions]) => (
            <div key={groupName}>
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 tracking-wider sticky top-0">
                {groupName}
              </div>
              {groupOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between
                    ${option.value === value 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {option.label}
                  {option.value === value && <Check size={16} />}
                </button>
              ))}
            </div>
          ))}
          
          {noGroupOptions.map(option => (
             <button
                key={option.value}
                type="button"
                onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between
                ${option.value === value 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
                `}
            >
                {option.label}
                {option.value === value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
