import { useState, useMemo } from "react";
import {
  Search, Star, ShieldCheck, Compass, CalendarCheck, PlusCircle, User, ChevronLeft,
  CheckCircle2, Lock, GraduationCap, BadgeCheck, Wallet, Camera, Palette, Laptop,
  Truck, PenLine, Minus, Plus, Flag, Clock,
} from "lucide-react";

/* ---------- design tokens ---------- */
const C = {
  ink: "#1B1744", violet: "#6C4BF4", coral: "#FF7A59", amber: "#FFC145", teal: "#1FA89A",
  mist: "#F2F0FF", line: "#E4E1F5", mute: "#5E5A85", paper: "#FBFAFF", red: "#C2462A",
};
const CATS = {
  Tutoring: { icon: GraduationCap, bg: "#E9E3FF", fg: "#5236D6" },
  Design: { icon: Palette, bg: "#FFE5DD", fg: "#C2462A" },
  Photo: { icon: Camera, bg: "#D6F3EF", fg: "#12756B" },
  Tech: { icon: Laptop, bg: "#DCE6FF", fg: "#2A4BB8" },
  Moving: { icon: Truck, bg: "#FFF0CC", fg: "#8A5E00" },
  Writing: { icon: PenLine, bg: "#F3DFFA", fg: "#8A2FB0" },
};
const UNITS = { hr: "hour", job: "job", session: "session", doc: "document", project: "project" };
const FEE = 0.12;
const BLOCK = /\b(graded|do|doing|complete|completing|finish|write|writing|take|taking)\s+(my|your|their|the|an?)?\s*(assignments?|homework|exams?|quizzes|quiz|essays?|papers?|dissertation|thesis)\b/i;
const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

/* ---------- seed data ---------- */
const SEED = [
  { id: 1, title: "Statistics and R tutoring", seller: "Maya R.", major: "Psychology, year 3", cat: "Tutoring", price: 18, unit: "hr", rating: 4.9, count: 32,
    about: "I explain concepts step by step using your own course notes. Great for intro stats, regression and R basics.",
    includes: ["One-on-one session on campus or by video", "Practice problems matched to your course", "Short recap notes after each session"],
    reviews: [{ who: "Chloe T.", stars: 5, text: "Finally understood p-values. Maya is patient and clear." }, { who: "Ben A.", stars: 5, text: "Two sessions got me ready for my midterm." }] },
  { id: 2, title: "Logo and poster design", seller: "Dev K.", major: "Visual arts, year 2", cat: "Design", price: 25, unit: "project", rating: 4.8, count: 21,
    about: "Clean, bold designs for club events, side projects and small businesses. Delivered as print and web files.",
    includes: ["Two concepts to choose from", "Two rounds of changes", "Files for print and social media"],
    reviews: [{ who: "Rin S.", stars: 5, text: "Our film society poster got so many compliments." }, { who: "Tomas L.", stars: 4, text: "Quick turnaround and easy to work with." }] },
  { id: 3, title: "Graduation portraits", seller: "Lena S.", major: "Journalism, year 4", cat: "Photo", price: 50, unit: "session", rating: 5.0, count: 14,
    about: "Relaxed 45-minute portrait shoot around campus. I help you pose so you look like yourself.",
    includes: ["45 minutes at a campus spot you pick", "15 edited photos within 3 days", "Full-resolution downloads"],
    reviews: [{ who: "Aisha M.", stars: 5, text: "Best grad photos, and I was not nervous at all." }, { who: "Jon P.", stars: 5, text: "Lena had great ideas for locations." }] },
  { id: 4, title: "Laptop fixes and setup", seller: "Omar T.", major: "Computer science, year 3", cat: "Tech", price: 15, unit: "job", rating: 4.7, count: 40,
    about: "Slow laptop, broken login, Wi-Fi trouble or a new machine to set up. I fix it or tell you straight if it needs a shop.",
    includes: ["Diagnosis of the problem", "Cleanup, updates and security check", "Tips so it stays fast"],
    reviews: [{ who: "Priya N.", stars: 5, text: "My laptop felt brand new after an hour." }, { who: "Sam W.", stars: 4, text: "Honest and fair price." }] },
  { id: 5, title: "Dorm move-in and move-out help", seller: "Jake P.", major: "Kinesiology, year 2", cat: "Moving", price: 20, unit: "hr", rating: 4.8, count: 27,
    about: "Strong, careful and on time. I help carry boxes and furniture and can bring a hand truck.",
    includes: ["Carrying and loading help", "Hand truck included", "Stairs are no problem"],
    reviews: [{ who: "Nora K.", stars: 5, text: "Moved my whole room in under two hours." }, { who: "Eli D.", stars: 5, text: "Careful with my furniture." }] },
  { id: 6, title: "CV and cover letter review", seller: "Priya N.", major: "Business, year 4", cat: "Writing", price: 12, unit: "doc", rating: 4.9, count: 58,
    about: "I have helped over 50 students land internships. I improve your wording and layout and keep your voice.",
    includes: ["Line-by-line feedback", "Layout and wording fixes", "One follow-up check within 48 hours"],
    reviews: [{ who: "Marcus B.", stars: 5, text: "Got two interview calls the week after." }, { who: "Hana O.", stars: 5, text: "Clear, kind and very fast." }] },
  { id: 7, title: "Spanish conversation practice", seller: "Sam W.", major: "Linguistics, year 3", cat: "Tutoring", price: 14, unit: "hr", rating: 4.8, count: 19,
    about: "Relaxed, spoken Spanish practice at your level. We talk about real things and I correct as we go.",
    includes: ["Spoken practice at your level", "Gentle corrections", "Vocabulary list after each session"],
    reviews: [{ who: "Ivy C.", stars: 5, text: "I finally speak without freezing." }, { who: "Leo F.", stars: 4, text: "Fun and useful." }] },
  { id: 8, title: "Simple website for your club", seller: "Noah B.", major: "Information systems, year 3", cat: "Tech", price: 40, unit: "project", rating: 4.6, count: 9,
    about: "A clean one-page site with your events, contact form and social links, ready to share.",
    includes: ["Mobile-friendly one-page site", "Your logo and colors", "Short guide to update it yourself"],
    reviews: [{ who: "Debate Club", stars: 5, text: "Up in three days, exactly what we needed." }] },
];
const SEED_BOOKINGS = [
  { id: 101, listingId: 6, title: "CV and cover letter review", seller: "Priya N.", cat: "Writing", when: "Tomorrow, 1:00 pm", total: 12, status: "held", rating: 0 },
];

/* ---------- small pieces ---------- */
const Stars = ({ n, size = 14 }) => (
  <span style={{ display: "inline-flex", gap: 1 }} aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size} color={C.amber} fill={i <= Math.round(n) ? C.amber : "none"} strokeWidth={2} />
    ))}
  </span>
);
const Avatar = ({ name, cat, size = 44 }) => (
  <div aria-hidden="true" style={{ width: size, height: size, borderRadius: "50%", background: CATS[cat]?.fg || C.violet, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.4, flex: "none" }}>
    {name[0]}
  </div>
);
const CatTile = ({ cat, size = 52 }) => {
  const M = CATS[cat]; const I = M.icon;
  return (
    <div aria-hidden="true" style={{ width: size, height: size, borderRadius: 16, background: M.bg, display: "grid", placeItems: "center", flex: "none" }}>
      <I size={size * 0.46} color={M.fg} />
    </div>
  );
};
const priceText = (l) => `${money(l.price)}/${l.unit}`;

/* ---------- welcome ---------- */
function Welcome({ onEnter }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const nameFrom = (e) => {
    const f = e.split("@")[0].split(/[._-]/)[0] || "Student";
    return f[0].toUpperCase() + f.slice(1);
  };
  const submit = () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.(edu|ac\.[a-z]{2,}|edu\.[a-z]{2,})$/.test(e)) {
      setErr("Use your school email, like name@university.edu.");
      return;
    }
    setErr(""); setOk(true);
    setTimeout(() => onEnter(nameFrom(e), e), 900);
  };
  const chips = [
    ["Tutoring", 0, 6, -6], ["Design", 128, 0, 4], ["Photos", 236, 34, -3],
    ["Tech help", 18, 66, 3], ["Moving", 150, 72, -5],
  ];
  const catKey = { "Tutoring": "Tutoring", "Design": "Design", "Photos": "Photo", "Tech help": "Tech", "Moving": "Moving" };
  return (
    <div style={{ background: C.ink, color: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: 24, overflowY: "auto" }}>
      <div className="display" style={{ fontSize: 18, fontWeight: 700 }}>CampusConnect</div>
      <div style={{ position: "relative", height: 130, marginTop: 24 }} aria-hidden="true">
        {chips.map(([label, left, top, rot]) => {
          const M = CATS[catKey[label]]; const I = M.icon;
          return (
            <div key={label} style={{ position: "absolute", left, top, transform: `rotate(${rot}deg)`, background: M.bg, color: M.fg, padding: "9px 14px", borderRadius: 999, fontWeight: 700, fontSize: 15, display: "flex", gap: 7, alignItems: "center" }}>
              <I size={16} /> {label}
            </div>
          );
        })}
      </div>
      <h1 className="display" style={{ fontSize: 36, lineHeight: 1.08, margin: "10px 0 12px", fontWeight: 700 }}>Skills on campus, sold by students.</h1>
      <p style={{ margin: 0, color: "#D6D2F5", fontSize: 16, lineHeight: 1.45 }}>Book tutoring, design, photos and more from verified students at your school.</p>
      <div style={{ flex: 1, minHeight: 20 }} />
      <div style={{ background: "#fff", color: C.ink, borderRadius: 22, padding: 18 }}>
        {ok ? (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 4px", fontWeight: 700 }}>
            <CheckCircle2 color={C.teal} /> Student email verified. Opening your campus...
          </div>
        ) : (
          <>
            <label htmlFor="email" style={{ fontWeight: 700, fontSize: 14 }}>Student email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@university.edu" style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "13px 14px", fontSize: 16, borderRadius: 12, border: `1.5px solid ${err ? C.red : C.line}`, background: C.paper, color: C.ink }} />
            {err && <div role="alert" style={{ color: C.red, fontSize: 14, marginTop: 6 }}>{err}</div>}
            <button className="btn" style={{ marginTop: 12 }} onClick={submit}>Verify and join</button>
            <button className="link" style={{ display: "block", margin: "12px auto 0" }} onClick={() => onEnter("Alex", "alex@university.edu")}>Try the demo without signing up</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- browse ---------- */
function Browse({ user, listings, onOpen, goSell }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const shown = listings.filter((l) =>
    (cat === "All" || l.cat === cat) &&
    (l.title + " " + l.seller + " " + l.cat).toLowerCase().includes(q.toLowerCase().trim())
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20, color: C.mute, fontSize: 14 }}>
        <BadgeCheck size={16} color={C.teal} /> Verified student
      </div>
      <h1 className="display" style={{ fontSize: 28, lineHeight: 1.15, margin: "6px 0 14px" }}>Hi {user.name}, what do you need help with?</h1>
      <div style={{ position: "relative" }}>
        <Search size={18} color={C.mute} style={{ position: "absolute", left: 14, top: 14 }} />
        <input aria-label="Search services" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tutoring, design, photos"
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px 13px 42px", fontSize: 16, borderRadius: 14, border: `1.5px solid ${C.line}`, background: "#fff", color: C.ink }} />
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 0 6px" }}>
        {["All", ...Object.keys(CATS)].map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            style={{ flex: "none", padding: "8px 16px", borderRadius: 999, fontWeight: 600, fontSize: 14, border: `1.5px solid ${cat === c ? C.ink : C.line}`, background: cat === c ? C.ink : "#fff", color: cat === c ? "#fff" : C.ink }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
        {shown.map((l) => (
          <button key={l.id} onClick={() => onOpen(l.id)} className="row" style={{ textAlign: "left" }}>
            <CatTile cat={l.cat} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25 }}>{l.title}</div>
              <div style={{ color: C.mute, fontSize: 13, margin: "3px 0 5px" }}>{l.seller}, {l.major}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                {l.count > 0 ? (<><Star size={14} color={C.amber} fill={C.amber} /><b>{l.rating.toFixed(1)}</b><span style={{ color: C.mute }}>({l.count})</span></>) : <span style={{ color: C.violet, fontWeight: 700 }}>New</span>}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>{priceText(l)}</div>
          </button>
        ))}
        {shown.length === 0 && (
          <div style={{ textAlign: "center", padding: "36px 12px", color: C.mute }}>
            <div style={{ fontWeight: 700, color: C.ink, fontSize: 17, marginBottom: 6 }}>No services match yet</div>
            Try another word or category, or offer this service yourself.
            <button className="btn" style={{ marginTop: 14 }} onClick={goSell}>Post a service</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- detail ---------- */
function Detail({ l, onBack, onBook }) {
  return (
    <Overlay onBack={onBack} title="Service" footer={
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div><div style={{ fontWeight: 700, fontSize: 20 }}>{money(l.price)}</div><div style={{ color: C.mute, fontSize: 13 }}>per {UNITS[l.unit]}</div></div>
        <button className="btn" style={{ flex: 1 }} onClick={onBook}>Book now</button>
      </div>}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
        <CatTile cat={l.cat} size={64} />
        <div>
          <h1 className="display" style={{ fontSize: 24, lineHeight: 1.15, margin: 0 }}>{l.title}</h1>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0", padding: 14, background: C.mist, borderRadius: 16 }}>
        <Avatar name={l.seller} cat={l.cat} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{l.seller}</div>
          <div style={{ color: C.mute, fontSize: 13 }}>{l.major}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.teal, fontWeight: 600, fontSize: 13 }}><BadgeCheck size={16} /> Verified</div>
      </div>
      <p style={{ lineHeight: 1.5, margin: "0 0 18px" }}>{l.about}</p>
      <h2 className="display" style={{ fontSize: 18, margin: "0 0 8px" }}>What you get</h2>
      <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {l.includes.map((x) => (<li key={x} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><CheckCircle2 size={18} color={C.teal} style={{ flex: "none", marginTop: 2 }} />{x}</li>))}
      </ul>
      <h2 className="display" style={{ fontSize: 18, margin: "0 0 8px" }}>Reviews {l.count > 0 && <span style={{ color: C.mute, fontFamily: "inherit", fontSize: 14, fontWeight: 500 }}>({l.rating.toFixed(1)} from {l.count})</span>}</h2>
      {l.reviews.length === 0 && <p style={{ color: C.mute }}>No reviews yet. Be the first to book.</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {l.reviews.map((r, i) => (
          <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 12, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><b style={{ fontSize: 14 }}>{r.who}</b><Stars n={r.stars} size={13} /></div>
            <div style={{ fontSize: 14, lineHeight: 1.45 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </Overlay>
  );
}

/* ---------- booking ---------- */
function Book({ l, onBack, onPay }) {
  const days = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { wk: d.toLocaleDateString("en-US", { weekday: "short" }), num: d.getDate(), full: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
  }), []);
  const slots = ["10:00 am", "1:00 pm", "4:30 pm", "7:00 pm"];
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(1);
  const [qty, setQty] = useState(1);
  const total = l.price * qty;
  const pill = (on) => ({ padding: "10px 0", borderRadius: 14, fontWeight: 600, border: `1.5px solid ${on ? C.violet : C.line}`, background: on ? C.mist : "#fff", color: C.ink, outline: on ? `1px solid ${C.violet}` : "none" });
  return (
    <Overlay onBack={onBack} title="Book" footer={
      <>
        <button className="btn" onClick={() => onPay({ qty, total, when: `${days[day].full}, ${slots[slot]}` })}>Pay {money(total)} into escrow</button>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", color: C.mute, fontSize: 13, marginTop: 10 }}><Lock size={14} /> Held safely until you confirm the work is done</div>
      </>}>
      <h1 className="display" style={{ fontSize: 24, margin: "8px 0 2px" }}>{l.title}</h1>
      <div style={{ color: C.mute, marginBottom: 20 }}>with {l.seller}</div>
      <h2 className="display" style={{ fontSize: 17, margin: "0 0 8px" }}>Pick a day</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 20 }}>
        {days.map((d, i) => (
          <button key={i} aria-pressed={day === i} onClick={() => setDay(i)} style={pill(day === i)}>
            <div style={{ fontSize: 12, color: C.mute }}>{d.wk}</div><div style={{ fontSize: 18 }}>{d.num}</div>
          </button>
        ))}
      </div>
      <h2 className="display" style={{ fontSize: 17, margin: "0 0 8px" }}>Pick a time</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {slots.map((s, i) => (<button key={s} aria-pressed={slot === i} onClick={() => setSlot(i)} style={pill(slot === i)}>{s}</button>))}
      </div>
      {l.unit === "hr" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="display" style={{ fontSize: 17, margin: 0 }}>How many hours?</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button aria-label="Fewer hours" className="round" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={18} /></button>
            <b style={{ fontSize: 18, minWidth: 18, textAlign: "center" }}>{qty}</b>
            <button aria-label="More hours" className="round" onClick={() => setQty(Math.min(6, qty + 1))}><Plus size={18} /></button>
          </div>
        </div>
      )}
      <div style={{ background: C.mist, borderRadius: 16, padding: 14, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{money(l.price)} x {qty} {UNITS[l.unit]}{qty > 1 ? "s" : ""}</span><b>{money(total)}</b></div>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.mute, fontSize: 14 }}><span>Extra fees for you</span><span>{money(0)}</span></div>
        <div style={{ height: 1, background: C.line }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}><b>Total</b><b>{money(total)}</b></div>
      </div>
    </Overlay>
  );
}

/* ---------- confirmation ---------- */
function Paid({ b, onView }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: C.ink, color: "#fff", zIndex: 6, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
      <div style={{ width: 72, height: 72, borderRadius: 24, background: C.amber, display: "grid", placeItems: "center", marginBottom: 20 }}><Lock size={34} color={C.ink} /></div>
      <h1 className="display" style={{ fontSize: 32, lineHeight: 1.1, margin: "0 0 10px" }}>{money(b.total)} is held in escrow</h1>
      <p style={{ color: "#D6D2F5", lineHeight: 1.5, margin: "0 0 24px" }}>{b.seller} has your booking for {b.when}. They only get paid after you confirm the work is done.</p>
      <button className="btn" style={{ background: "#fff", color: C.ink }} onClick={onView}>See my bookings</button>
    </div>
  );
}

/* ---------- bookings ---------- */
function Tracker({ status }) {
  const steps = ["Paid into escrow", "Work done", "Seller paid"];
  const done = status === "held" ? 1 : status === "disputed" ? 1 : 3;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", margin: "14px 0 6px" }}>
      {steps.map((s, i) => {
        const on = i < done; const flag = status === "disputed" && i === 1;
        return (
          <div key={s} style={{ textAlign: "center", position: "relative" }}>
            {i > 0 && <div style={{ position: "absolute", top: 11, left: "-50%", width: "100%", height: 3, background: i < done ? C.teal : C.line }} />}
            <div style={{ position: "relative", width: 24, height: 24, borderRadius: "50%", margin: "0 auto", background: flag ? C.coral : on ? C.teal : "#fff", border: `3px solid ${flag ? C.coral : on ? C.teal : C.line}`, display: "grid", placeItems: "center" }}>
              {on && <CheckCircle2 size={14} color="#fff" />}{flag && <Flag size={12} color="#fff" />}
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: on ? C.ink : C.mute, fontWeight: on ? 700 : 500 }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
}
function Bookings({ bookings, onRelease, onDispute, onReview, goBrowse }) {
  return (
    <div>
      <h1 className="display" style={{ fontSize: 28, margin: "20px 0 14px" }}>My bookings</h1>
      {bookings.length === 0 && (
        <div style={{ textAlign: "center", padding: "36px 12px", color: C.mute }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: 17, marginBottom: 6 }}>No bookings yet</div>
          Find a service and book your first session.
          <button className="btn" style={{ marginTop: 14 }} onClick={goBrowse}>Browse services</button>
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {bookings.map((b) => <BookingCard key={b.id} b={b} onRelease={onRelease} onDispute={onDispute} onReview={onReview} />)}
      </div>
    </div>
  );
}
function BookingCard({ b, onRelease, onDispute, onReview }) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <CatTile cat={b.cat} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700 }}>{b.title}</div>
          <div style={{ color: C.mute, fontSize: 13 }}>{b.seller}</div>
        </div>
        <b>{money(b.total)}</b>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", color: C.mute, fontSize: 13, marginTop: 10 }}><Clock size={14} /> {b.when}</div>
      <Tracker status={b.status} />
      {b.status === "held" && (
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <button className="btn" onClick={() => onRelease(b.id)}>Confirm work is done</button>
          <button className="link" onClick={() => onDispute(b.id)}>Report a problem</button>
        </div>
      )}
      {b.status === "disputed" && <div role="status" style={{ marginTop: 10, background: "#FFE5DD", color: "#7A2A14", padding: 12, borderRadius: 12, fontSize: 14, lineHeight: 1.45 }}>Payment is on hold while we review. We will message you within 24 hours.</div>}
      {b.status === "released" && b.rating === 0 && (
        <div style={{ marginTop: 10, background: C.mist, borderRadius: 14, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>How was it with {b.seller}?</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} aria-label={`${i} star${i > 1 ? "s" : ""}`} aria-pressed={stars === i} onClick={() => setStars(i)} style={{ background: "none", border: 0, padding: 2 }}>
                <Star size={28} color={C.amber} fill={i <= stars ? C.amber : "none"} />
              </button>
            ))}
          </div>
          <input aria-label="Write a short review" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a short note (optional)" style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10, border: `1.5px solid ${C.line}`, fontSize: 15, marginBottom: 8 }} />
          <button className="btn" onClick={() => onReview(b.id, stars, text)}>Send review</button>
        </div>
      )}
      {b.status === "released" && b.rating > 0 && <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}><Stars n={b.rating} /> Thanks for your review</div>}
    </div>
  );
}

/* ---------- sell ---------- */
function Sell({ user, listings, earnings, onPublish }) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Tutoring");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("hr");
  const [about, setAbout] = useState("");
  const [err, setErr] = useState("");
  const mine = listings.filter((l) => l.mine);
  const p = parseFloat(price);
  const submit = () => {
    if (title.trim().length < 4) return setErr("Add a title so buyers know what you offer.");
    if (!(p > 0)) return setErr("Enter a price greater than $0.");
    if (BLOCK.test(title + " " + about)) return setErr("Graded work like assignments, exams and quizzes can't be sold here. Offer tutoring or feedback instead.");
    setErr("");
    onPublish({ id: Date.now(), title: title.trim(), seller: user.name, major: "Verified student", cat, price: p, unit, rating: 0, count: 0, mine: true,
      about: about.trim() || "New on CampusConnect. Message me to agree on the details.",
      includes: ["Time and place agreed on campus", "Payment held safely until the work is done"], reviews: [] });
    setTitle(""); setPrice(""); setAbout("");
  };
  const field = { width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 16, borderRadius: 12, border: `1.5px solid ${C.line}`, background: "#fff", color: C.ink };
  const lab = { fontWeight: 700, fontSize: 14, display: "block", margin: "14px 0 6px" };
  return (
    <div>
      <h1 className="display" style={{ fontSize: 28, margin: "20px 0 14px" }}>Sell a service</h1>
      <div style={{ background: C.ink, color: "#fff", borderRadius: 20, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#D6D2F5", fontSize: 14 }}><Wallet size={16} /> Ready to withdraw</div>
        <div className="display" style={{ fontSize: 38, fontWeight: 700, margin: "2px 0 6px" }}>{money(earnings.available)}</div>
        <div style={{ color: "#D6D2F5", fontSize: 14 }}>{money(earnings.pending)} waiting in escrow. You keep 88% of every booking.</div>
      </div>

      <label htmlFor="t" style={lab}>What do you offer?</label>
      <input id="t" style={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calculus tutoring" />
      <span style={lab}>Category</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Object.keys(CATS).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} style={{ padding: "8px 14px", borderRadius: 999, fontWeight: 600, fontSize: 14, border: `1.5px solid ${cat === c ? C.ink : C.line}`, background: cat === c ? C.ink : "#fff", color: cat === c ? "#fff" : C.ink }}>{c}</button>
        ))}
      </div>
      <label htmlFor="p" style={lab}>Price</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input id="p" inputMode="decimal" style={{ ...field, flex: 1 }} value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="$ amount" />
        <div style={{ display: "flex", border: `1.5px solid ${C.line}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
          {["hr", "job", "session"].map((u) => (<button key={u} aria-pressed={unit === u} onClick={() => setUnit(u)} style={{ padding: "0 12px", border: 0, fontWeight: 600, background: unit === u ? C.violet : "#fff", color: unit === u ? "#fff" : C.ink }}>per {u}</button>))}
        </div>
      </div>
      {p > 0 && <div style={{ color: C.mute, fontSize: 14, marginTop: 6 }}>You earn {money(Math.round(p * (1 - FEE) * 100) / 100)} per {unit} after the 12% fee.</div>}
      <label htmlFor="a" style={lab}>Describe it</label>
      <textarea id="a" rows={3} style={{ ...field, resize: "none", fontFamily: "inherit" }} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="What will the buyer get?" />
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.mist, borderRadius: 12, padding: 12, margin: "14px 0", fontSize: 14, lineHeight: 1.45 }}>
        <ShieldCheck size={18} color={C.violet} style={{ flex: "none", marginTop: 1 }} /> Graded work like assignments, exams and quizzes can't be sold. Tutoring and feedback are welcome.
      </div>
      {err && <div role="alert" style={{ color: C.red, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{err}</div>}
      <button className="btn" onClick={submit}>Publish listing</button>
      {mine.length > 0 && (
        <>
          <h2 className="display" style={{ fontSize: 20, margin: "26px 0 10px" }}>Your listings</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {mine.map((l) => (
              <div key={l.id} className="row" style={{ cursor: "default" }}>
                <CatTile cat={l.cat} /><div style={{ flex: 1, fontWeight: 700 }}>{l.title}</div><b>{priceText(l)}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- profile ---------- */
function Profile({ user, bookings, listings, onOut }) {
  return (
    <div>
      <div style={{ textAlign: "center", margin: "28px 0 20px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.violet, color: "#fff", display: "grid", placeItems: "center", fontSize: 34, fontWeight: 700, margin: "0 auto 12px" }}>{user.name[0]}</div>
        <h1 className="display" style={{ fontSize: 26, margin: 0 }}>{user.name}</h1>
        <div style={{ color: C.mute, margin: "4px 0 8px" }}>{user.email}</div>
        <div style={{ display: "inline-flex", gap: 6, alignItems: "center", color: C.teal, fontWeight: 700, fontSize: 14 }}><BadgeCheck size={16} /> Verified student</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: C.mist, borderRadius: 16, padding: 14 }}><div className="display" style={{ fontSize: 28, fontWeight: 700 }}>{bookings.length}</div><div style={{ color: C.mute, fontSize: 14 }}>Bookings made</div></div>
        <div style={{ background: C.mist, borderRadius: 16, padding: 14 }}><div className="display" style={{ fontSize: 28, fontWeight: 700 }}>{listings.filter((l) => l.mine).length}</div><div style={{ color: C.mute, fontSize: 14 }}>Services listed</div></div>
      </div>
      <button className="btn ghost" style={{ marginTop: 24 }} onClick={onOut}>Sign out</button>
    </div>
  );
}

/* ---------- shell ---------- */
function Overlay({ title, onBack, footer, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper, zIndex: 5, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 12px 4px" }}>
        <button aria-label="Go back" onClick={onBack} className="round" style={{ border: 0, background: "transparent" }}><ChevronLeft size={24} /></button>
        <b>{title}</b>
      </div>
      <div className="scroll" style={{ padding: "0 20px 20px" }}>{children}</div>
      <div style={{ padding: "12px 20px 18px", borderTop: `1px solid ${C.line}`, background: "#fff" }}>{footer}</div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("browse");
  const [view, setView] = useState(null); // {type:'detail'|'book'|'paid', id, booking}
  const [listings, setListings] = useState(SEED);
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [earnings, setEarnings] = useState({ available: 112.5, pending: 36 });
  const [toast, setToast] = useState("");

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const open = (id) => setView({ type: "detail", id });
  const current = view && listings.find((l) => l.id === view.id);

  const pay = ({ total, when }) => {
    const b = { id: Date.now(), listingId: current.id, title: current.title, seller: current.seller, cat: current.cat, when, total, status: "held", rating: 0 };
    setBookings([b, ...bookings]);
    setView({ type: "paid", booking: b });
  };
  const release = (id) => { setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: "released" } : b))); say("Payment released to the seller"); };
  const dispute = (id) => { setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: "disputed" } : b))); say("Reported. Payment is on hold"); };
  const review = (id, stars, text) => {
    const b = bookings.find((x) => x.id === id);
    setBookings((bs) => bs.map((x) => (x.id === id ? { ...x, rating: stars } : x)));
    setListings((ls) => ls.map((l) => (l.id === b.listingId ? { ...l, count: l.count + 1, reviews: [{ who: user.name + " (you)", stars, text: text || "Great experience." }, ...l.reviews] } : l)));
    say("Review sent");
  };
  const publish = (l) => { setListings([l, ...listings]); say("Listing published"); };

  const tabs = [["browse", "Browse", Compass], ["bookings", "Bookings", CalendarCheck], ["sell", "Sell", PlusCircle], ["me", "Profile", User]];

  return (
    <div className="cc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Figtree:wght@400;500;600;700&display=swap');
        .cc-root{font-family:'Figtree',Calibri,system-ui,sans-serif;color:${C.ink};background:#E7E3FA;min-height:100vh;display:flex;align-items:center;justify-content:center}
        .cc-root *{box-sizing:border-box}
        .cc-phone{width:100%;max-width:400px;height:100vh;max-height:820px;background:${C.paper};display:flex;flex-direction:column;position:relative;overflow:hidden}
        @media (min-width:520px){.cc-phone{border-radius:34px;border:8px solid ${C.ink};height:800px}}
        .display{font-family:'Fraunces',Cambria,Georgia,serif;letter-spacing:-0.01em}
        .scroll{flex:1;overflow-y:auto}
        button{font:inherit;cursor:pointer;color:inherit}
        input,textarea{font-family:inherit}
        :focus-visible{outline:3px solid ${C.violet};outline-offset:2px}
        .btn{width:100%;padding:14px 16px;border-radius:14px;border:0;background:${C.violet};color:#fff;font-weight:700;font-size:16px}
        .btn:active{transform:scale(.99)}
        .btn.ghost{background:#fff;color:${C.ink};border:1.5px solid ${C.ink}}
        .link{background:none;border:0;color:${C.violet};font-weight:700;font-size:15px;padding:6px;text-decoration:underline}
        .round{width:40px;height:40px;border-radius:50%;border:1.5px solid ${C.line};background:#fff;display:grid;place-items:center}
        .row{width:100%;display:flex;gap:12px;align-items:center;padding:14px;border-radius:18px;border:1px solid ${C.line};background:#fff}
        button.row:active{background:${C.mist}}
        @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
      `}</style>
      <div className="cc-phone">
        {!user ? (
          <Welcome onEnter={(name, email) => setUser({ name, email })} />
        ) : (
          <>
            <div className="scroll" style={{ padding: "0 20px 24px" }}>
              {tab === "browse" && <Browse user={user} listings={listings} onOpen={open} goSell={() => setTab("sell")} />}
              {tab === "bookings" && <Bookings bookings={bookings} onRelease={release} onDispute={dispute} onReview={review} goBrowse={() => setTab("browse")} />}
              {tab === "sell" && <Sell user={user} listings={listings} earnings={earnings} onPublish={publish} />}
              {tab === "me" && <Profile user={user} bookings={bookings} listings={listings} onOut={() => { setUser(null); setTab("browse"); }} />}
            </div>
            <nav aria-label="Main" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${C.line}`, background: "#fff", padding: "6px 0 10px" }}>
              {tabs.map(([k, label, Icon]) => (
                <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined} style={{ background: "none", border: 0, display: "grid", justifyItems: "center", gap: 2, padding: "6px 0", color: tab === k ? C.violet : C.mute, fontWeight: tab === k ? 700 : 500, fontSize: 12 }}>
                  <Icon size={22} />{label}
                </button>
              ))}
            </nav>
            {view?.type === "detail" && current && <Detail l={current} onBack={() => setView(null)} onBook={() => setView({ type: "book", id: current.id })} />}
            {view?.type === "book" && current && <Book l={current} onBack={() => setView({ type: "detail", id: current.id })} onPay={pay} />}
            {view?.type === "paid" && <Paid b={view.booking} onView={() => { setView(null); setTab("bookings"); }} />}
          </>
        )}
        {toast && <div role="status" style={{ position: "absolute", left: 20, right: 20, bottom: 84, background: C.ink, color: "#fff", padding: "12px 16px", borderRadius: 14, fontWeight: 600, textAlign: "center", zIndex: 9 }}>{toast}</div>}
      </div>
    </div>
  );
}
