'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Download } from 'lucide-react';
import { deleteDraftRabItem } from '@/app/actions/draft-rab';
import { DraftRabDialog } from './draft-rab-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx-js-style';

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

export function DraftRabList({
  items,
  eventId,
}: {
  items: DraftRabItem[];
  eventId: string;
}) {
  const [editingItem, setEditingItem] = useState<DraftRabItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DraftRabItem | null>(null);
  const { toast } = useToast();

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, DraftRabItem[]>,
  );

  const handleDelete = async () => {
    if (deletingItem) {
      try {
        await deleteDraftRabItem(deletingItem.id, eventId);
        toast({ title: 'Success', description: 'Item deleted successfully' });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete item',
          variant: 'destructive',
        });
      }
      setDeletingItem(null);
    }
  };

  const handleDownloadExcel = () => {
    // 1. Prepare Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = [];

    // Styling constants
    const headerStyle = {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "D3D3D3" } }, // Light Gray
      alignment: { horizontal: "center" }
    };

    const categoryStyle = {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "E0F7FA" } }, // Light Blue
    };

    const subtotalStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFF9C4" } }, // Light Yellow
    };

    const grandTotalStyle = {
      font: { bold: true, sz: 14 },
      fill: { fgColor: { rgb: "D3D3D3" } }, // Light Gray
    };

    // Helper to create cell with style
    const createCell = (value: any, style: any = {}) => {
      return { v: value, s: style };
    };

    // Header
    const headers = [
      'Category',
      'Item',
      'Specification',
      'Qty',
      'Unit',
      'Freq',
      'Freq Unit',
      'Price/Unit (RAB)',
      'Total Price (RAB)',
      'Price/Unit (Real)',
      'Total Price (Real)',
      'Remarks',
    ];
    data.push(headers.map(h => createCell(h, headerStyle)));

    // Rows
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      // Category Header Row
      const categoryRow = new Array(12).fill(createCell('', categoryStyle));
      categoryRow[0] = createCell(category.toUpperCase(), categoryStyle);
      data.push(categoryRow);

      let subTotalRab = 0;
      let subTotalReal = 0;

      categoryItems.forEach((item) => {
        subTotalRab += item.totalPriceRab;
        subTotalReal += item.totalPriceReal || 0;

        data.push([
          createCell(''), // Indent for item under category
          createCell(item.item),
          createCell(item.specification || ''),
          createCell(item.qty),
          createCell(item.qtyType),
          createCell(item.frequency),
          createCell(item.frequencyType),
          createCell(item.unitPriceRab, { numFmt: '#,##0' }),
          createCell(item.totalPriceRab, { numFmt: '#,##0' }),
          createCell(item.unitPriceReal || 0, { numFmt: '#,##0' }),
          createCell(item.totalPriceReal || 0, { numFmt: '#,##0' }),
          createCell(item.remarks || ''),
        ]);
      });

      // Subtotal Row
      const subtotalRow = new Array(12).fill(createCell('', subtotalStyle));
      subtotalRow[0] = createCell(`Subtotal ${category}`, subtotalStyle);
      subtotalRow[8] = createCell(subTotalRab, { ...subtotalStyle, numFmt: '#,##0' });
      subtotalRow[10] = createCell(subTotalReal, { ...subtotalStyle, numFmt: '#,##0' });
      data.push(subtotalRow);

      // Empty row for spacing
      data.push([]);
    });

    // Grand Total Row
    const grandTotalRab = items.reduce(
      (sum, item) => sum + item.totalPriceRab,
      0,
    );
    const grandTotalReal = items.reduce(
      (sum, item) => sum + (item.totalPriceReal || 0),
      0,
    );

    const grandTotalRow = new Array(12).fill(createCell('', grandTotalStyle));
    grandTotalRow[0] = createCell('GRAND TOTAL', grandTotalStyle);
    grandTotalRow[8] = createCell(grandTotalRab, { ...grandTotalStyle, numFmt: '#,##0' });
    grandTotalRow[10] = createCell(grandTotalReal, { ...grandTotalStyle, numFmt: '#,##0' });
    
    data.push(grandTotalRow);

    // 2. Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Category
      { wch: 25 }, // Item
      { wch: 25 }, // Specification
      { wch: 8 },  // Qty
      { wch: 8 },  // Unit
      { wch: 8 },  // Freq
      { wch: 8 },  // Freq Unit
      { wch: 15 }, // Price/Unit (RAB)
      { wch: 15 }, // Total Price (RAB)
      { wch: 15 }, // Price/Unit (Real)
      { wch: 15 }, // Total Price (Real)
      { wch: 20 }, // Remarks
    ];

    // 3. Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Draft RAB');

    // 4. Download
    XLSX.writeFile(
      wb,
      `Draft_RAB_${new Date().toISOString().split('T')[0]}.xlsx`,
    );
  };

  const grandTotalRab = items.reduce(
    (sum, item) => sum + item.totalPriceRab,
    0,
  );
  const grandTotalReal = items.reduce(
    (sum, item) => sum + (item.totalPriceReal || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Draft RAB</h2>
        <Button
          onClick={handleDownloadExcel}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Excel
        </Button>
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
                <TableRow
                  key={category}
                  className="bg-gray-100 hover:bg-gray-100"
                >
                  <TableCell colSpan={11} className="font-bold">
                    {category}
                  </TableCell>
                </TableRow>
                {categoryItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.specification}</TableCell>
                    <TableCell>
                      {item.qty} {item.qtyType}
                    </TableCell>
                    <TableCell>
                      {item.frequency} {item.frequencyType}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(item.unitPriceRab)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(item.totalPriceRab)}
                    </TableCell>
                    <TableCell>
                      {item.unitPriceReal
                        ? new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                          }).format(item.unitPriceReal)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {item.totalPriceReal
                        ? new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                          }).format(item.totalPriceReal)
                        : '-'}
                    </TableCell>
                    <TableCell>{item.remarks}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingItem(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-semibold">
                  <TableCell colSpan={6} className="text-right">
                    Subtotal {category}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(
                      categoryItems.reduce(
                        (sum, i) => sum + i.totalPriceRab,
                        0,
                      ),
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(
                      categoryItems.reduce(
                        (sum, i) => sum + (i.totalPriceReal || 0),
                        0,
                      ),
                    )}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </>
            ))}
            <TableRow className="bg-gray-200 font-bold text-lg">
              <TableCell colSpan={6} className="text-right">
                Grand Total
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(grandTotalRab)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(grandTotalReal)}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <DraftRabDialog eventId={eventId} />

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
