"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { deleteDraftRabItem } from "@/app/actions/draft-rab";
import { DraftRabDialog } from "./draft-rab-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

interface DraftRabItem {
  id: string;
  category: string;
  item: string;
  specification: string | null;
  qty: number;
  qtyType: string;
  frequency: number;
  frequencyType: string;
  unitPriceRab: number;
  totalPriceRab: number;
  unitPriceReal: number | null;
  totalPriceReal: number | null;
  remarks: string | null;
}

export function DraftRabList({ items, eventId }: { items: DraftRabItem[]; eventId: string }) {
  const [editingItem, setEditingItem] = useState<DraftRabItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DraftRabItem | null>(null);
  const { toast } = useToast();

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, DraftRabItem[]>);

  const handleDelete = async () => {
    if (deletingItem) {
        try {
            await deleteDraftRabItem(deletingItem.id, eventId);
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
        }
        setDeletingItem(null);
    }
  };

  const grandTotalRab = items.reduce((sum, item) => sum + item.totalPriceRab, 0);
  const grandTotalReal = items.reduce((sum, item) => sum + (item.totalPriceReal || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Draft RAB</h2>
        <DraftRabDialog eventId={eventId} />
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Specification</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Freq</TableHead>
              <TableHead>Price/Unit (RAB)</TableHead>
              <TableHead>Total Price (RAB)</TableHead>
              <TableHead>Price/Unit (Real)</TableHead>
              <TableHead>Total Price (Real)</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <>
                <TableRow key={category} className="bg-gray-100 hover:bg-gray-100">
                  <TableCell colSpan={11} className="font-bold">
                    {category}
                  </TableCell>
                </TableRow>
                {categoryItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.specification}</TableCell>
                    <TableCell>{item.qty} {item.qtyType}</TableCell>
                    <TableCell>{item.frequency} {item.frequencyType}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.unitPriceRab)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.totalPriceRab)}
                    </TableCell>
                    <TableCell>
                      {item.unitPriceReal ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.unitPriceReal) : "-"}
                    </TableCell>
                    <TableCell>
                      {item.totalPriceReal ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.totalPriceReal) : "-"}
                    </TableCell>
                    <TableCell>{item.remarks}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingItem(item)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingItem(item)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-semibold">
                    <TableCell colSpan={6} className="text-right">Subtotal {category}</TableCell>
                    <TableCell>
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(categoryItems.reduce((sum, i) => sum + i.totalPriceRab, 0))}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(categoryItems.reduce((sum, i) => sum + (i.totalPriceReal || 0), 0))}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                </TableRow>
              </>
            ))}
             <TableRow className="bg-gray-200 font-bold text-lg">
                <TableCell colSpan={6} className="text-right">Grand Total</TableCell>
                <TableCell>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(grandTotalRab)}
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(grandTotalReal)}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <DraftRabDialog
        eventId={eventId}
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
