const heroImage =
  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=2200&q=85";

import QuoteForm from "./quote-form";
import BeforeAfterGallery, { type Project } from "./before-after-gallery";

const galleryProjects: Project[] = [
  {
    before: "/yard-before.jpg",
    after: "/yard-after.jpg",
    label: "Backyard mow & cleanup",
    blurb:
      "Shaggy, overgrown grass brought back to a crisp, even cut — stepping stones and fire pit clean and clear again.",
    tags: ["Lawn Mowing", "Yard Cleanup"],
  },
  // {
  //   before:
  //     "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=900&q=80",
  //   after:
  //     "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80",
  //   label: "Cleanup and trimming",
  //   blurb:
  //     "A tangled, neglected bed cleared out, edged, and the whole area tidied up.",
  //   tags: ["Yard Cleanup", "Weed Eating"],
  // },
  // {
  //   before:
  //     "https://images.unsplash.com/photo-1599685315640-0c975a44f78c?auto=format&fit=crop&w=900&q=80",
  //   after:
  //     "https://images.unsplash.com/photo-1600411833114-98f05b5a20af?auto=format&fit=crop&w=900&q=80",
  //   label: "Seasonal maintenance",
  //   blurb:
  //     "Beds cleaned up and a full property reset ready for the season ahead.",
  //   tags: ["Yard Cleanup", "Seasonal Maintenance"],
  // },
];

const services = [
  {
    icon: "M4 17h16M6 17l3-9h6l3 9M8 13h8",
    title: "Lawn Mowing",
    text: "Clean, consistent mowing that keeps your yard looking sharp week after week.",
  },
  {
    icon: "M5 19c6-2 10-6 14-14M5 19V9m0 10h10",
    title: "Edging",
    text: "Crisp sidewalk, driveway, and bed edges for a finished curb appeal look.",
  },
  {
    icon: "M12 3v18M5 7c4 1 10 1 14 0M5 17c4-1 10-1 14 0",
    title: "Weed Eating",
    text: "Careful trimming around fences, posts, trees, beds, and hard-to-reach areas.",
  },
  {
    icon: "M6 18h12M8 18V8l4-4 4 4v10M4 22h16",
    title: "Yard Cleanup",
    text: "Practical cleanup for overgrown, storm-hit, or just plain tired outdoor spaces.",
  },
  {
    icon: "M4 8c6 0 10 4 10 10-6 0-10-4-10-10Zm10 0c4 0 6 3 6 7",
    title: "Leaf Removal",
    text: "Seasonal leaf removal to clear lawns, beds, patios, and common trouble spots.",
  },
  {
    icon: "M7 4v4M17 4v4M5 9h14M7 13h3m4 0h3M7 17h3m4 0h3",
    title: "Seasonal Property Maintenance",
    text: "Dependable help keeping your property maintained through each Southeast Texas season.",
  },
];

const features = [
  [
    "Honest & Reliable",
    "Straight answers, clear expectations, and work done when John says it will be done.",
  ],
  [
    "Affordable Pricing",
    "Fair quotes for routine lawn care, property cleanup, and ongoing maintenance.",
  ],
  [
    "Locally Owned",
    "A trusted local professional serving Orange, Bridge City, West Orange, Vidor, and nearby communities.",
  ],
  [
    "Quality Work Every Time",
    "Careful detail on every visit because your property should feel cared for.",
  ],
];

const reviews = [
  {
    name: "Local Homeowner",
    location: "Orange, TX",
    text: "John showed up when he said he would, gave a fair price, and made the yard look better than it has in months.",
  },
  {
    name: "Repeat Customer",
    location: "Bridge City, TX",
    text: "Temple Property Care is dependable and easy to work with. The edging and cleanup always look professional.",
  },
  {
    name: "Property Owner",
    location: "West Orange, TX",
    text: "Honest, respectful, and thorough. It is obvious John takes pride in treating the property like his own.",
  },
];

function Icon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d={path} />
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-black uppercase text-[#2E7D32]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black text-[#16371a] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#516153]">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#16371a]">
      <header className="absolute left-0 right-0 top-0 z-20">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
        >
          <a
            href="#home"
            aria-label="Temple Property Care home"
            className="inline-flex items-center rounded-lg bg-white/95 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur"
          >
            <img
              src="/logo.png"
              alt="Temple Property Care"
              className="h-10 w-auto sm:h-12"
            />
          </a>
          <div className="hidden items-center gap-7 rounded-lg bg-white/92 px-6 py-3 text-sm font-semibold text-[#214625] shadow-lg shadow-black/10 backdrop-blur md:flex">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#reviews">Reviews</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <a
            href="tel:+14092298694"
            className="rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-[#2E7D32] shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
          >
            Call John
          </a>
        </nav>
      </header>

      <section
        id="home"
        className="relative flex min-h-[92vh] items-end overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 38, 12, 0.87), rgba(7, 38, 12, 0.46), rgba(7, 38, 12, 0.2)), url(${heroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-8 lg:pb-20">
          <div className="max-w-3xl animate-[rise_700ms_ease-out]">
            <p className="mb-5 inline-flex rounded-lg bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur">
              Orange TX Lawn Care and Property Maintenance
            </p>
            <h1 className="text-balance text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Reliable Property Care You Can Count On
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
              Serving Orange, Bridge City, West Orange, Vidor, Mauriceville,
              and surrounding Southeast Texas communities with dependable lawn
              care and property maintenance.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="rounded-lg bg-[#66BB6A] px-7 py-4 text-center text-base font-black text-[#0d2c10] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white"
              >
                Request Free Quote
              </a>
              <a
                href="tel:+14092298694"
                className="rounded-lg border border-white/50 bg-white/12 px-7 py-4 text-center text-base font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#2E7D32]"
              >
                Call John
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-5 py-16 sm:px-8 sm:py-20">
        <SectionIntro
          eyebrow="Services"
          title="Complete lawn care for homes and properties"
          text="From lawn mowing near you to seasonal property maintenance, Temple Property Care helps Southeast Texas yards stay clean, healthy, and welcoming."
        />
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-lg bg-white p-6 shadow-[0_18px_45px_rgba(25,67,31,0.10)] transition hover:-translate-y-1"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#e7f5e8] text-[#2E7D32]">
                <Icon path={service.icon} />
              </div>
              <h3 className="text-xl font-black">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#516153]">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <SectionIntro
          eyebrow="Why choose us"
          title="Local service built on trust"
          text="John Temple is known for honest communication, dependable scheduling, and quality work that makes property care feel simple."
        />
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text]) => (
            <article
              key={title}
              className="rounded-lg border border-[#dbeedd] bg-[#f8fbf8] p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2E7D32] text-lg font-black text-white">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#516153]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <img
            src="/john-temple.jpg"
            alt="John Temple of Temple Property Care"
            className="h-80 w-full rounded-lg object-cover shadow-[0_22px_55px_rgba(25,67,31,0.16)] sm:h-[420px]"
          />
          <div>
            <p className="text-sm font-black uppercase text-[#2E7D32]">
              About John
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Property care from someone who treats your place with respect
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-[#516153]">
              <p>
                John Temple built Temple Property Care around a simple idea:
                show up, be honest, and do the work the right way. Customers
                trust John because he listens, explains what a property needs,
                and takes pride in the details that make a yard feel cared for.
              </p>
              <p>
                Whether he is mowing a weekly lawn in Orange, cleaning up a
                yard in Bridge City, or helping with seasonal property
                maintenance in West Orange, John works like the property belongs
                to someone he knows. That steady, neighborly approach is what
                keeps customers calling him back.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <SectionIntro
          eyebrow="Gallery"
          title="See the before &amp; after for yourself"
          text="Real Southeast Texas yards, transformed. Drag the slider on any project to reveal the difference John's work makes."
        />
        <BeforeAfterGallery projects={galleryProjects} />
      </section>

      <section id="reviews" className="px-5 py-16 sm:px-8 sm:py-20">
        <SectionIntro
          eyebrow="Reviews"
          title="Trusted by local property owners"
          text="Placeholder reviews show the tone and layout for future customer feedback from Orange, Bridge City, West Orange, and nearby areas."
        />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-lg bg-white p-7 shadow-[0_18px_45px_rgba(25,67,31,0.10)]"
            >
              <p
                aria-label="Five star rating"
                className="text-xl tracking-[0.14em] text-[#2E7D32]"
              >
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </p>
              <p className="mt-5 text-base leading-8 text-[#516153]">
                &quot;{review.text}&quot;
              </p>
              <div className="mt-6">
                <h3 className="font-black">{review.name}</h3>
                <p className="text-sm text-[#6b786d]">{review.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#2E7D32] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">
              Ready for a yard you&apos;ll be proud of?
            </h2>
            <p className="mt-3 text-lg font-semibold text-white/85">
              Request Your Free Quote Today
            </p>
          </div>
          <a
            href="#contact"
            className="rounded-lg bg-white px-8 py-4 text-base font-black text-[#2E7D32] shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:bg-[#F5F5F5]"
          >
            Get Started
          </a>
        </div>
      </section>

      <section id="contact" className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase text-[#2E7D32]">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Tell John what your property needs
            </h2>
            <p className="mt-5 text-base leading-8 text-[#516153]">
              Share a few details about the work, the best way to reach you,
              and any photos that help John understand the job. He&apos;ll review
              your request and get back with a clear, honest quote.
            </p>
            <p className="mt-4 text-base leading-8 text-[#516153]">
              Need to talk it through first? Give John a call and he&apos;ll help
              you figure out the next step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+14092298694"
                className="rounded-lg bg-[#2E7D32] px-6 py-4 text-center font-black text-white transition hover:-translate-y-0.5 hover:bg-[#256a2a]"
              >
                Call (409) 229-8694
              </a>
            </div>
          </div>

          <QuoteForm services={services.map((service) => service.title)} />
        </div>
      </section>

      <footer className="bg-[#143817] px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20">
              <img
                src="/logo.png"
                alt="Temple Property Care"
                className="h-16 w-auto"
              />
            </div>
            <p className="mt-4 text-white/75">Serving Southeast Texas</p>
            <p className="mt-4 text-sm text-white/65">
              Website proudly donated and designed by Moe Media.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-white/85">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="tel:+14092298694">Phone</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
