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
  lastUpdateTime: string;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

// Realistic solar generation curve (0-1 scale, peak at noon)
function getSolarCurve(hour: number): number {
  const curve: Record<number, number> = {
    0: 0.00, 1: 0.00, 2: 0.00, 3: 0.00, 4: 0.00, 5: 0.00,
    6: 0.05, 7: 0.15, 8: 0.35, 9: 0.55, 10: 0.75,
    11: 0.90, 12: 1.00, 13: 0.95, 14: 0.85, 15: 0.70,
    16: 0.50, 17: 0.30, 18: 0.10, 19: 0.02, 20: 0.00,
    21: 0.00, 22: 0.00, 23: 0.00,
  };
  return curve[hour] ?? 0;
}

// Time-of-day consumption patterns (varies by hour)
function getConsumptionPattern(hour: number): number {
  // Morning peak (6-9am), afternoon dip (10am-3pm), evening peak (5-9pm), night low (10pm-5am)
  const pattern: Record<number, number> = {
    0: 0.3, 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.3,
    6: 0.7, 7: 0.9, 8: 0.95, 9: 0.85, 10: 0.6,
    11: 0.5, 12: 0.55, 13: 0.5, 14: 0.5, 15: 0.55,
    16: 0.7, 17: 0.95, 18: 1.0, 19: 0.95, 20: 0.85,
    21: 0.7, 22: 0.5, 23: 0.4,
  };
  return pattern[hour] ?? 0.5;
}

// Energy simulation utilities
function simulateSolarGeneration(capacityKwp: number, hour: number): number {
  const factor = getSolarCurve(hour);
  // Add realistic cloud cover variation (±15%)
  const cloudCover = 0.85 + Math.random() * 0.3;
  const generation = capacityKwp * factor * cloudCover;
  return parseFloat(generation.toFixed(2));
}

function simulateConsumption(accountType: string = 'high_usage_home', hour: number): number {
  const baseRates: Record<string, number> = {
    shoplet: 2.5,
    high_usage_home: 1.8,
    ev_home: 2.2,
    office: 2.0,
    clinic: 1.5,
    cafe: 1.2,
    laundromat: 3.0,
  };
  const baseRate = baseRates[accountType] ?? 1.5;
  const pattern = getConsumptionPattern(hour);
  // Combine base rate with time-of-day pattern and random variation (±10%)
  const consumption = baseRate * pattern * (0.9 + Math.random() * 0.2);
  return parseFloat(consumption.toFixed(2));
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

function getFormattedTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(5);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [platformInventory, setPlatformInventory] = useState(45);
  const [lastUpdateTime, setLastUpdateTime] = useState(getFormattedTime());

  const startSimulation = useCallback(() => {
    setSimulationRunning(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setSimulationRunning(false);
  }, []);

  // Simulation loop - runs every 5 seconds for smooth real-time updates
  useEffect(() => {
    if (!simulationRunning) return;

    // Initial update
    const hour = new Date().getHours();
    setCurrentGeneration(simulateSolarGeneration(5.5, hour));
    setCurrentConsumption(simulateConsumption('high_usage_home', hour));
    setLastUpdateTime(getFormattedTime());

    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();

      // Update generation and consumption based on current hour
      const generation = simulateSolarGeneration(5.5, hour);
      const consumption = simulateConsumption('high_usage_home', hour);

      setCurrentGeneration(generation);
      setCurrentConsumption(consumption);
      setLastUpdateTime(getFormattedTime());

      // Update battery level
      setBatteryLevel(prev => updateBatteryLevel(prev, generation, consumption, 10));

      // Update platform inventory with realistic supply/demand dynamics
      setPlatformInventory(prev => {
        // Inventory increases when supply > demand, decreases otherwise
        const supplyDemandDiff = generation - consumption;
        const inventoryChange = supplyDemandDiff * 0.5 + (Math.random() - 0.5) * 2;
        return Math.max(0, Math.min(100, prev + inventoryChange));
      });
    }, 5000); // Update every 5 seconds

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
        lastUpdateTime,
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
