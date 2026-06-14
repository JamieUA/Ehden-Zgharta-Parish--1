"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Church,
  MapPin,
  Star,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useAdminData,
  massLocations,
  churchTypes,
  type ChurchItem,
} from "@/components/admin/admin-data"

type FormState = Omit<ChurchItem, "id">

const emptyForm: FormState = {
  name: "",
  nameAr: "",
  location: massLocations[0],
  type: churchTypes[0],
  patronSaint: "",
  patronSaintAr: "",
  description: "",
  massSchedule: "",
  image: "/images/mar-mama-church.jpg",
  featured: false,
}

export default function ChurchesAdminPage() {
  const { churches, addChurch, updateChurch, deleteChurch } = useAdminData()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = churches.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.patronSaint.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || c.type === typeFilter
    return matchesSearch && matchesType
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: ChurchItem) {
    setEditingId(item.id)
    const { id, ...rest } = item
    setForm(rest)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Church name is required")
      return
    }
    if (editingId) {
      updateChurch(editingId, form)
      toast.success("Church updated")
    } else {
      addChurch(form)
      toast.success("Church added")
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (deleteId) {
      deleteChurch(deleteId)
      toast.success("Church removed")
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Churches
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage the directory of churches, monasteries, and holy sites shown
            on the website.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Church
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search churches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {churchTypes.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((church) => (
            <Card key={church.id} className="flex flex-col overflow-hidden pt-0">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={church.image || "/placeholder.svg"}
                  alt={church.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <Badge variant="secondary" className="capitalize">
                    {church.type}
                  </Badge>
                  {church.featured && (
                    <Badge className="gap-1 bg-secondary text-secondary-foreground">
                      <Star className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-semibold leading-tight">
                      {church.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {church.nameAr}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex shrink-0 items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {church.location}
                  </Badge>
                </div>
                {church.patronSaint && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Patron: </span>
                    <span className="font-medium">{church.patronSaint}</span>
                  </p>
                )}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {church.description}
                </p>
                {church.massSchedule && (
                  <div className="mt-auto flex items-start gap-2 border-t border-dashed pt-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span className="text-muted-foreground">
                      {church.massSchedule}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(church)}
                  aria-label="Edit church"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(church.id)}
                  aria-label="Delete church"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <Church className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No churches found.</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingId ? "Edit Church" : "Add Church"}
            </DialogTitle>
            <DialogDescription>
              These fields match the public churches directory on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name (English)</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mar Mama Church"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nameAr">Name (Arabic)</Label>
                <Input
                  id="nameAr"
                  dir="rtl"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  placeholder="كنيسة مار ماما"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Location</Label>
                <Select
                  value={form.location}
                  onValueChange={(v) => setForm({ ...form, location: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {massLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {churchTypes.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="patron">Patron Saint (English)</Label>
                <Input
                  id="patron"
                  value={form.patronSaint}
                  onChange={(e) =>
                    setForm({ ...form, patronSaint: e.target.value })
                  }
                  placeholder="St. Mama"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="patronAr">Patron Saint (Arabic)</Label>
                <Input
                  id="patronAr"
                  dir="rtl"
                  value={form.patronSaintAr}
                  onChange={(e) =>
                    setForm({ ...form, patronSaintAr: e.target.value })
                  }
                  placeholder="القديس ماما"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Image Path</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/mar-mama-church.jpg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule">Mass Schedule</Label>
              <Input
                id="schedule"
                value={form.massSchedule}
                onChange={(e) =>
                  setForm({ ...form, massSchedule: e.target.value })
                }
                placeholder="Sunday: 8:00 AM, 10:30 AM | Weekdays: 7:00 AM"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Historical and spiritual significance of this church..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this church on the website.
                </p>
              </div>
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) =>
                  setForm({ ...form, featured: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Church"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete church?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this church from the directory. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
