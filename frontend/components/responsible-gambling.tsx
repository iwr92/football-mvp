import { ShieldAlert } from "lucide-react"

export function ResponsibleGambling() {
  return (
    <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-info/15 text-info">
        <ShieldAlert className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Analytics for informed decisions — not guarantees</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          EdgeMatch provides statistical models and probability estimates for research purposes.
          Outcomes are never certain. Only stake what you can afford to lose, set limits, and take
          breaks. If gambling stops being fun, it&apos;s time to stop.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs font-medium">
        <span className="rounded-full bg-accent px-3 py-1.5 text-muted-foreground">18+</span>
        <a href="#" className="text-info underline-offset-4 hover:underline">
          BeGambleAware.org
        </a>
      </div>
    </div>
  )
}
