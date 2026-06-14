"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  Calendar,
  Church,
  MapPin,
  Sparkles,
  X,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useAdminData,
  massLocations,
  type MassChurchItem,
  type SpecialMassItem,
  type MassScheduleRow,
} from "@/components/admin/admin-data"
import { DashboardHero } from "@/components/admin/dashboard-hero"

// ---------- Options ----------
const DAY_OPTIONS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Daily",
  "Weekdays",
  "Mon - Fri",
  "Sat - Sun",
]

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const MINUTE_OPTIONS = ["00", "15", "30", "45"]
const PERIOD_OPTIONS = ["AM", "PM"]

function parseTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match) {
    return {
      hour: match[1],
      minute: match[2],
      period: match[3].toUpperCase(),
    }
  }
  return { hour: "8", minute: "00", period: "AM" }
}

function formatTime(hour: string, minute: string, period: string) {
  return `${hour}:${minute} ${period}`
}

// ---------- Church form ----------
type ChurchForm = Omit<MassChurchItem, "id">

const emptyChurchForm: ChurchForm = {
  church: "",
  churchAr: "",
  location: massLocations[0],
  schedule: [{ day: "", times: [""] }],
  confession: "",
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
    massChurches,
    specialMasses,
    addMassChurch,
    updateMassChurch,
    deleteMassChurch,
    addSpecialMass,
    updateSpecialMass,
    deleteSpecialMass,
  } = useAdminData()

  const [search, setSearch] = useState("")

  // Church dialog state
  const [churchDialogOpen, setChurchDialogOpen] = useState(false)
  const [editingChurchId, setEditingChurchId] = useState<string | null>(null)
  const [churchForm, setChurchForm] = useState<ChurchForm>(emptyChurchForm)
  const [deleteChurchId, setDeleteChurchId] = useState<string | null>(null)

  // Special dialog state
  const [specialDialogOpen, setSpecialDialogOpen] = useState(false)
  const [editingSpecialId, setEditingSpecialId] = useState<string | null>(null)
  const [specialForm, setSpecialForm] = useState<SpecialForm>(emptySpecialForm)
  const [deleteSpecialId, setDeleteSpecialId] = useState<string | null>(null)

  const filtered = massChurches.filter(
    (m) =>
      m.church.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()),
  )

  const totalServices = massChurches.reduce(
    (sum, c) => sum + c.schedule.reduce((s, row) => s + row.times.length, 0),
    0,
  )

  // ---------- Church handlers ----------
  function openCreateChurch() {
    setEditingChurchId(null)
    setChurchForm(emptyChurchForm)
    setChurchDialogOpen(true)
  }

  function openEditChurch(item: MassChurchItem) {
    setEditingChurchId(item.id)
    const { id, ...rest } = item
    // deep clone schedule so edits don't mutate the store
    setChurchForm({
      ...rest,
      schedule: rest.schedule.map((r) => ({ day: r.day, times: [...r.times] })),
    })
    setChurchDialogOpen(true)
  }

  function updateScheduleRow(index: number, patch: Partial<MassScheduleRow>) {
    setChurchForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    }))
  }

  function addScheduleRow() {
    setChurchForm((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", times: [""] }],
    }))
  }

  function removeScheduleRow(index: number) {
    setChurchForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))
  }

  function setTime(rowIndex: number, timeIndex: number, value: string) {
    setChurchForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              times: row.times.map((t, ti) => (ti === timeIndex ? value : t)),
            }
          : row,
      ),
    }))
  }

  function addTime(rowIndex: number) {
    setChurchForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((row, i) =>
        i === rowIndex ? { ...row, times: [...row.times, "8:00 AM"] } : row,
      ),
    }))
  }

  function removeTime(rowIndex: number, timeIndex: number) {
    setChurchForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((row, i) =>
        i === rowIndex
          ? { ...row, times: row.times.filter((_, ti) => ti !== timeIndex) }
          : row,
      ),
    }))
  }

  function handleSaveChurch() {
    if (!churchForm.church.trim()) {
      toast.error("Church name is required")
      return
    }
    // sanitize: trim times, drop empties
    const cleaned: ChurchForm = {
      ...churchForm,
      schedule: churchForm.schedule
        .map((row) => ({
          day: row.day.trim(),
          times: row.times.map((t) => t.trim()).filter(Boolean),
        }))
        .filter((row) => row.day && row.times.length > 0),
    }
    if (cleaned.schedule.length === 0) {
      toast.error("Add at least one schedule entry with a day and time")
      return
    }
    if (editingChurchId) {
      updateMassChurch(editingChurchId, cleaned)
      toast.success("Mass schedule updated")
    } else {
      addMassChurch(cleaned)
      toast.success("Church added")
    }
    setChurchDialogOpen(false)
  }

  function confirmDeleteChurch() {
    if (deleteChurchId) {
      deleteMassChurch(deleteChurchId)
      toast.success("Church removed")
      setDeleteChurchId(null)
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
      <DashboardHero
        badge="Join Us in Prayer"
        title="Mass Times"
        titleAr="مواعيد القداس"
        description="Manage the mass schedule for every church and the upcoming special celebrations shown on the website."
        icon={Clock}
        action={
          <Button
            onClick={openCreateChurch}
            size="lg"
            className="bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4" />
            Add Church
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Church, value: massChurches.length, label: "Churches" },
          { icon: Clock, value: totalServices, label: "Weekly services" },
          { icon: Sparkles, value: specialMasses.length, label: "Special masses" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regular schedule section */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Regular Mass Schedule
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-secondary" />
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search churches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Church schedule grid — styled like the website cards */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((church) => (
              <Card
                key={church.id}
                className="group flex flex-col border-none shadow-lg transition-shadow hover:shadow-xl"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="font-serif text-xl leading-tight">
                        {church.church}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground" dir="rtl">
                        {church.churchAr}
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
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="space-y-1">
                    {church.schedule.map((row, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 border-b border-border py-2 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium">{row.day}</span>
                        </div>
                        <div className="flex flex-wrap justify-end gap-1">
                          {row.times.map((time, tidx) => (
                            <Badge key={tidx} variant="secondary">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 border-t border-dashed pt-3 text-sm">
                    <Church className="h-4 w-4 shrink-0 text-secondary" />
                    <span className="text-muted-foreground">Confession:</span>
                    <span className="font-medium">{church.confession || "—"}</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditChurch(church)}
                      aria-label="Edit church schedule"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteChurchId(church.id)}
                      aria-label="Delete church"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <Church className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No churches found.</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Special celebrations */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Upcoming Special Celebrations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Feast days and special masses highlighted on the website.
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
              <Card
                key={mass.id}
                className="group border-none bg-card shadow-md transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Special Mass
                    </Badge>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {mass.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {mass.location}
                    </div>
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

      {/* ---------- Church Add/Edit Dialog ---------- */}
      <Dialog open={churchDialogOpen} onOpenChange={setChurchDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingChurchId ? "Edit Mass Schedule" : "Add Church"}
            </DialogTitle>
            <DialogDescription>
              These fields match the public mass schedule on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="church">Church Name (English)</Label>
              <Input
                id="church"
                value={churchForm.church}
                onChange={(e) =>
                  setChurchForm({ ...churchForm, church: e.target.value })
                }
                placeholder="Mar Mama Church"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="churchAr">Church Name (Arabic)</Label>
              <Input
                id="churchAr"
                dir="rtl"
                value={churchForm.churchAr}
                onChange={(e) =>
                  setChurchForm({ ...churchForm, churchAr: e.target.value })
                }
                placeholder="كنيسة مار ماما"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Location</Label>
              <Select
                value={churchForm.location}
                onValueChange={(v) =>
                  setChurchForm({ ...churchForm, location: v })
                }
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

            {/* Schedule editor */}
            <div className="flex flex-col gap-2">
              <Label>Weekly Schedule</Label>
              <div className="flex flex-col gap-3">
                {churchForm.schedule.map((row, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Select
                        value={row.day || undefined}
                        onValueChange={(v) =>
                          updateScheduleRow(index, { day: v })
                        }
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAY_OPTIONS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {churchForm.schedule.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeScheduleRow(index)}
                          aria-label="Remove schedule row"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Mass times
                      </span>
                      {row.times.map((time, tIdx) => {
                        const parsed = parseTime(time)
                        return (
                          <div key={tIdx} className="flex items-center gap-1.5">
                            <Select
                              value={parsed.hour}
                              onValueChange={(v) =>
                                setTime(
                                  index,
                                  tIdx,
                                  formatTime(v, parsed.minute, parsed.period),
                                )
                              }
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {HOUR_OPTIONS.map((h) => (
                                  <SelectItem key={h} value={h}>
                                    {h}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-muted-foreground">:</span>
                            <Select
                              value={parsed.minute}
                              onValueChange={(v) =>
                                setTime(
                                  index,
                                  tIdx,
                                  formatTime(parsed.hour, v, parsed.period),
                                )
                              }
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MINUTE_OPTIONS.map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={parsed.period}
                              onValueChange={(v) =>
                                setTime(
                                  index,
                                  tIdx,
                                  formatTime(parsed.hour, parsed.minute, v),
                                )
                              }
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PERIOD_OPTIONS.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {row.times.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() => removeTime(index, tIdx)}
                                aria-label="Remove time"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addTime(index)}
                        className="self-start text-primary hover:text-primary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Time
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScheduleRow}
                className="self-start"
              >
                <Plus className="h-4 w-4" />
                Add Day
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confession">Confession</Label>
              <Input
                id="confession"
                value={churchForm.confession}
                onChange={(e) =>
                  setChurchForm({ ...churchForm, confession: e.target.value })
                }
                placeholder="Saturday 5:00 PM - 6:00 PM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChurchDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveChurch}>
              {editingChurchId ? "Save Changes" : "Add Church"}
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
              Feast days and special masses highlighted on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="special-title">Title</Label>
              <Input
                id="special-title"
                value={specialForm.title}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, title: e.target.value })
                }
                placeholder="Easter Triduum"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="special-date">Date</Label>
              <Input
                id="special-date"
                value={specialForm.date}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, date: e.target.value })
                }
                placeholder="April 17-20, 2026"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="special-location">Location</Label>
              <Input
                id="special-location"
                value={specialForm.location}
                onChange={(e) =>
                  setSpecialForm({ ...specialForm, location: e.target.value })
                }
                placeholder="All Churches"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="special-description">Description</Label>
              <Textarea
                id="special-description"
                value={specialForm.description}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    description: e.target.value,
                  })
                }
                placeholder="Holy Thursday, Good Friday, and Easter Vigil services"
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
        open={deleteChurchId !== null}
        onOpenChange={(open) => !open && setDeleteChurchId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this church?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The church and its full mass
              schedule will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteChurch}
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
            <AlertDialogTitle>Delete this celebration?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The special celebration will be
              permanently removed.
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
