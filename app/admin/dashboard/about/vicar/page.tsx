"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  UserRound,
  Quote,
  Calendar,
  Heart,
  Phone,
} from "lucide-react"
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

interface BioItem {
  year: string
  title: string
  description: string
}

interface PriorityItem {
  title: string
  description: string
}

const seedBiography: BioItem[] = [
  {
    year: "1958",
    title: "Born in Ehden",
    description: "Born to a devout Maronite family in Ehden, North Lebanon.",
  },
  {
    year: "1984",
    title: "Ordination",
    description:
      "Ordained to the priesthood, beginning his lifelong service to the Maronite Church.",
  },
  {
    year: "2010",
    title: "Appointed Vicar",
    description:
      "Appointed as Patriarchal Vicar of Ehden-Zgharta, leading the faithful in this historic region.",
  },
]

const seedPriorities: PriorityItem[] = [
  {
    title: "Liturgical Life",
    description:
      "Ensuring vibrant and reverent celebration of the Holy Mysteries in all our churches.",
  },
  {
    title: "Charitable Works",
    description: "Expanding our outreach to those in need throughout the region.",
  },
  {
    title: "Faith Formation",
    description:
      "Strengthening catechesis programs for all ages, from children to adults.",
  },
]

export default function VicarAboutAdminPage() {
  const [name, setName] = useState("Reverend Monsignor Joseph Naffah")
  const [role, setRole] = useState("Patriarchal Vicar of Ehden-Zgharta")
  const [roleAr, setRoleAr] = useState("النائب البطريركي")
  const [intro, setIntro] = useState(
    "Serving our community with dedication and love, Monsignor Naffah leads our vicariate in faith, worship, and service to those in need.",
  )

  const [quote, setQuote] = useState(
    "Our mission is to be a beacon of faith and hope, serving God's people with love and humility, just as our Lord Jesus Christ taught us.",
  )
  const [quoteAuthor, setQuoteAuthor] = useState("Msgr. Joseph Naffah")

  const [phone, setPhone] = useState("+961 6 660 230")
  const [email, setEmail] = useState("info@ehdenz.com")

  const [biography, setBiography] = useState<BioItem[]>(seedBiography)
  const [priorities, setPriorities] = useState<PriorityItem[]>(seedPriorities)

  function updateBio(index: number, patch: Partial<BioItem>) {
    setBiography((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    )
  }
  function addBio() {
    setBiography((prev) => [...prev, { year: "", title: "", description: "" }])
  }
  function removeBio(index: number) {
    setBiography((prev) => prev.filter((_, i) => i !== index))
  }

  function updatePriority(index: number, patch: Partial<PriorityItem>) {
    setPriorities((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    )
  }
  function addPriority() {
    setPriorities((prev) => [...prev, { title: "", description: "" }])
  }
  function removePriority(index: number) {
    setPriorities((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("The Vicar page saved")
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            The Vicar
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edit the content shown on the public Vicar page.
          </p>
        </div>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Profile</CardTitle>
          </div>
          <CardDescription>The vicar&apos;s name, role and intro.</CardDescription>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="roleAr">Role (Arabic)</Label>
              <Input
                id="roleAr"
                dir="rtl"
                value={roleAr}
                onChange={(e) => setRoleAr(e.target.value)}
              />
            </div>
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

      {/* Biography */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Biography</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addBio}>
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>
          <CardDescription>Timeline of the vicar&apos;s life.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {biography.map((bio, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="flex items-end gap-2">
                <div className="flex w-32 shrink-0 flex-col gap-2">
                  <Label>Year</Label>
                  <Input
                    value={bio.year}
                    onChange={(e) => updateBio(index, { year: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    value={bio.title}
                    onChange={(e) => updateBio(index, { title: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBio(index)}
                  aria-label="Remove entry"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={bio.description}
                  onChange={(e) =>
                    updateBio(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>
          ))}
          {biography.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No biography entries yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Pastoral Priorities</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPriority}
            >
              <Plus className="h-4 w-4" />
              Add Priority
            </Button>
          </div>
          <CardDescription>Key areas of focus for the vicariate.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {priorities.map((priority, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    value={priority.title}
                    onChange={(e) =>
                      updatePriority(index, { title: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePriority(index)}
                  aria-label="Remove priority"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={priority.description}
                  onChange={(e) =>
                    updatePriority(index, { description: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>
          ))}
          {priorities.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No priorities yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Contact</CardTitle>
          </div>
          <CardDescription>The vicar&apos;s office contact details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
