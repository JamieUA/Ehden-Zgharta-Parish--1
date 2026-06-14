"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
  useAdminData,
  type SpecialMassItem,
  type MassScheduleRow,
} from "@/components/admin/admin-data"

// ---------- Schedule row form ----------
type RowForm = Omit<MassScheduleRow, "id">

const emptyRowForm: RowForm = {
  day: "",
  times: [""],
  note: "",
}

// ---------- Special mass form ----------
type SpecialForm = Omit<SpecialMassItem, "id">

const emptySpecialForm: SpecialForm = {
  title: "",
  date: "",
  description: "",
  location: "",
}

export default function MassTimesAdminPage() {
  const {
    massSchedule,
    specialMasses,
    addMassRow,
    updateMassRow,
    deleteMassRow,
    addSpecialMass,
    updateSpecialMass,
    deleteSpecialMass,
  } = useAdminData()

  // Schedule dialog state
  const [rowDialogOpen, setRowDialogOpen] = useState(false)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [rowForm, setRowForm] = useState<RowForm>(emptyRowForm)
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null)

  // Special dialog state
  const [specialDialogOpen, setSpecialDialogOpen] = useState(false)
  const [editingSpecialId, setEditingSpecialId] = useState<string | null>(null)
  const [specialForm, setSpecialForm] = useState<SpecialForm>(emptySpecialForm)
  const [deleteSpecialId, setDeleteSpecialId] = useState<string | null>(null)

  const totalServices = massSchedule.reduce(
    (sum, row) => sum + row.times.length,
    0,
  )

  // ---------- Schedule handlers ----------
  function openCreateRow() {
    setEditingRowId(null)
    setRowForm(emptyRowForm)
    setRowDialogOpen(true)
  }

  function openEditRow(item: MassScheduleRow) {
    setEditingRowId(item.id)
    setRowForm({ day: item.day, times: [...item.times], note: item.note })
    setRowDialogOpen(true)
  }

  function handleSaveRow() {
    const day = rowForm.day.trim()
    if (!day) {
      toast.error("Day is required")
      return
    }
    const times = rowForm.times.map((t) => t.trim()).filter(Boolean)
    if (times.length === 0) {
      toast.error("Add at least one mass time")
      return
    }
    const cleaned: RowForm = { day, times, note: rowForm.note.trim() }
    if (editingRowId) {
      updateMassRow(editingRowId, cleaned)
      toast.success("Schedule updated")
    } else {
      addMassRow(cleaned)
      toast.success("Schedule entry added")
    }
    setRowDialogOpen(false)
  }

  function confirmDeleteRow() {
    if (deleteRowId) {
      deleteMassRow(deleteRowId)
      toast.success("Schedule entry removed")
      setDeleteRowId(null)
    }
  }

  // ---------- Special handlers ----------
  function openCreateSpecial() {
    setEditingSpecialId(null)
    setSpecialForm(emptySpecialForm)
    setSpecialDialogOpen(true)
  }

  function openEditSpecial(item: SpecialMassItem) {
    setEditingSpecialId(item.id)
    const { id, ...rest } = item
    setSpecialForm(rest)
    setSpecialDialogOpen(true)
  }

  function handleSaveSpecial() {
    if (!specialForm.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!specialForm.date.trim()) {
      toast.error("Date is required")
      return
    }
    if (editingSpecialId) {
      updateSpecialMass(editingSpecialId, specialForm)
      toast.success("Celebration updated")
    } else {
      addSpecialMass(specialForm)
      toast.success("Celebration added")
    }
    setSpecialDialogOpen(false)
  }

  function confirmDeleteSpecial() {
    if (deleteSpecialId) {
      deleteSpecialMass(deleteSpecialId)
      toast.success("Celebration removed")
      setDeleteSpecialId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Mass Times
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage the general weekly mass schedule and upcoming special
            celebrations shown on the website.
          </p>
        </div>
        <Button onClick={openCreateRow}>
          <Plus className="h-4 w-4" />
          Add Schedule Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {massSchedule.length}
              </p>
              <p className="text-sm text-muted-foreground">Schedule entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalServices}
              </p>
              <p className="text-sm text-muted-foreground">Weekly services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {specialMasses.length}
              </p>
              <p className="text-sm text-muted-foreground">Special masses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {massSchedule.length > 0 ? (
            massSchedule.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{row.day}</p>
                    {row.note && (
                      <p className="text-sm text-muted-foreground">
                        {row.note}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex flex-wrap gap-1 sm:justify-end">
                    {row.times.map((time, idx) => (
                      <Badge key={idx} variant="secondary">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditRow(row)}
                      aria-label="Edit schedule entry"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteRowId(row.id)}
                      aria-label="Delete schedule entry"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed py-16 text-center">
              <Clock className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No schedule entries yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Special celebrations */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Special Celebrations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Feast days and upcoming special masses shown on the website.
            </p>
          </div>
          <Button variant="outline" onClick={openCreateSpecial}>
            <Plus className="h-4 w-4" />
            Add Celebration
          </Button>
        </div>

        {specialMasses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {specialMasses.map((mass) => (
              <Card key={mass.id} className="bg-muted/40">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Special Mass
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditSpecial(mass)}
                        aria-label="Edit celebration"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteSpecialId(mass.id)}
                        aria-label="Delete celebration"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold">
                    {mass.title}
                  </h3>
                  <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {mass.date}
                    </div>
                    {mass.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {mass.location}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {mass.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No special celebrations yet.
            </p>
          </div>
        )}
      </div>

      {/* ---------- Schedule Add/Edit Dialog ---------- */}
      <Dialog open={rowDialogOpen} onOpenChange={setRowDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingRowId ? "Edit Schedule Entry" : "Add Schedule Entry"}
            </DialogTitle>
            <DialogDescription>
              A day (or range of days) and the mass times offered.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="day">Day</Label>
              <Input
                id="day"
                value={rowForm.day}
                onChange={(e) =>
                  setRowForm({ ...rowForm, day: e.target.value })
                }
                placeholder="e.g. Sunday or Monday - Friday"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="times">Mass Times</Label>
              <Input
                id="times"
                value={rowForm.times.join(", ")}
                onChange={(e) =>
                  setRowForm({ ...rowForm, times: e.target.value.split(",") })
                }
                placeholder="Comma separated (e.g. 8:00 AM, 10:30 AM, 6:00 PM)"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple times with commas.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                value={rowForm.note}
                onChange={(e) =>
                  setRowForm({ ...rowForm, note: e.target.value })
                }
                placeholder="e.g. Main parish liturgy"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRow}>
              {editingRowId ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------- Special Add/Edit Dialog ---------- */}
      <Dialog open={specialDialogOpen} onOpenChange={setSpecialDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingSpecialId ? "Edit Celebration" : "Add Celebration"}
            </DialogTitle>
            <DialogDescription>
              Feast days and special masses shown on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={specialForm.title}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, title: e.target.value })
                }
                placeholder="Feast of Mar Mama"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={specialForm.date}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, date: e.target.value })
                }
                placeholder="August 2, 2026"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={specialForm.location}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, location: e.target.value })
                }
                placeholder="Mar Mama Church, Ehden"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={specialForm.description}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    description: e.target.value,
                  })
                }
                placeholder="Special celebration details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSpecialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSpecial}>
              {editingSpecialId ? "Save Changes" : "Add Celebration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------- Delete confirmations ---------- */}
      <AlertDialog
        open={deleteRowId !== null}
        onOpenChange={(open) => !open && setDeleteRowId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete schedule entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this entry from the weekly schedule. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRow}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteSpecialId !== null}
        onOpenChange={(open) => !open && setDeleteSpecialId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete celebration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the special celebration from the website. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSpecial}
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
