"use client";

import { useState } from "react";
import Cal from "@calcom/embed-react";

type EventDef = {
  key: string;
  title: string;
  subtitle: string;
  blurb: string;
  link: string; // calLink format: username/event
};

const EVENTS: EventDef[] = [
  {
    key: "15",
    title: "Quick Chat",
    subtitle: "15 minutes",
    blurb: "Say hi, ask anything, pitch your idea — low lift.",
    link: "mattenarle10/15min",
  },
  {
    key: "30",
    title: "Quotation Call",
    subtitle: "30 minutes",
    blurb: "Light scope + ballpark estimate. Keep it simple.",
    link: "mattenarle10/30min",
  },
  {
    key: "60",
    title: "Working Session",
    subtitle: "60 minutes",
    blurb: "Longer deep-dive. Screenshare + plan next steps.",
    link: "mattenarle10/working-session-60m",
  },
];

export default function CalInline() {
  const [active, setActive] = useState<EventDef | null>(null);

  return (
    <div className="w-full">
      {!active ? (
        <div className="w-full">
          <div className="mb-3 text-sm md:text-base font-medium tracking-tight opacity-90">Book a Call</div>
          <div className="-mx-1">
            <div className="px-1 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {EVENTS.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setActive(e)}
                  className="group w-full text-left rounded-md border card-border px-4 py-3 md:px-5 md:py-4 transition-transform transition-colors duration-300 hover:translate-x-0.5 hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-sm focus:outline-none focus:ring-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm md:text-base font-medium tracking-tight">{e.title}</span>
                      <span className="text-[11px] md:text-xs opacity-60 group-hover:opacity-80 transition-opacity">{e.subtitle}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] md:text-xs opacity-80 leading-snug group-hover:opacity-100 transition-opacity">{e.blurb}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm rounded-md border card-border hover:-translate-y-0.5 transition-transform"
            >
              ← Back to events
            </button>
            <div className="text-xs opacity-70">{active.title} · {active.subtitle}</div>
          </div>
          <div className="rounded-md border card-border overflow-auto h-[55vh] md:h-[60vh] max-h-[560px] overscroll-contain">
            {/* Inline embed inside a constrained viewport; the iframe will scroll if needed */}
            <Cal calLink={active.link} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>
        </div>
      )}
    </div>
  );
}
