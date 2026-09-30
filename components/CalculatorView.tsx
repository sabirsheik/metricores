import { CalculatorSchema } from '@/types';
import CalculatorCard from './calculator/CalculatorCard';
import { calcIcons } from './calculator/calcIcons';

// Re-export calcIcons for backward compatibility with other files (HomeView, CalculatorsDirectory)
export { calcIcons };

interface CalculatorViewProps {
  calculator: CalculatorSchema;
  onBack: () => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function CalculatorView({ calculator, onBack, onNavigateToCalculator }: CalculatorViewProps) {
  return (
    <CalculatorCard
      calculator={calculator}
      onBack={onBack}
      onNavigateToCalculator={onNavigateToCalculator}
    />
  );
}
