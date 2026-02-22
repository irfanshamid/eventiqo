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
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EventData {
  name: string;
  clientName: string;
  date: string;
  location: string;
  totalBudget: string;
}

interface Template {
  id: string;
  title: string;
  category: string;
  content: string | null;
}

interface DraftRabItem {
  id: string;
  category: string;
  item: string;
  qty: number;
  qtyType: string;
  frequency: number;
  frequencyType: string;
  unitPriceRab: number;
  totalPriceRab: number;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  contactInfo: string | null;
}

interface EventDocumentListProps {
  templates: Template[];
  event: EventData;
  draftRabItems?: DraftRabItem[];
  vendors?: Vendor[];
}

export function EventDocumentList({
  templates,
  event,
  draftRabItems = [],
  vendors = [],
}: EventDocumentListProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [includeRAB, setIncludeRAB] = useState(false);
  const [includeVendors, setIncludeVendors] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const initiateDownload = (template: Template) => {
    setSelectedTemplate(template);
    setIncludeRAB(false);
    setIncludeVendors(false);
    setDialogOpen(true);
  };

  const generateRABTable = () => {
    if (!draftRabItems.length) return '';

    const groupedItems = draftRabItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, DraftRabItem[]>,
    );

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(val);

    let html = `
      <div class="page-break"></div>
      <h2>Rancangan Anggaran Biaya (RAB)</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px;">Item</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Qty</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Freq</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Price</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    let grandTotal = 0;

    for (const [category, items] of Object.entries(groupedItems)) {
      html += `
        <tr style="background-color: #e5e7eb;">
          <td colspan="5" style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">${category}</td>
        </tr>
      `;
      let subTotal = 0;
      items.forEach((item) => {
        subTotal += item.totalPriceRab;
        html += `
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 8px;">${item.item}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${item.qty} ${item.qtyType}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${item.frequency} ${item.frequencyType}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(item.unitPriceRab)}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(item.totalPriceRab)}</td>
          </tr>
        `;
      });
      grandTotal += subTotal;
      html += `
        <tr style="font-weight: bold; background-color: #f9fafb;">
          <td colspan="4" style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Subtotal ${category}</td>
          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(subTotal)}</td>
        </tr>
      `;
    }

    html += `
        <tr style="font-weight: bold; font-size: 1.1em; background-color: #d1d5db;">
          <td colspan="4" style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Grand Total</td>
          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(grandTotal)}</td>
        </tr>
        </tbody>
      </table>
    `;

    return html;
  };

  const generateVendorList = () => {
    if (!vendors.length) return '';

    let html = `
      <div class="page-break"></div>
      <h2>List Vendor</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px;">Name</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Category</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Contact Info</th>
          </tr>
        </thead>
        <tbody>
    `;

    vendors.forEach((vendor) => {
      html += `
        <tr>
          <td style="border: 1px solid #d1d5db; padding: 8px;">${vendor.name}</td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">${vendor.category}</td>
          <td style="border: 1px solid #d1d5db; padding: 8px;">${vendor.contactInfo || '-'}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
    return html;
  };

  const processDownload = () => {
    if (!selectedTemplate) return;

    let content = selectedTemplate.content || 'No content available.';

    // Replace placeholders
    content = content.replace(/{{eventName}}/g, event.name);
    content = content.replace(/{{clientName}}/g, event.clientName);
    content = content.replace(/{{date}}/g, event.date);
    content = content.replace(/{{location}}/g, event.location);
    content = content.replace(/{{totalBudget}}/g, event.totalBudget);

    let attachments = '';
    // Append Attachments if selected
    if (includeRAB) {
      attachments += generateRABTable();
    }

    if (includeVendors) {
      attachments += generateVendorList();
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { margin: 2cm; }
                body { margin: 0; padding: 0; }
                .page-break { page-break-after: always; break-after: page; height: 0; visibility: hidden; }
                .print\\:hidden { display: none; }
              }
              
              .content { font-family: sans-serif; line-height: 1.6; color: #374151; }
              .content h1 { font-size: 2.25em; font-weight: 700; margin-bottom: 0.5em; margin-top: 1em; }
              .content h2 { font-size: 1.5em; font-weight: 600; margin-bottom: 0.5em; margin-top: 1em; }
              .content h3 { font-size: 1.25em; font-weight: 600; margin-bottom: 0.5em; margin-top: 1em; }
              .content p { margin-bottom: 1em; }
              .content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
              .content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
              .content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; color: #4b5563; font-style: italic; }
              
              .content table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
              .content th, .content td { border: 1px solid #e5e7eb; padding: 0.5em; text-align: left; }
              .content th { background-color: #f9fafb; font-weight: 600; }
              
              .header-info { margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
              .header-info p { margin: 0.25rem 0; }
            </style>
          </head>
          <body class="bg-white text-gray-900">
            <div class="max-w-4xl mx-auto p-8">
              
              <div class="header-info">
                 <p class="text-sm text-gray-500 mb-2">Dokumen ini dihasilkan secara otomatis oleh sistem Eventiqo.</p>
                 <p><strong>Acara:</strong> ${event.name}</p>
                 <p><strong>Client:</strong> ${event.clientName}</p>
                 <p><strong>Tanggal:</strong> ${event.date}</p>
                 <p><strong>Lokasi:</strong> ${event.location}</p>
              </div>

              <h1 class="text-3xl font-bold text-center mb-8">${selectedTemplate.title}</h1>
              <div class="content prose max-w-none">
                ${content}
              </div>
              <div class="content prose max-w-none">
                ${attachments}
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Available Documents</h3>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center h-24 text-gray-500"
                >
                  No templates available. Please add templates in the Documents
                  module.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      {template.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {template.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => initiateDownload(template)}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Options</DialogTitle>
            <DialogDescription>
              Choose additional attachments for your document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="rab-mode" className="flex flex-col space-y-1">
                <span>Include Draft RAB</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Attach the Budget Plan (Estimated prices only)
                </span>
              </Label>
              <Switch
                id="rab-mode"
                checked={includeRAB}
                onCheckedChange={setIncludeRAB}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="vendor-mode" className="flex flex-col space-y-1">
                <span>Include Vendor List</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Attach the list of vendors for this event
                </span>
              </Label>
              <Switch
                id="vendor-mode"
                checked={includeVendors}
                onCheckedChange={setIncludeVendors}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
