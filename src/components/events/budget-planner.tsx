"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableFooter
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExpenseDialog } from "@/components/events/budget/expense-dialog"
import { deleteExpense } from "@/app/actions/expenses"

interface Expense {
  id: string
  description: string
  estimatedAmount: number
  actualAmount: number
  category: string
  status: string
}

interface BudgetPlannerProps {
  eventId: string
  totalBudget: number
  targetMargin?: number
  expenses: Expense[]
}

export function BudgetPlanner({ eventId, totalBudget, targetMargin = 20, expenses }: BudgetPlannerProps) {
  // Calculations
  const totalEstimatedCost = expenses.reduce((acc, item) => acc + item.estimatedAmount, 0)
  const totalRealCost = expenses.reduce((acc, item) => acc + item.actualAmount, 0)
  
  const targetProfit = (totalBudget * targetMargin) / 100
  const maxBudget = totalBudget - targetProfit
  
  const currentProfit = totalBudget - totalRealCost
  const currentMargin = totalBudget > 0 ? (currentProfit / totalBudget) * 100 : 0
  
  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id, eventId);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Kontrak</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Profit ({targetMargin}%)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(targetProfit)}</div>
            <p className="text-xs text-muted-foreground">Min. Profit Goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real Cost Total</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", totalRealCost > maxBudget ? "text-red-600" : "text-blue-600")}>
              {formatCurrency(totalRealCost)}
            </div>
            <p className="text-xs text-muted-foreground">Total Expenses (Real)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real Profit (Current)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", currentMargin < targetMargin ? "text-yellow-600" : "text-green-600")}>
              {formatCurrency(currentProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Current Margin: {currentMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Breakdown</CardTitle>
            <ExpenseDialog eventId={eventId} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi Item</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead className="text-right">Real Cost</TableHead>
                <TableHead className="text-right">Diff</TableHead>
                <TableHead>Status Bayar</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                    No expenses recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((item) => {
                  const diff = item.estimatedAmount - item.actualAmount;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.estimatedAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.actualAmount)}</TableCell>
                      <TableCell className={cn("text-right", diff < 0 ? "text-red-500" : "text-green-500")}>
                        {formatCurrency(diff)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === "PAID" ? "default" : "secondary"}
                          className={
                            item.status === "PAID" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalEstimatedCost)}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalRealCost)}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalEstimatedCost - totalRealCost)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
