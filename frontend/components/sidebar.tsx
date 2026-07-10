"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Swords,
  LineChart,
  Wrench,
  Trophy,
  Bookmark,
  Bell,
  Settings,
  Zap,
} from "lucide-react"

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Matches", icon: Swords },
  { label: "Analysis", icon: LineChart },
  { label: "Pro Tools", icon: Wrench },
]

const collections = [
  { label: "Leagues", icon: Trophy },
  { label: "Watchlist", icon: Bookmark },
  { label: "Alerts", icon: Bell, badge: 3 },
]

export function Sidebar() {
  return (
    <aside className="glass sticky top-0 hidden h-dvh w-64 shrink-0 flex-col rounded-none border-y-0 border-l-0 p-5 lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Zap className="size-5" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">EdgeMatch</p>
          <p className="text-[11px] text-muted-foreground">Football Intelligence</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {nav.map((item) => (
          <button
            key={item.label}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              item.active
                ? "bg-primary/12 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="size-[18px] transition-transform group-hover:scale-110" />
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="mt-6 flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Collections
        </p>
        {collections.map((item) => (
          <button
            key={item.label}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <span className="flex items-center gap-3">
              <item.icon className="size-[18px] transition-transform group-hover:scale-110" />
              {item.label}
            </span>
            {item.badge && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="glass-strong rounded-2xl p-4">
          <p className="text-xs font-semibold">Pro Terminal</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Unlock deep-layer models and live market feeds.
          </p>
          <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Upgrade
          </button>
        </div>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Settings className="size-[18px]" />
          Settings
        </button>
      </div>
    </aside>
  )
}
