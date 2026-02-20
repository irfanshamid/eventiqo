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
import { createVendor, updateVendor } from "@/app/actions/vendors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vendor {
  id: string;
  name: string;
  category: string;
  contactInfo: string | null;
  averageCost: number | null;
}

const CATEGORIES = [
  "Venue",
  "Catering",
  "Decoration",
  "Talent",
  "Production",
  "Documentation",
  "Other"
];

export function VendorDialog({ vendor }: { vendor?: Vendor }) {
  const [open, setOpen] = useState(false);
  const isEditing = !!vendor;

  async function handleSubmit(formData: FormData) {
    if (isEditing && vendor) {
      await updateVendor(vendor.id, formData);
    } else {
      await createVendor(formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">Edit</Button>
        ) : (
          <Button className="bg-[#1E88E5]">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update vendor details." : "Add a new vendor to your list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={vendor?.name}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">
                Category
              </Label>
              <div>
                <Select name="category" defaultValue={vendor?.category || CATEGORIES[0]}>
                  <SelectTrigger>
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
              <Label htmlFor="contactInfo">
                Contact
              </Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                defaultValue={vendor?.contactInfo || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="averageCost">
                Avg Cost
              </Label>
              <Input
                id="averageCost"
                name="averageCost"
                type="number"
                defaultValue={vendor?.averageCost || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save changes" : "Create Vendor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
