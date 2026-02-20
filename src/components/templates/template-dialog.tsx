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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createTemplate, updateTemplate } from "@/app/actions/templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Template {
  id: string;
  title: string;
  category: string;
  content: string | null;
}

const CATEGORIES = ["Proposal", "Contract", "Invoice", "Letter"];

export function TemplateDialog({ template }: { template?: Template }) {
  const [open, setOpen] = useState(false);
  const isEditing = !!template;

  async function handleSubmit(formData: FormData) {
    if (isEditing && template) {
      await updateTemplate(template.id, formData);
    } else {
      await createTemplate(formData);
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
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update template content and details."
                : "Create a new document template."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={template?.title}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">
                Category
              </Label>
              <div>
                <Select name="category" defaultValue={template?.category || CATEGORIES[0]}>
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
              <Label htmlFor="content">
                Content (Markdown/Text)
              </Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={template?.content || ""}
                className="h-[200px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save changes" : "Create Template"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
