"use client"

import { Search, Zap, Bell, ChevronDown } from "lucide-react"

export function Topbar() {
  return (
    <header className="glass sticky top-0 z-20 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold">EdgeMatch</span>
      </div>

      <div className="relative ml-auto hidden w-full max-w-sm items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search fixtures, teams, markets..."
          className="h-10 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/15"
        />
      </div>

      <button className="ml-auto flex size-10 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground sm:ml-0">
        <Search className="size-4 sm:hidden" />
        <span className="relative hidden sm:block">
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-card" />
        </span>
      </button>

      <button className="flex items-center gap-2 rounded-xl border border-border bg-background/60 py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-accent">
        <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
          JD
        </span>
        <span className="hidden text-sm font-medium sm:block">J. Doe</span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </button>
    </header>
  )
}
