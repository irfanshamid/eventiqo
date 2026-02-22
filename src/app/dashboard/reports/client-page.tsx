"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, TrendingUp, Download } from 'lucide-react';
import {
  MonthlyRevenueChart,
  ProfitTrendChart,
  ExpenseBreakdownChart,
} from '@/components/reports/charts';
import { Button } from '@/components/ui/button';

interface ReportsClientPageProps {
  revenueChartData: { name: string; value: number }[];
  profitChartData: { name: string; value: number }[];
  expenseChartData: { name: string; value: number }[];
}

export default function ReportsClientPage({
  revenueChartData,
  profitChartData,
  expenseChartData,
}: ReportsClientPageProps) {
  
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Helper to format currency
    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val);

    // Calculate totals for summary
    const totalRevenue = revenueChartData.reduce((acc, curr) => acc + curr.value, 0);
    const totalProfit = profitChartData.reduce((acc, curr) => acc + curr.value, 0);
    const totalExpense = expenseChartData.reduce((acc, curr) => acc + curr.value, 0);

    // Generate table rows for monthly data
    const monthlyRows = revenueChartData.map((revItem, index) => {
        const profitItem = profitChartData[index] || { value: 0 };
        return `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${revItem.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(revItem.value)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(profitItem.value)}</td>
            </tr>
        `;
    }).join('');

    // Generate table rows for expense breakdown
    const expenseRows = expenseChartData.map(item => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(item.value)}</td>
        </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Financial Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1, h2 { text-align: center; color: #1F2937; }
            .summary-cards { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px; }
            .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; flex: 1; text-align: center; background: #f9fafb; }
            .card h3 { margin: 0 0 10px 0; font-size: 14px; color: #6b7280; }
            .card p { margin: 0; font-size: 24px; font-weight: bold; color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; text-align: left; font-weight: 600; }
            th, td { border: 1px solid #ddd; padding: 10px; }
            .section { margin-bottom: 40px; }
            @media print {
                button { display: none; }
                body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Financial Report</h1>
          <p style="text-align: center; color: #666; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>

          <div class="summary-cards">
            <div class="card">
                <h3>Total Revenue</h3>
                <p style="color: #2563eb;">${formatCurrency(totalRevenue)}</p>
            </div>
            <div class="card">
                <h3>Total Expenses</h3>
                <p style="color: #dc2626;">${formatCurrency(totalExpense)}</p>
            </div>
            <div class="card">
                <h3>Total Profit</h3>
                <p style="color: #16a34a;">${formatCurrency(totalProfit)}</p>
            </div>
          </div>

          <div class="section">
            <h2>Monthly Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th style="text-align: right;">Revenue</th>
                        <th style="text-align: right;">Profit</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthlyRows}
                </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Expense Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenseRows}
                </tbody>
            </table>
          </div>

          <script>
            window.onload = function() {
                window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Reports & Analytics
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportPDF}
            className="bg-[#1E88E5] hover:bg-[#1565C0]"
          >
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expense Breakdown
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ExpenseBreakdownChart data={expenseChartData} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-1 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Trend</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ProfitTrendChart data={profitChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Key Insights</h2>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            Top revenue month:{' '}
            <strong>
              {revenueChartData.sort((a, b) => b.value - a.value)[0]?.name ||
                'N/A'}
            </strong>
          </li>
          <li>
            Most expensive category:{' '}
            <strong>{expenseChartData[0]?.name || 'N/A'}</strong>
          </li>
          <li>
            Total Profit Year-to-Date:{' '}
            <strong>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(profitChartData.reduce((a, b) => a + b.value, 0))}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
