import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface EnergyContextType {
  currentGeneration: number;
  currentConsumption: number;
  batteryLevel: number;
  simulationRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  platformInventory: number;
  setPlatformInventory: (value: number) => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

// Energy simulation utilities
function simulateSolarGeneration(capacityKwp: number): number {
  const hour = new Date().getHours();
  const solarCurve: Record<number, number> = {
    6: 0.05, 7: 0.15, 8: 0.30, 9: 0.50, 10: 0.70,
    11: 0.85, 12: 1.00, 13: 0.95, 14: 0.85, 15: 0.70,
    16: 0.50, 17: 0.30, 18: 0.10, 19: 0.00,
    20: 0, 21: 0, 22: 0, 23: 0, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };
  const factor = solarCurve[hour] ?? 0;
  const jitter = 0.9 + Math.random() * 0.2;
  return parseFloat((capacityKwp * factor * jitter).toFixed(2));
}

function simulateConsumption(accountType: string = 'high_usage_home'): number {
  const baseRates: Record<string, number> = {
    shoplet: 2.5,
    high_usage_home: 1.8,
    ev_home: 2.2,
    office: 2.0,
    clinic: 1.5,
    cafe: 1.2,
    laundromat: 3.0,
  };
  const base = baseRates[accountType] ?? 1.5;
  return parseFloat((base + (Math.random() - 0.5) * 0.5).toFixed(2));
}

function updateBatteryLevel(
  currentLevel: number,
  generated: number,
  consumed: number,
  maxCapacity: number = 10
): number {
  const net = generated - consumed;
  const newLevel = Math.max(0, Math.min(maxCapacity, currentLevel + net));
  return parseFloat(newLevel.toFixed(2));
}

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(5);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [platformInventory, setPlatformInventory] = useState(45);

  const startSimulation = useCallback(() => {
    setSimulationRunning(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setSimulationRunning(false);
  }, []);

  // Simulation loop - runs every 30 seconds
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      setCurrentGeneration(simulateSolarGeneration(5.5));
      setCurrentConsumption(simulateConsumption('high_usage_home'));
      
      setBatteryLevel(prev => {
        const gen = simulateSolarGeneration(5.5);
        const cons = simulateConsumption('high_usage_home');
        return updateBatteryLevel(prev, gen, cons, 10);
      });

      // Simulate platform inventory changes
      setPlatformInventory(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [simulationRunning]);

  return (
    <EnergyContext.Provider
      value={{
        currentGeneration,
        currentConsumption,
        batteryLevel,
        simulationRunning,
        startSimulation,
        stopSimulation,
        platformInventory,
        setPlatformInventory,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within EnergyProvider');
  }
  return context;
}
