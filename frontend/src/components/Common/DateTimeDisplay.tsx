import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Format time in BST (Bangladesh Standard Time - UTC+6) - 12 hour format
  const formatBSTTime = (date: Date) => {
    return date.toLocaleTimeString('en-BD', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true  // ← This makes it 12-hour format with AM/PM
    });
  };

  // Format date in BST
  const formatBSTDate = (date: Date) => {
    return date.toLocaleDateString('en-BD', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const time = formatBSTTime(currentTime);
  const date = formatBSTDate(currentTime);

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-blue-400" />
        <span className="text-white font-mono text-sm font-semibold tracking-wider">
          {time} BST
        </span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-emerald-400" />
        <span className="text-white/80 text-xs font-medium">
          {date}
        </span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;