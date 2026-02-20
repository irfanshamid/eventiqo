"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { EventVendorDialog } from "./event-vendor-dialog";
import { deleteEventVendor } from "@/app/actions/event-vendors";

interface EventVendor {
  id: string;
  vendorId: string;
  vendor: {
    name: string;
    category: string;
  };
  role: string | null;
  agreedCost: number | null;
  status: string;
}

interface Vendor {
  id: string;
  name: string;
}

interface EventVendorListProps {
  eventId: string;
  eventVendors: EventVendor[];
  vendors: Vendor[];
}

export function EventVendorList({ eventId, eventVendors, vendors }: EventVendorListProps) {
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this vendor from the event?")) {
      await deleteEventVendor(id, eventId);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vendor List</h3>
        <EventVendorDialog eventId={eventId} vendors={vendors} />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Agreed Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No vendors assigned to this event.
                </TableCell>
              </TableRow>
            ) : (
              eventVendors.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="font-medium">{ev.vendor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ev.vendor.category}</Badge>
                  </TableCell>
                  <TableCell>{ev.role || "-"}</TableCell>
                  <TableCell>
                    {ev.agreedCost
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(ev.agreedCost)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ev.status === "PAID"
                          ? "default"
                          : ev.status === "PARTIAL"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        ev.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : ev.status === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {ev.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EventVendorDialog
                        eventId={eventId}
                        eventVendor={{
                          id: ev.id,
                          vendorId: ev.vendorId,
                          role: ev.role,
                          agreedCost: ev.agreedCost,
                          status: ev.status,
                        }}
                        vendors={vendors}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(ev.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
