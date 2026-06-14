"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Calendar,
  Download,
  Filter,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  yanabi3Seasons,
  type Yanabi3Item,
  type Status,
} from "@/components/admin/admin-data"
import { DashboardHero } from "@/components/admin/dashboard-hero"

type FormState = Omit<Yanabi3Item, "id">

const currentYear = new Date().getFullYear()

const emptyForm: FormState = {
  title: "",
  titleAr: "",
  season: yanabi3Seasons[0].value,
  date: new Date().toISOString().slice(0, 10),
  year: currentYear,
  fileUrl: "",
  status: "draft",
}

function seasonLabel(value: string) {
  return yanabi3Seasons.find((s) => s.value === value)?.label ?? value
}

export default function Yanabi3AdminPage() {
  const { yanabi3, addYanabi3, updateYanabi3, deleteYanabi3 } = useAdminData()
  const [search, setSearch] = useState("")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = yanabi3.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.titleAr.includes(search)
    const matchesSeason = seasonFilter === "all" || b.season === seasonFilter
    return matchesSearch && matchesSeason
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: Yanabi3Item) {
    setEditingId(item.id)
    const { id, ...rest } = item
    setForm(rest)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    const payload: FormState = {
      ...form,
      year: new Date(form.date).getFullYear() || form.year,
    }
    if (editingId) {
      updateYanabi3(editingId, payload)
      toast.success("Bulletin updated")
    } else {
      addYanabi3(payload)
      toast.success("Bulletin added")
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (deleteId) {
      deleteYanabi3(deleteId)
      toast.success("Bulletin deleted")
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <DashboardHero
        badge="Pastoral Bulletin"
        title="Yanabi3"
        titleAr="نشرة الينابيع الرعوية"
        description="Manage the weekly pastoral bulletins shown in the Yanabi3 archive."
        icon={BookOpen}
        action={
          <Button
            onClick={openCreate}
            size="lg"
            className="bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4" />
            Add Bulletin
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, value: yanabi3.length, label: "Total bulletins" },
          {
            icon: Calendar,
            value: yanabi3.filter((b) => b.status === "published").length,
            label: "Published",
          },
          {
            icon: Pencil,
            value: yanabi3.filter((b) => b.status === "draft").length,
            label: "Drafts",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bulletins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={seasonFilter} onValueChange={setSeasonFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {yanabi3Seasons.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulletin grid — styled like the website cards */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((bulletin) => (
            <Card
              key={bulletin.id}
              className="group border-none shadow-md transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {seasonLabel(bulletin.season)}
                      </Badge>
                      <Badge
                        variant={
                          bulletin.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {bulletin.status}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {bulletin.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground" dir="rtl">
                      {bulletin.titleAr}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {bulletin.date}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {bulletin.fileUrl ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        asChild
                      >
                        <a
                          href={bulletin.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download bulletin"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => openEdit(bulletin)}
                      aria-label="Edit bulletin"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(bulletin.id)}
                      aria-label="Delete bulletin"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No bulletins found.</p>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingId ? "Edit Bulletin" : "Add Bulletin"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below. The year is set automatically from the
              date.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Third Sunday of Resurrection"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="titleAr">Title (Arabic)</Label>
              <Input
                id="titleAr"
                dir="rtl"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                placeholder="العنوان بالعربية"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Season</Label>
                <Select
                  value={form.season}
                  onValueChange={(v) => setForm({ ...form, season: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yanabi3Seasons.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fileUrl">Bulletin File URL</Label>
              <Input
                id="fileUrl"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="/bulletins/..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as Status })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Bulletin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this bulletin?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The bulletin will be permanently
              removed from the archive.
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
