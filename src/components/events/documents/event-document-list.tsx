"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

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

interface EventDocumentListProps {
  templates: Template[];
  event: EventData;
}

export function EventDocumentList({ templates, event }: EventDocumentListProps) {
  const handleDownload = (template: Template) => {
    let content = template.content || "No content available.";
    
    // Replace placeholders
    content = content.replace(/{{eventName}}/g, event.name);
    content = content.replace(/{{clientName}}/g, event.clientName);
    content = content.replace(/{{date}}/g, event.date);
    content = content.replace(/{{location}}/g, event.location);
    content = content.replace(/{{totalBudget}}/g, event.totalBudget);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${template.title}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { text-align: center; margin-bottom: 40px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${template.title}</h1>
            <div class="content">${content}</div>
            <script>window.onload = function() { window.print(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
                <TableCell colSpan={3} className="text-center h-24 text-gray-500">
                  No templates available. Please add templates in the Documents module.
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
                      onClick={() => handleDownload(template)}
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
    </div>
  );
}
