"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Star, Quote, Calendar, Church, Newspaper } from "lucide-react"
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

interface TimelineItem {
  year: string
  title: string
  titleAr: string
  description: string
}

interface AchievementItem {
  title: string
  description: string
}

interface NewsUpdateItem {
  date: string
  title: string
  description: string
  type: string
}

const seedTimeline: TimelineItem[] = [
  {
    year: "1630",
    title: "Birth in Ehden",
    titleAr: "الولادة في إهدن",
    description:
      "Stephane Douaihy was born in the village of Ehden in North Lebanon to a devout Maronite family.",
  },
  {
    year: "1670",
    title: "Elected Patriarch",
    titleAr: "انتخابه بطريركاً",
    description:
      "Elected as the 57th Patriarch of Antioch and All the East, serving for 34 years.",
  },
  {
    year: "2024",
    title: "Beatification",
    titleAr: "التطويب",
    description:
      "Beatified on August 2, 2024, at Bkerke following the authentication of a miracle attributed to his intercession.",
  },
]

const seedAchievements: AchievementItem[] = [
  {
    title: "Church Organization",
    description:
      "Unified and organized the Maronite Church, establishing consistent customs and references.",
  },
  {
    title: "Historical Works",
    description:
      "Authored extensive works on Maronite history and the role of Christians in the East.",
  },
  {
    title: "Education",
    description:
      "Founded numerous schools and convents, transforming Mount Lebanon from illiterate to prosperous.",
  },
]

const seedNews: NewsUpdateItem[] = [
  {
    date: "August 2, 2025",
    title: "First Anniversary of Beatification",
    description:
      "Grand celebration planned at Bkerke and Ehden to commemorate one year since the beatification.",
    type: "event",
  },
  {
    date: "Monthly",
    title: "Pilgrimage to Qannobin",
    description:
      "Join the monthly pilgrimage to visit the resting place of Blessed Patriarch Douaihy.",
    type: "pilgrimage",
  },
]

export default function PatriarchAboutAdminPage() {
  const [name, setName] = useState("Patriarch Stephane Douaihy")
  const [nameAr, setNameAr] = useState("الطوباوي البطريرك إسطفان الدويهي")
  const [lifespan, setLifespan] = useState("1630 - 1704 | Born in Ehden, Lebanon")
  const [intro, setIntro] = useState(
    "The 57th Patriarch of Antioch and All the East, a pillar of the Maronite Church, prolific historian, and devoted servant of God. Now beatified and on the path to sainthood.",
  )

  const [quote, setQuote] = useState(
    "The land of holiness offers saints to the whole world; through their intercession we will resist.",
  )
  const [quoteAuthor, setQuoteAuthor] = useState("Said about the beatification")

  const [timeline, setTimeline] = useState<TimelineItem[]>(seedTimeline)
  const [achievements, setAchievements] =
    useState<AchievementItem[]>(seedAchievements)
  const [news, setNews] = useState<NewsUpdateItem[]>(seedNews)

  function updateTimeline(index: number, patch: Partial<TimelineItem>) {
    setTimeline((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    )
  }
  function addTimeline() {
    setTimeline((prev) => [
      ...prev,
      { year: "", title: "", titleAr: "", description: "" },
    ])
  }
  function removeTimeline(index: number) {
    setTimeline((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAchievement(index: number, patch: Partial<AchievementItem>) {
    setAchievements((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    )
  }
  function addAchievement() {
    setAchievements((prev) => [...prev, { title: "", description: "" }])
  }
  function removeAchievement(index: number) {
    setAchievements((prev) => prev.filter((_, i) => i !== index))
  }

  function updateNews(index: number, patch: Partial<NewsUpdateItem>) {
    setNews((prev) => prev.map((n, i) => (i === index ? { ...n, ...patch } : n)))
  }
  function addNews() {
    setNews((prev) => [...prev, { date: "", title: "", description: "", type: "" }])
  }
  function removeNews(index: number) {
    setNews((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Blessed Patriarch Douaihy page saved")
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Blessed Patriarch Douaihy
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edit the content shown on the public Patriarch Douaihy page.
          </p>
        </div>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Hero</CardTitle>
          </div>
          <CardDescription>The header banner of the page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAr">Name (Arabic)</Label>
            <Input
              id="nameAr"
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lifespan">Lifespan / Subtitle</Label>
            <Input
              id="lifespan"
              value={lifespan}
              onChange={(e) => setLifespan(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="intro">Intro</Label>
            <Textarea
              id="intro"
              rows={3}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quote */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Featured Quote</CardTitle>
          </div>
          <CardDescription>Shown prominently below the hero.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quoteAuthor">Attribution</Label>
            <Input
              id="quoteAuthor"
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">His Legacy</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
            >
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          </div>
          <CardDescription>Lasting contributions to the Church.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    value={achievement.title}
                    onChange={(e) =>
                      updateAchievement(index, { title: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAchievement(index)}
                  aria-label="Remove achievement"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={achievement.description}
                  onChange={(e) =>
                    updateAchievement(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No achievements yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Life Timeline</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeline}
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
          <CardDescription>Key moments in his life.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {timeline.map((event, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="flex items-end gap-2">
                <div className="flex w-28 shrink-0 flex-col gap-2">
                  <Label>Year</Label>
                  <Input
                    value={event.year}
                    onChange={(e) =>
                      updateTimeline(index, { year: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    value={event.title}
                    onChange={(e) =>
                      updateTimeline(index, { title: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTimeline(index)}
                  aria-label="Remove event"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Title (Arabic)</Label>
                <Input
                  dir="rtl"
                  value={event.titleAr}
                  onChange={(e) =>
                    updateTimeline(index, { titleAr: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={event.description}
                  onChange={(e) =>
                    updateTimeline(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No timeline events yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* News & Updates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">News &amp; Updates</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addNews}>
              <Plus className="h-4 w-4" />
              Add Update
            </Button>
          </div>
          <CardDescription>Upcoming events and announcements.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {news.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input
                    value={item.date}
                    onChange={(e) => updateNews(index, { date: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      updateNews(index, { title: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <Input
                  value={item.type}
                  onChange={(e) => updateNews(index, { type: e.target.value })}
                  placeholder="event, pilgrimage, prayer..."
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateNews(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeNews(index)}
                className="self-end text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
          {news.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No updates yet.
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
