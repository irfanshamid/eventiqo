"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createExpense } from "@/app/actions/expenses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Venue",
  "Catering",
  "Decoration",
  "Talent",
  "Production",
  "Documentation",
  "Fee EO",
  "Other"
];

export function ExpenseDialog({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    formData.append("eventId", eventId);
    await createExpense(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#1E88E5]">
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add a new expense item to the budget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">
                Category
              </Label>
              <div>
                <Select name="category" defaultValue={CATEGORIES[0]}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="estimatedAmount">
                Estimated Cost
              </Label>
              <Input
                id="estimatedAmount"
                name="estimatedAmount"
                type="number"
                defaultValue={0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="actualAmount">
                Actual Cost (Real)
              </Label>
              <Input
                id="actualAmount"
                name="actualAmount"
                type="number"
                defaultValue={0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">
                Status
              </Label>
              <div>
                <Select name="status" defaultValue="UNPAID">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
