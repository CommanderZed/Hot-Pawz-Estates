import InquiryForm from "./InquiryForm.jsx";
import ServiceMap from "./ServiceMap.jsx";

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-ambergold-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L8.75 11.836l6.543-6.543a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-[#f6efe4]/95 backdrop-blur-md">
        <div className="h-[3px] bg-gradient-to-r from-slateink-800 via-ambergold-500 to-mustard-500" />
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-8 sm:py-3.5">
          <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Hot Pawz Estates home">
            <img
              src="/hot-pawz-logo.jpg"
              alt=""
              className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-xs font-semibold tracking-[0.14em] text-slateink-800 sm:text-sm sm:tracking-[0.18em]">
                HOT PAWZ ESTATES
              </span>
              <span className="block truncate text-[10px] tracking-[0.08em] text-slateink-500 sm:text-[11px] sm:tracking-[0.12em]">
                Consignment & Liquidation
              </span>
            </span>
          </a>
        </div>
      </header>

      <main id="main">
        <section id="top">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-16">
            <h1 className="max-w-3xl font-display text-[1.7rem] font-semibold leading-snug text-slateink-800 sm:text-4xl md:text-5xl">
              Straightforward Estate & Collection Clearing
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slateink-600 sm:mt-5 sm:text-lg">
              We appraise, catalog, photograph, and sell estates and collections across Durham. The first conversation is free, with no obligation.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
              <li className="inline-flex items-center gap-2 rounded-full border border-slateink-800/15 bg-white px-3 py-2 text-[13px] text-slateink-800 sm:gap-2.5 sm:px-4 sm:text-sm">
                <CheckIcon />
                Free consultation
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-slateink-800/15 bg-white px-3 py-2 text-[13px] text-slateink-800 sm:gap-2.5 sm:px-4 sm:text-sm">
                <CheckIcon />
                Full inventory handling
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-slateink-800/15 bg-white px-3 py-2 text-[13px] text-slateink-800 sm:gap-2.5 sm:px-4 sm:text-sm">
                <CheckIcon />
                Real collector reach
              </li>
            </ul>
          </div>
        </section>

        <section id="inquiry">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
            <h2 className="font-display text-xl font-semibold text-slateink-800 sm:text-3xl">Tell us about your items</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slateink-600">
              Share a few details. We will follow up with next steps.
            </p>
            <InquiryForm />
          </div>
        </section>

        <section id="how-we-sell" className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
          <div className="max-w-xl">
            <h2 className="font-display text-[1.65rem] font-semibold leading-snug text-slateink-800 sm:text-[2rem]">
              Each piece goes where it will sell best
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slateink-600">You have one contact. We decide the channel.</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="relative flex flex-col overflow-hidden rounded-2xl border border-slateink-800/15 bg-stonewarm-50 px-5 pb-5 pt-6 shadow-card sm:px-6 sm:pb-6 sm:pt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ambergold-600">eBay</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-slateink-800">Hot Pawz storefront</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slateink-600">
                Jewelry, silver, electronics, books, and other parcel-sized pieces. National buyers. Tracked parcel mail only.
              </p>
              <p className="mt-4 rounded-lg border border-stonewarm-200 bg-stonewarm-100 px-3.5 py-3 text-sm text-slateink-700">
                No freight shipping.
              </p>
              <a
                href="https://ebay.io/m/tBjNNH"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ambergold-700 hover:text-ambergold-600"
              >
                Visit the Hot Pawz eBay store
                <span aria-hidden="true">↗</span>
              </a>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-2xl border border-slateink-800/15 bg-stonewarm-50 px-5 pb-5 pt-6 shadow-card sm:px-6 sm:pb-6 sm:pt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ambergold-600">Private network</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-slateink-800">Collectors and dealers</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slateink-600">
                Antiques, artifacts, and period pieces placed quietly with collectors and regional dealers in the Triangle.
              </p>
              <p className="mt-4 rounded-lg border border-stonewarm-200 bg-stonewarm-100 px-3.5 py-3 text-sm text-slateink-700">
                Confidential evaluation and private placement.
              </p>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-2xl border border-slateink-800/15 bg-stonewarm-50 px-5 pb-5 pt-6 shadow-card sm:px-6 sm:pb-6 sm:pt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ambergold-600">Durham / Triangle</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-slateink-800">Local pickup</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slateink-600">
                Furniture, lighting, and larger household pieces. We handle messaging, vetting, and pickup timing.
              </p>
              <p className="mt-4 rounded-lg border border-stonewarm-200 bg-stonewarm-100 px-3.5 py-3 text-sm text-slateink-700">
                No freight. Local pickup only.
              </p>
            </article>
          </div>
        </section>

        <section id="service-area">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
            <div className="max-w-xl">
              <h2 className="font-display text-[1.65rem] font-semibold leading-snug text-slateink-800 sm:text-[2rem]">
                On-site work in Durham County
              </h2>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slateink-800/15 shadow-card">
              <ServiceMap />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slateink-500">
              eBay listings still ship nationally by parcel. Larger pieces stay local.
            </p>
          </div>
        </section>
      </main>

      <footer className="text-slateink-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-8 sm:py-10">
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-slateink-800">HOT PAWZ ESTATES</p>
            <p className="mt-2 text-sm">Durham, North Carolina</p>
            <p className="mt-1 text-sm text-slateink-500">Licensed & Insured</p>
          </div>
          <a
            href="https://ebay.io/m/tBjNNH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-medium text-ambergold-700 hover:text-ambergold-600"
          >
            Official Hot Pawz eBay Store ↗
          </a>
        </div>
      </footer>
    </>
  );
}
