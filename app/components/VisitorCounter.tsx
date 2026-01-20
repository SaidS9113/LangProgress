'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        console.log('Visitor count response:', data);
        setCount(data.count ?? 0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setCount(0);
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full">
        <Users className="w-4 h-4 text-sky-500" />
        <span className="text-sky-500 text-sm font-medium">...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full">
      <Users className="w-4 h-4 text-sky-500" />
      <span className="text-sky-500 text-sm font-medium">
        +{count} utilisateur{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
