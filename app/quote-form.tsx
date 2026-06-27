"use client";

import { useRef, useState } from "react";

type Photo = { id: string; file: File; url: string };

const dayOptions = [
  "As soon as possible",
  "Sometime this week",
  "This weekend",
  "I'm flexible",
];

export default function QuoteForm({ services }: { services: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [day, setDay] = useState<string>("");
  const [exactDate, setExactDate] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function toggleService(title: string) {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((s) => s !== title)
        : [...prev, title],
    );
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: Photo[] = [];
    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/")) continue;
      next.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID().slice(0, 6)}`,
        file,
        url: URL.createObjectURL(file),
      });
    }
    setPhotos((prev) => [...prev, ...next].slice(0, 6));
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const formEl = e.currentTarget;
    const data = new FormData(formEl);

    // Rebuild the structured fields from component state.
    data.delete("services");
    selected.forEach((s) => data.append("services", s));

    const preferredDay = [day, exactDate].filter(Boolean).join(" - ");
    data.set("preferredDay", preferredDay);

    data.delete("photos");
    photos.forEach((p) => data.append("photos", p.file, p.file.name));

    if (!selected.length) {
      setStatus("error");
      setErrorMsg("Please choose at least one service.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quote", { method: "POST", body: data });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      photos.forEach((p) => URL.revokeObjectURL(p.url));
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(25,67,31,0.12)] sm:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f5e8] text-[#2E7D32]">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-black text-[#16371a]">
          Got it &mdash; you&apos;re all set!
        </h3>
        <p className="mt-3 max-w-sm text-base leading-7 text-[#516153]">
          John just got your request and will call you soon to set up your free
          quote. Keep an eye out for a confirmation text on your phone.
        </p>
        <button
          type="button"
          onClick={() => {
            setSelected([]);
            setDay("");
            setExactDate("");
            setPhotos([]);
            setStatus("idle");
          }}
          className="mt-7 rounded-lg border border-[#cde6cf] px-6 py-3 text-sm font-black text-[#2E7D32] transition hover:bg-[#f1f8f1]"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl bg-[#f8fbf8] p-5 shadow-[0_18px_45px_rgba(25,67,31,0.10)] sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#214625]">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="rounded-lg border border-[#d7e8d8] bg-white px-4 py-3 font-medium text-[#16371a] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#214625]">
          Phone
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(409) 555-0123"
            className="rounded-lg border border-[#d7e8d8] bg-white px-4 py-3 font-medium text-[#16371a] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[#214625]">
        Property address
        <input
          name="address"
          autoComplete="street-address"
          placeholder="Street, city in Southeast Texas"
          className="rounded-lg border border-[#d7e8d8] bg-white px-4 py-3 font-medium text-[#16371a] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
        />
      </label>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-[#214625]">
          What services do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((title) => {
            const active = selected.includes(title);
            return (
              <button
                type="button"
                key={title}
                aria-pressed={active}
                onClick={() => toggleService(title)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white shadow-sm"
                    : "border-[#d7e8d8] bg-white text-[#3c5740] hover:border-[#2E7D32] hover:text-[#2E7D32]"
                }`}
              >
                {active ? "✓ " : ""}
                {title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-[#214625]">
          Preferred day{" "}
          <span className="font-medium text-[#6b786d]">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map((opt) => {
            const active = day === opt;
            return (
              <button
                type="button"
                key={opt}
                aria-pressed={active}
                onClick={() => setDay(active ? "" : opt)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white shadow-sm"
                    : "border-[#d7e8d8] bg-white text-[#3c5740] hover:border-[#2E7D32] hover:text-[#2E7D32]"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <label className="mt-1 grid gap-2 text-xs font-bold text-[#6b786d]">
          Or pick an exact date
          <input
            type="date"
            value={exactDate}
            onChange={(e) => setExactDate(e.target.value)}
            className="w-fit rounded-lg border border-[#d7e8d8] bg-white px-4 py-2.5 text-sm font-medium text-[#16371a] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </label>
      </fieldset>

      <label className="grid gap-2 text-sm font-bold text-[#214625]">
        Anything else John should know?{" "}
        <span className="font-medium text-[#6b786d]">(optional)</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Gate code, the back corner that floods, a dog in the yard..."
          className="rounded-lg border border-[#d7e8d8] bg-white px-4 py-3 font-medium text-[#16371a] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
        />
      </label>

      <div className="grid gap-3">
        <span className="text-sm font-bold text-[#214625]">
          Upload photos{" "}
          <span className="font-medium text-[#6b786d]">(optional)</span>
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#bfdcc1] bg-white px-4 py-7 text-center transition hover:border-[#2E7D32] hover:bg-[#f1f8f1]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-[#2E7D32]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          >
            <path d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-sm font-bold text-[#2E7D32]">
            Tap to add photos of your yard
          </span>
          <span className="text-xs font-medium text-[#6b786d]">
            Helps John give you an accurate quote (up to 6)
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          name="photos"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[#d7e8d8]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt="Selected yard"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => removePhoto(p.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg bg-[#fdecec] px-4 py-3 text-sm font-bold text-[#b3261e]"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-7 py-4 text-base font-black text-white shadow-lg shadow-[#2E7D32]/20 transition hover:-translate-y-0.5 hover:bg-[#256a2a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {status === "sending" ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Sending to John...
          </>
        ) : (
          "Submit request"
        )}
      </button>
      <p className="text-center text-xs font-medium text-[#6b786d]">
        Submitting texts John right away and sends you a confirmation. No
        accounts, no spam.
      </p>
    </form>
  );
}
