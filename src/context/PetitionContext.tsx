import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Petition } from '../services/supabase';

interface PetitionContextType {
  currentPetition: Petition | null;
  setCurrentPetition: (petition: Petition | null) => void;
}

const PetitionContext = createContext<PetitionContextType | undefined>(undefined);

export const PetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPetition, setCurrentPetition] = useState<Petition | null>(null);

  return (
    <PetitionContext.Provider value={{ currentPetition, setCurrentPetition }}>
      {children}
    </PetitionContext.Provider>
  );
};

export const usePetition = () => {
  const context = useContext(PetitionContext);
  if (context === undefined) {
    throw new Error('usePetition must be used within a PetitionProvider');
  }
  return context;
}; 