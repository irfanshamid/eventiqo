'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraftRabItem {
  id: string;
  category: string;
  totalPriceRab: number;
  totalPriceReal: number | null;
}

interface BudgetPlannerProps {
  eventId: string;
  totalBudget: number;
  targetMargin?: number;
  draftRabItems: DraftRabItem[];
}

export function BudgetPlanner({
  eventId,
  totalBudget,
  targetMargin = 20,
  draftRabItems,
}: BudgetPlannerProps) {
  // Calculations based on Draft RAB
  const categoryStats = draftRabItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { estimated: 0, real: 0 };
    }
    acc[item.category].estimated += item.totalPriceRab;
    acc[item.category].real += (item.totalPriceReal || 0);
    return acc;
  }, {} as Record<string, { estimated: number; real: number }>);

  const totalEstimatedCost = Object.values(categoryStats).reduce(
    (acc, item) => acc + item.estimated,
    0,
  );
  const totalRealCost = Object.values(categoryStats).reduce(
    (acc, item) => acc + item.real,
    0,
  );

  const targetProfit = (totalBudget * targetMargin) / 100;
  const maxBudget = totalBudget - targetProfit;

  const currentProfit = totalBudget - totalRealCost;
  const currentMargin =
    totalBudget > 0 ? (currentProfit / totalBudget) * 100 : 0;

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Kontrak</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Target Profit ({targetMargin}%)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(targetProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Min. Profit Goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Real Cost Total
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                totalRealCost > maxBudget ? 'text-red-600' : 'text-blue-600',
              )}
            >
              {formatCurrency(totalRealCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Expenses (Real)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Real Profit (Current)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                currentMargin < targetMargin
                  ? 'text-yellow-600'
                  : 'text-green-600',
              )}
            >
              {formatCurrency(currentProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current Margin: {currentMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Breakdown (Derived from Draft RAB)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Est. Cost (RAB)</TableHead>
                <TableHead className="text-right">Real Cost</TableHead>
                <TableHead className="text-right">Diff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(categoryStats).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-gray-500"
                  >
                    No RAB items recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(categoryStats).map(([category, stats]) => {
                  const diff = stats.estimated - stats.real;
                  return (
                    <TableRow key={category}>
                      <TableCell>
                        <Badge variant="outline">{category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(stats.estimated)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(stats.real)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right',
                          diff < 0 ? 'text-red-500' : 'text-green-500',
                        )}
                      >
                        {formatCurrency(diff)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totalEstimatedCost)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totalRealCost)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totalEstimatedCost - totalRealCost)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
