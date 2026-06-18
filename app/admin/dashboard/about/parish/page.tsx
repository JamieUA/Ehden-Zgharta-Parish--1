"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Church, Quote, Calendar, Star } from "lucide-react"
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

interface ValueItem {
  title: string
  titleAr: string
  description: string
}

interface Milestone {
  year: string
  event: string
}

const seedValues: ValueItem[] = [
  {
    title: "Faith",
    titleAr: "الإيمان",
    description:
      "Rooted in the Maronite tradition, we celebrate our faith through the Holy Liturgy and sacraments.",
  },
  {
    title: "Community",
    titleAr: "المجتمع",
    description:
      "Building strong bonds between families and generations, creating a supportive faith community.",
  },
  {
    title: "Service",
    titleAr: "الخدمة",
    description:
      "Serving those in need through charitable works and outreach programs in our region.",
  },
  {
    title: "Education",
    titleAr: "التعليم",
    description:
      "Nurturing faith formation for all ages through catechesis and religious education.",
  },
]

const seedMilestones: Milestone[] = [
  { year: "749 AD", event: "Founding of the first church in Ehden" },
  { year: "1283", event: "Establishment of Mar Mama Church" },
  { year: "1516", event: "Construction of St. George Cathedral in Zgharta" },
  { year: "1900", event: "Formation of the modern parish structure" },
  { year: "2000", event: "Launch of Radio Ehden" },
  { year: "2015", event: "Establishment of Zgharta Channel" },
]

export default function ParishAboutAdminPage() {
  const [title, setTitle] = useState("Maronite Patriarchal Eparchy")
  const [subtitle, setSubtitle] = useState("Vicariate of Ehden-Zgharta")
  const [titleAr, setTitleAr] = useState(
    "الأبرشية البطريركية المارونية - نيابة إهدن زغرتا",
  )

  const [introHeading, setIntroHeading] = useState(
    "A Spiritual Home for Faith and Community",
  )
  const [introBody, setIntroBody] = useState(
    `The Maronite Patriarchal Eparchy, Vicariate of Ehden-Zgharta, serves as the spiritual center for the faithful communities of Ehden and Zgharta in North Lebanon. Our parish has been a beacon of faith, preserving the rich Maronite heritage for generations.

Under the guidance of our dedicated clergy and with the support of our vibrant community, we continue to celebrate the Holy Mysteries, serve those in need, and pass on our traditions to future generations.

Our vicariate encompasses numerous historic churches and monasteries, each with its own unique history and spiritual significance. Together, they form a network of faith that has sustained our community through centuries.`,
  )
  const [yearsBadge, setYearsBadge] = useState("1200+")

  const [values, setValues] = useState<ValueItem[]>(seedValues)
  const [milestones, setMilestones] = useState<Milestone[]>(seedMilestones)

  function updateValue(index: number, patch: Partial<ValueItem>) {
    setValues((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    )
  }
  function addValue() {
    setValues((prev) => [...prev, { title: "", titleAr: "", description: "" }])
  }
  function removeValue(index: number) {
    setValues((prev) => prev.filter((_, i) => i !== index))
  }

  function updateMilestone(index: number, patch: Partial<Milestone>) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    )
  }
  function addMilestone() {
    setMilestones((prev) => [...prev, { year: "", event: "" }])
  }
  function removeMilestone(index: number) {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("The Parish page saved")
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            The Parish
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edit the content shown on the public About page.
          </p>
        </div>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Hero</CardTitle>
          </div>
          <CardDescription>The header banner of the About page.</CardDescription>
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
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
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
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Introduction</CardTitle>
          </div>
          <CardDescription>
            The opening section describing the parish.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="introHeading">Heading</Label>
            <Input
              id="introHeading"
              value={introHeading}
              onChange={(e) => setIntroHeading(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="introBody">
              Body (one paragraph per blank line)
            </Label>
            <Textarea
              id="introBody"
              rows={8}
              value={introBody}
              onChange={(e) => setIntroBody(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="yearsBadge">Years of Faith badge</Label>
            <Input
              id="yearsBadge"
              value={yearsBadge}
              onChange={(e) => setYearsBadge(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Our Values</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addValue}>
              <Plus className="h-4 w-4" />
              Add Value
            </Button>
          </div>
          <CardDescription>The pillars that guide the community.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    value={value.title}
                    onChange={(e) =>
                      updateValue(index, { title: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Title (Arabic)</Label>
                  <Input
                    dir="rtl"
                    value={value.titleAr}
                    onChange={(e) =>
                      updateValue(index, { titleAr: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={value.description}
                  onChange={(e) =>
                    updateValue(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeValue(index)}
                className="self-end text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
          {values.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No values yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Timeline Milestones</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMilestone}
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </Button>
          </div>
          <CardDescription>Key moments in parish history.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex w-32 shrink-0 flex-col gap-2">
                <Label>Year</Label>
                <Input
                  value={milestone.year}
                  onChange={(e) =>
                    updateMilestone(index, { year: e.target.value })
                  }
                  placeholder="1283"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label>Event</Label>
                <Input
                  value={milestone.event}
                  onChange={(e) =>
                    updateMilestone(index, { event: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMilestone(index)}
                aria-label="Remove milestone"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {milestones.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No milestones yet.
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
