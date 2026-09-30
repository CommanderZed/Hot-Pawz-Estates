import IntakeForm from "./IntakeForm.jsx";

const EBAY_STORE_URL = "https://ebay.io/m/tBjNNH";
const CONTACT_EMAIL = "Hotpawzestates@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/hotpawzestates";

const NAV_LINKS = [
  ["#how", "How it works"],
  ["#sell", "What we sell"],
  ["#fees", "Fees"],
  ["#terms", "Terms"],
  ["#faq", "FAQ"],
  ["#about", "About"],
  ["#reviews", "Reviews"],
  ["#start", "Start here"]
];

const STEPS = [
  {
    title: "Begin with a description.",
    body: "Send photographs and a brief description through the form below. We will review recent comparable sales and advise you of the expected market value and whether your items are a suitable fit."
  },
  {
    title: "We visit and formalize the agreement.",
    body: "If your collection is a suitable fit, we come to your home to verify the items in person. You then sign the consignment agreement. We transport what our vehicle accommodates, returning for additional loads as needed."
  },
  {
    title: "We manage the sale.",
    body: "We photograph, research, and list each item on eBay under Hot Pawz Estates, respond to buyer inquiries, and oversee careful packing and shipment. Everything is stored at our Durham location."
  },
  {
    title: "You receive payment.",
    body: "We disburse earnings monthly via Zelle, on the schedule specified in your agreement, drawn only from funds eBay has released. Each disbursement includes a statement listing the items sold and your payment amount."
  }
];

const REVIEWS = [
  "A+ seller! The books arrived incredibly fast and the condition was as described. Excellent communication... I would absolutely do business with them again. Highly recommended!",
  "Excellent! Accurate description and photos, careful packaging, and very fast shipping!",
  "Packaged and shipped well; arrived quickly, just as described. This seller is fantastic! Highly recommended!"
];

function StoreLink({ children }) {
  return (
    <a href={EBAY_STORE_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const FAQS = [
  {
    q: "How is this different from an estate sale?",
    a: "Estate sales are designed to clear a house quickly, selling everything in a weekend to whoever walks through the door. We take select collections and sell each item individually on eBay, reaching collectors across the country and around the world."
  },
  {
    q: "How much does it cost?",
    a: "Half of the net proceeds, and only when your items sell. Net proceeds are the sale price less eBay fees, packaging, and other business expenses relating to your items."
  },
  {
    q: "When do I get paid?",
    a: "Monthly, via Zelle, from funds eBay has released. Zelle is available through most banks' mobile apps. Each payout includes a statement listing the items sold and your payment amount."
  },
  {
    q: "Who decides the price?",
    a: "We do. Every price is grounded in current market data and recent sold listings, aligned with what buyers are actually paying, and we reduce prices strategically over time."
  },
  {
    q: "Do I still own my items while you have them?",
    a: "Yes. Your property remains yours while it is on consignment with us. Ownership passes to the buyer only when an item sells."
  },
  {
    q: "Are my items insured while they're with you?",
    a: "Coverage for your property remains your responsibility. If you would like added peace of mind, you may confirm with your insurer whether your policy extends to items held off-site, or arrange additional coverage for the consignment period."
  },
  {
    q: "What kinds of items do you take?",
    a: (
      <>
        Our current focus is books, CDs, vinyl records, and DVDs. <StoreLink>Visit our eBay store</StoreLink> to see what
        we currently have on consignment. We are happy to consider any collection of items permitted for sale on eBay,
        with an estimated market value of $20 or more per item, that can ship through standard mail.
      </>
    )
  },
  {
    q: "Do you provide appraisals?",
    a: "Our market analysis supports our consignment decisions. For formal appraisals, we recommend a licensed appraiser."
  },
  {
    q: "What if my item never sells?",
    a: "At six months, we check in together and decide: keep listing, donate (we forward the receipt), liquidate, or collect by appointment."
  },
  {
    q: "Can I get my items back early?",
    a: "At any time. Collection is by appointment at our Durham location."
  },
  {
    q: "Who pays for shipping?",
    a: "Buyers pay shipping on most listings. On select listings, we offer free shipping as a selling strategy, and that cost comes out of the net proceeds before the split."
  },
  {
    q: "How do I start?",
    a: "Complete the form below, with photographs where possible. We will review comparable sales and advise whether your items are a fit."
  }
];

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="banner">
        <img src="/hot-pawz-banner.jpg" alt="Hot Pawz Estates: unique finds and private collections" width="2048" height="451" />
      </div>

      <nav className="site-nav" aria-label="Sections">
        <ul>
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main">
        <div className="wrap">
          <header className="hero">
            <img className="logo" src="/hot-pawz-logo.jpg" alt="Hot Pawz logo" width="120" height="120" />
            <h1>Rare and collectible estate finds, sold for you.</h1>
            <p className="lede">
              We are Ruth and Zack. We operate Hot Pawz Estates in Durham, North Carolina, selling local estate goods on
              eBay for clients who prefer to entrust the entire process to us. You introduce the collection; we manage
              everything from there.
            </p>
            <a className="btn" href="#start">
              Start here
            </a>
          </header>
        </div>

        <div className="strip">
          <div className="wrap">
            <h2>More than an estate sale</h2>
            <p>
              We take select collections and sell each item individually on eBay, reaching collectors across the country
              and around the world.
            </p>
          </div>
        </div>

        <div className="wrap">
          <section id="how" className="section">
            <h2>How it works</h2>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className="step">
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="sell" className="section">
            <h2>What we sell</h2>
            <p>
              Our current focus is <strong>books, CDs, vinyl records, and DVDs</strong>. Our expertise grows with every
              collection we take on, so <StoreLink>visit our eBay store</StoreLink> to see what we currently have on
              consignment. We are happy to consider any collection of items permitted for sale on eBay, with an estimated
              market value of $20 or more per item, that can ship through standard mail.
            </p>
            <ul className="fit-list">
              <li>
                <strong>An estimated market value of $20 or more per item</strong>, established through recent comparable
                sales. The purchase price, the sentimental value, and the market value of an item are three distinct
                figures. We base our work solely on the market value, and we conduct that analysis for you.
              </li>
              <li>
                <strong>Arrives ready to photograph</strong>: clean and dust-free, free of heavy smoke, pests, and mold. We
                list your items as they arrive.
              </li>
              <li>
                <strong>Suitable for standard parcel shipment.</strong> As an online seller, we handle items that can be
                marketed and shipped online.
              </li>
              <li>
                <strong>Priced for efficient sale.</strong> We establish prices from recent comparable sales and reduce them
                strategically over time, with the objective of moving your items from your home to their next one as
                efficiently as possible.
              </li>
            </ul>
            <p>If you are uncertain whether your items are a fit, send photographs. We will provide a candid assessment.</p>
          </section>

          <section id="fees" className="section">
            <h2>Fees</h2>
            <ul className="fee-list">
              <li>
                <strong>An equal 50/50 division of net proceeds.</strong> Net proceeds are defined as the sale price less
                eBay fees, packaging, and other business expenses relating to your items. The remainder is divided equally.
              </li>
              <li>
                <strong>You compensate us only from the proceeds of sold items.</strong> All listing costs are absorbed
                into our share.
              </li>
              <li>
                Collection, secure storage, market research, listing preparation, buyer correspondence, professional
                packing, shipment, and full accounting are included in our share.
              </li>
            </ul>
          </section>

          <section id="terms" className="section terms">
            <h2>The terms</h2>
            <p>
              <strong>Your property remains yours.</strong> Until an item sells, it remains your property; we serve as your
              selling agents.
            </p>
            <p>
              <strong>We determine all pricing.</strong> Every price is grounded in current market data and recent sold
              listings, aligned with what buyers are actually paying. We apply strategic reductions over time to maintain
              momentum, so your items sell rather than stagnate.
            </p>
            <p>
              <strong>We issue payouts monthly via Zelle</strong>, drawn exclusively from funds eBay has released to us. We
              verify every shipment: the right item, carefully packed, to the right address. Once a parcel is with the
              carrier, delivery rests with the shipping company and the receiving address. If a sale fails at that stage,
              through buyer fraud or a parcel lost in transit, there are no proceeds to divide. We share that risk as we
              share the returns.
            </p>
            <p>
              <strong>At six months, we check in.</strong> We are happy to keep listing your items longer, especially
              ahead of a holiday season. At the six-month mark we revisit the inventory together and decide what comes
              next: we keep going, we donate items and forward the receipt to you, we liquidate with proceeds divided as
              in a standard sale, or you collect items from our Durham location by appointment. Donation receipt values
              reflect thrift store pricing, and you confirm the final value with your tax preparer.
            </p>
            <p>
              <strong>Insurance.</strong> Coverage for your property remains your responsibility. If you would like added
              peace of mind, you may confirm with your insurer whether your policy extends to items held off-site, or
              arrange additional coverage for the consignment period. All items are stored at our Durham location.
            </p>
          </section>

          <section id="faq" className="section faq">
            <h2>Frequently asked questions</h2>
            {FAQS.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <div className="answer">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </section>

          <section id="about" className="section">
            <h2>About</h2>
            <div className="about-body">
              <img
                className="about-art"
                src="/hot-pawz-square.jpg"
                alt="Hot Pawz art: an orange cat surrounded by vinyl records, books, and cameras"
                width="180"
                height="180"
                loading="lazy"
              />
              <p>
                We are Ruth and Zack, based in Durham, North Carolina. Years of estate sale experience have refined our
                understanding of what the market values, and Hot Pawz Estates applies that expertise on our clients'
                behalf. Every consignment receives our full professional attention, from the first photograph to the
                final payout. Our <StoreLink>eBay store</StoreLink> maintains a loyal following of collectors who trust
                the quality of our listings.
              </p>
            </div>
          </section>

          <section id="reviews" className="section">
            <h2>What buyers say</h2>
            <p>
              Our eBay store holds 100% positive seller feedback, with perfect 5-out-of-5 ratings for description accuracy,
              shipping speed, and communication.
            </p>
            {REVIEWS.map((quote) => (
              <blockquote key={quote} className="review">
                <p>&ldquo;{quote}&rdquo;</p>
              </blockquote>
            ))}
            <p className="attribution">Quoted from eBay buyer feedback.</p>
          </section>

          <section id="start" className="section">
            <h2>Start here</h2>
            <IntakeForm contactEmail={CONTACT_EMAIL} />
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <p className="footer-name">Hot Pawz Estates</p>
        <p>Durham, North Carolina</p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span aria-hidden="true"> &nbsp;|&nbsp; </span>
          Instagram{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            @hotpawzestates
          </a>
        </p>
        <a className="ebay-badge" href={EBAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Our eBay store">
          <img src="/ebay-logo.svg" alt="" />
        </a>
      </footer>
    </>
  );
}
