import {
  Award,
  Calendar,
  Calculator,
  Coins,
  CreditCard,
  FileText,
  Home as HomeIcon,
  Percent,
  Receipt,
  Scale,
  Tag,
  TrendingUp,
  Clock
} from 'lucide-react';

export const calcIcons: Record<string, any> = {
  scientific: Calculator,
  graphing: TrendingUp,
  mortgage: HomeIcon,
  'reverse-mortgage': HomeIcon,
  loan: Percent,
  tax: FileText,
  interest: TrendingUp,
  payment: CreditCard,
  time: Clock,
  age: Calendar,
  'profit-margin': Scale,
  roi: Award,
  percentage: Percent,
  discount: Tag,
  tip: Coins,
  vat: Receipt
};