"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createDraftRabItem, updateDraftRabItem } from "@/app/actions/draft-rab";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Venue",
  "Catering",
  "Decoration",
  "Talent",
  "Production",
  "Documentation",
  "Fee EO",
  "Other",
];

interface DraftRabDialogProps {
  eventId: string;
  item?: any; // Replace with DraftRabItem type
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DraftRabDialog({ eventId, item, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: DraftRabDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (item) {
        await updateDraftRabItem(item.id, eventId, formData);
        toast({ title: "Success", description: "Item updated successfully" });
      } else {
        await createDraftRabItem(eventId, formData);
        toast({ title: "Success", description: "Item added successfully" });
      }
      onOpenChange?.(false);
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={item?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
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
            <div className="space-y-2">
              <Label htmlFor="item">Item Name</Label>
              <Input id="item" name="item" defaultValue={item?.item} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specification">Specification</Label>
            <Textarea id="specification" name="specification" defaultValue={item?.specification} />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty">Qty</Label>
              <Input type="number" id="qty" name="qty" defaultValue={item?.qty || 1} min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qtyType">Qty Type</Label>
              <Input id="qtyType" name="qtyType" defaultValue={item?.qtyType || "Unit"} placeholder="Unit, Pcs, etc" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Freq</Label>
              <Input type="number" id="frequency" name="frequency" defaultValue={item?.frequency || 1} min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencyType">Freq Type</Label>
              <Input id="frequencyType" name="frequencyType" defaultValue={item?.frequencyType || "Day"} placeholder="Day, Event, etc" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPriceRab">Price per Unit (RAB)</Label>
              <Input type="number" id="unitPriceRab" name="unitPriceRab" defaultValue={item?.unitPriceRab} min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPriceReal">Price per Unit (Real)</Label>
              <Input type="number" id="unitPriceReal" name="unitPriceReal" defaultValue={item?.unitPriceReal} min="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea id="remarks" name="remarks" defaultValue={item?.remarks} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
