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
import { addEventVendor, updateEventVendor } from "@/app/actions/event-vendors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vendor {
  id: string;
  name: string;
}

interface EventVendor {
  id: string;
  vendorId: string;
  role: string | null;
  agreedCost: number | null;
  status: string;
}

interface EventVendorDialogProps {
  eventId: string;
  eventVendor?: EventVendor;
  vendors: Vendor[];
}

export function EventVendorDialog({ eventId, eventVendor, vendors }: EventVendorDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!eventVendor;

  async function handleSubmit(formData: FormData) {
    if (isEditing && eventVendor) {
      await updateEventVendor(eventVendor.id, eventId, formData);
    } else {
      await addEventVendor(eventId, formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="bg-[#1E88E5]">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Vendor" : "Add Vendor to Event"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update vendor details for this event."
                : "Select a vendor and assign a role."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!isEditing && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="vendorId">
                  Vendor
                </Label>
                <div>
                  <Select name="vendorId" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                defaultValue={eventVendor?.role || ""}
                placeholder="e.g. Main Photographer"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="agreedCost">
                Agreed Cost
              </Label>
              <Input
                id="agreedCost"
                name="agreedCost"
                type="number"
                defaultValue={eventVendor?.agreedCost || 0}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">
                Payment Status
              </Label>
              <div>
                <Select name="status" defaultValue={eventVendor?.status || "PENDING"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save changes" : "Add Vendor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
