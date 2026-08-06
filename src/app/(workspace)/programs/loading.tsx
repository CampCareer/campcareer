export default function ProgramsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-20 rounded bg-[#ecebe7]" />
      <div className="mt-3 h-9 w-60 rounded bg-[#ecebe7]" />
      <div className="mt-6 h-[52px] max-w-3xl rounded-xl bg-[#f0efec]" />
      <div className="mt-5 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-9 w-24 shrink-0 rounded-lg bg-[#f0efec]" />
        ))}
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden h-[620px] rounded-xl bg-[#f5f4f1] lg:block" />
        <div className="space-y-3">
          <div className="h-9 rounded bg-[#f5f4f1]" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-44 rounded-xl border border-[#efeeea] bg-[#fafaf8]" />
          ))}
        </div>
      </div>
    </div>
  )
}
