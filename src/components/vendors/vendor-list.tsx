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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { VendorDialog } from '@/components/vendors/vendor-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteVendor } from '@/app/actions/vendors';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Vendor {
  id: string;
  name: string;
  category: string;
  contactInfo: string | null;
  averageCost: number | null;
  events: { id: string }[];
  expenses: { id: string }[];
}

export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const router = useRouter();

  const filteredVendors = vendors.filter((vendor) => {
    const matchesName = vendor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = vendor.category
      .toLowerCase()
      .includes(categoryFilter.toLowerCase());
    return matchesName && matchesCategory;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function handleDelete() {
    if (selectedVendor) {
      await deleteVendor(selectedVendor.id);
      setConfirmOpen(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search vendors..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Input
            placeholder="Filter category..."
            className="max-w-[200px] bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <VendorDialog />
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-4 pl-6">Vendor Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Avg Cost</TableHead>
              <TableHead>Events</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVendors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-32 text-gray-500"
                >
                  No vendors found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {vendor.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.contactInfo || '-'}</TableCell>
                  <TableCell>
                    {vendor.averageCost
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(vendor.averageCost)
                      : '-'}
                  </TableCell>
                  <TableCell>{vendor.events.length} Events</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <VendorDialog
                          vendor={vendor}
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4 text-green-600" />{' '}
                              Edit
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setConfirmOpen(true);
                          }}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="self-center text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
