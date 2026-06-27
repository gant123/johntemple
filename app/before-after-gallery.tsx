"use client";

import { useCallback, useRef, useState } from "react";

export type Project = {
  before: string;
  after: string;
  label: string;
  blurb: string;
  tags: string[];
};

function BeforeAfter({ project }: { project: Project }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(25,67,31,0.12)] transition hover:-translate-y-1">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none touch-none overflow-hidden"
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {/* AFTER image is the base layer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.after}
          alt={`${project.label} after`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded bg-[#2E7D32]/95 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
          After
        </span>

        {/* BEFORE image clipped to the left of the handle */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.before}
            alt={`${project.label} before`}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
            Before
          </span>
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${pos}%` }}
        >
          <button
            type="button"
            role="slider"
            aria-label={`Reveal before and after: ${project.label}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft")
                setPos((p) => Math.max(0, p - 4));
              else if (e.key === "ArrowRight")
                setPos((p) => Math.min(100, p + 4));
            }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#2E7D32] text-white shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            >
              <path d="M8 7 4 12l4 5M16 7l4 5-4 5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-black text-[#16371a]">{project.label}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[#516153]">
          {project.blurb}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#e7f5e8] px-2.5 py-1 text-xs font-bold text-[#2E7D32]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function BeforeAfterGallery({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-[#e7f5e8] px-4 py-2 text-sm font-bold text-[#2E7D32]">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M8 7 4 12l4 5M16 7l4 5-4 5" />
        </svg>
        Drag the slider to see the transformation
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <BeforeAfter key={project.label} project={project} />
        ))}
      </div>
    </div>
  );
}
