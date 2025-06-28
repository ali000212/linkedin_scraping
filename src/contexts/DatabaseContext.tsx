import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface DatabaseContextType {
  clearCache: () => Promise<void>;
  isCacheClearing: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCacheClearing, setIsCacheClearing] = useState(false);

  const clearCache = async () => {
    setIsCacheClearing(true);
    try {
      // Clear employee cache
      const { error: employeeError } = await supabase
        .from('employee_cache')
        .delete()
        .neq('id', '0'); // Delete all records
      
      if (employeeError) {
        throw new Error(`Error clearing employee cache: ${employeeError.message}`);
      }
      
      toast.success('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
    } finally {
      setIsCacheClearing(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{ clearCache, isCacheClearing }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}; 