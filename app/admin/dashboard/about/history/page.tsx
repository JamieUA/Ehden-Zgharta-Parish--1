"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, BookOpen, BarChart3, Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface StatItem {
  number: string
  label: string
  labelAr: string
}

interface HistoryEvent {
  year: string
  title: string
  description: string
}

interface HistoryPeriod {
  era: string
  eraAr: string
  events: HistoryEvent[]
}

const seedStats: StatItem[] = [
  { number: "1,200+", label: "Years of Faith", labelAr: "سنة من الإيمان" },
  { number: "12", label: "Historic Churches", labelAr: "كنيسة تاريخية" },
  { number: "6", label: "Monasteries", labelAr: "أديرة" },
  { number: "50,000+", label: "Faithful Served", labelAr: "مؤمن" },
]

const seedPeriods: HistoryPeriod[] = [
  {
    era: "Early Christianity (4th - 7th Century)",
    eraAr: "المسيحية المبكرة",
    events: [
      {
        year: "400 AD",
        title: "First Christian Communities",
        description:
          "Christianity spreads to the mountains of North Lebanon, with early believers establishing small communities in Ehden and surrounding areas.",
      },
      {
        year: "749 AD",
        title: "First Church in Ehden",
        description:
          "The first documented church is established in Ehden, marking the beginning of organized parish life in the region.",
      },
    ],
  },
  {
    era: "Modern Era (20th - 21st Century)",
    eraAr: "العصر الحديث",
    events: [
      {
        year: "2000",
        title: "Launch of Radio Ehden",
        description:
          "Radio Ehden begins broadcasting, bringing the voice of the parish to homes throughout Lebanon and the diaspora.",
      },
      {
        year: "2024",
        title: "Beatification of Patriarch Douaihy",
        description:
          "Patriarch Stephane Douaihy is beatified on August 2, 2024, a historic moment for Ehden and the entire Maronite Church.",
      },
    ],
  },
]

export default function HistoryAboutAdminPage() {
  const [title, setTitle] = useState("Our History")
  const [titleAr, setTitleAr] = useState("تاريخنا العريق")
  const [intro, setIntro] = useState(
    "A journey through centuries of faith, resilience, and devotion in the heart of North Lebanon",
  )

  const [stats, setStats] = useState<StatItem[]>(seedStats)
  const [periods, setPeriods] = useState<HistoryPeriod[]>(seedPeriods)

  function updateStat(index: number, patch: Partial<StatItem>) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }
  function addStat() {
    setStats((prev) => [...prev, { number: "", label: "", labelAr: "" }])
  }
  function removeStat(index: number) {
    setStats((prev) => prev.filter((_, i) => i !== index))
  }

  function updatePeriod(index: number, patch: Partial<HistoryPeriod>) {
    setPeriods((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    )
  }
  function addPeriod() {
    setPeriods((prev) => [...prev, { era: "", eraAr: "", events: [] }])
  }
  function removePeriod(index: number) {
    setPeriods((prev) => prev.filter((_, i) => i !== index))
  }

  function updateEvent(
    pIndex: number,
    eIndex: number,
    patch: Partial<HistoryEvent>,
  ) {
    setPeriods((prev) =>
      prev.map((p, i) =>
        i === pIndex
          ? {
              ...p,
              events: p.events.map((ev, j) =>
                j === eIndex ? { ...ev, ...patch } : ev,
              ),
            }
          : p,
      ),
    )
  }
  function addEvent(pIndex: number) {
    setPeriods((prev) =>
      prev.map((p, i) =>
        i === pIndex
          ? {
              ...p,
              events: [...p.events, { year: "", title: "", description: "" }],
            }
          : p,
      ),
    )
  }
  function removeEvent(pIndex: number, eIndex: number) {
    setPeriods((prev) =>
      prev.map((p, i) =>
        i === pIndex
          ? { ...p, events: p.events.filter((_, j) => j !== eIndex) }
          : p,
      ),
    )
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("History page saved")
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            History
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edit the content shown on the public History page.
          </p>
        </div>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Hero</CardTitle>
          </div>
          <CardDescription>The header banner of the History page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="titleAr">Title (Arabic)</Label>
            <Input
              id="titleAr"
              dir="rtl"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="intro">Intro</Label>
            <Textarea
              id="intro"
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Stats</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addStat}>
              <Plus className="h-4 w-4" />
              Add Stat
            </Button>
          </div>
          <CardDescription>Highlighted figures about the parish.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex w-28 shrink-0 flex-col gap-2">
                <Label>Number</Label>
                <Input
                  value={stat.number}
                  onChange={(e) => updateStat(index, { number: e.target.value })}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label>Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(index, { label: e.target.value })}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label>Label (Arabic)</Label>
                <Input
                  dir="rtl"
                  value={stat.labelAr}
                  onChange={(e) =>
                    updateStat(index, { labelAr: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStat(index)}
                aria-label="Remove stat"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {stats.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No stats yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Timeline periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Timeline Periods</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPeriod}>
              <Plus className="h-4 w-4" />
              Add Period
            </Button>
          </div>
          <CardDescription>
            Historical eras and the events within each.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {periods.map((period, pIndex) => (
            <div
              key={pIndex}
              className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Era</Label>
                  <Input
                    value={period.era}
                    onChange={(e) =>
                      updatePeriod(pIndex, { era: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Era (Arabic)</Label>
                  <Input
                    dir="rtl"
                    value={period.eraAr}
                    onChange={(e) =>
                      updatePeriod(pIndex, { eraAr: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-xs uppercase text-muted-foreground">
                  Events
                </Label>
                {period.events.map((event, eIndex) => (
                  <div
                    key={eIndex}
                    className="flex flex-col gap-3 rounded-md border bg-background p-3"
                  >
                    <div className="flex items-end gap-2">
                      <div className="flex w-32 shrink-0 flex-col gap-2">
                        <Label>Year</Label>
                        <Input
                          value={event.year}
                          onChange={(e) =>
                            updateEvent(pIndex, eIndex, {
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <Label>Title</Label>
                        <Input
                          value={event.title}
                          onChange={(e) =>
                            updateEvent(pIndex, eIndex, {
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEvent(pIndex, eIndex)}
                        aria-label="Remove event"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={event.description}
                        onChange={(e) =>
                          updateEvent(pIndex, eIndex, {
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addEvent(pIndex)}
                  className="self-start"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePeriod(pIndex)}
                className="self-end text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Remove Period
              </Button>
            </div>
          ))}
          {periods.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No periods yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
