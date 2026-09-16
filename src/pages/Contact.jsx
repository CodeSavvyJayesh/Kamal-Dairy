import { useState } from "react";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import "./Contact.css";

const LOCATIONS = [
  {
    title: "Marine Lines",
    addr: "261/63, Shamaldas Gandhi Marg, Marine Lines, Mumbai 400002",
    time: "Mon – Sun, 8:00 AM – 12:00 AM",
    phone: "+91 99704 69894",
    whatsapp: "9970469894",
  },
  {
    title: "Ghatkopar",
    addr: "Shop 12/13, Jayant Villa, Tilak Rd, Pant Nagar, Ghatkopar East, Mumbai",
    time: "Mon – Sun, 9:00 AM – 7:30 PM",
    phone: "+91 99704 69894",
    whatsapp: "9970469894",
  },
  {
    title: "Borivali",
    addr:
      "Shop 8/9, Prasanna Jeevan CHSL, Chandavarkar Road, Borivali West, Mumbai 400092",
    time: "Mon – Sun, 8:00 AM – 12:30 AM",
    phone: "+91 99704 69894",
    whatsapp: "9970469894",
  },
  {
    title: "Dairyland Parlour",
    addr: "Nariman Nagar, Varsava, NH 8, Talasari, Maharashtra",
    time: "Mon – Sun, 7:00 AM – 10:00 PM",
    phone: "+91 99704 69894",
  },
];

const DESKS = [
  { title: "Exports", phone: "+91 99704 69894", email: "exports@kamalfarm.com" },
  { title: "Corporate orders", phone: "+91 99704 69894", email: "corporates@kamalfarm.com" },
  { title: "Careers", email: "hr@kamalfarm.com" },
];

const EMPTY = { name: "", email: "", phone: "", message: "" };

function Contact() {
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      // Goes through api/client now, so backend error messages actually surface
      // instead of a generic "Failed to send query" alert.
      await api("/api/contact", { method: "POST", body: form });

      toast.success("Thanks! We'll get back to you shortly.");
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Get in touch</span>
          <h1>Hold the line, please</h1>
          <p>Four outlets across Mumbai, and a real person at the end of every message.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        <section className="contact__stores">
          <div className="contact__locations">
            {LOCATIONS.map((item) => (
              <article className="store kd-card kd-card--hover" key={item.title}>
                <h3>{item.title}</h3>

                <p className="store__row">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span>{item.addr}</span>
                </p>

                <p className="store__row">
                  <FaClock aria-hidden="true" />
                  <span>{item.time}</span>
                </p>

                <div className="store__actions">
                  <a
                    className="kd-btn kd-btn--ghost kd-btn--sm"
                    href={`tel:${item.phone.replace(/\s/g, "")}`}
                  >
                    <FaPhoneAlt aria-hidden="true" /> Call
                  </a>

                  {item.whatsapp && (
                    <a
                      className="kd-btn kd-btn--ghost kd-btn--sm"
                      href={`https://wa.me/91${item.whatsapp}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <FaWhatsapp aria-hidden="true" /> WhatsApp
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <figure className="contact__map">
            <img
              src="/images/map/map.png"
              alt="Map of Kamal Dairy delivery locations across Mumbai"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="contact__query">
          <div className="contact__form-wrap kd-panel">
            <h2>Send us a message</h2>
            <p className="contact__form-sub">
              Questions about an order, a bulk enquiry, or just feedback — we read
              everything.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="contact__grid">
                <label className="kd-field">
                  <span className="kd-label">Name</span>
                  <input
                    className="kd-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="kd-field">
                  <span className="kd-label">Email</span>
                  <input
                    className="kd-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="kd-field contact__full">
                  <span className="kd-label">Phone</span>
                  <input
                    className="kd-input"
                    name="phone"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="kd-field contact__full">
                  <span className="kd-label">Message</span>
                  <textarea
                    className="kd-textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </label>
              </div>

              {error && <p className="kd-alert">{error}</p>}

              <button
                className="kd-btn kd-btn--primary kd-btn--lg"
                type="submit"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <span className="kd-spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          </div>

          <aside className="contact__desks">
            {DESKS.map((desk) => (
              <div className="desk kd-card" key={desk.title}>
                <h3>{desk.title}</h3>
                {desk.phone && (
                  <a href={`tel:${desk.phone.replace(/\s/g, "")}`}>{desk.phone}</a>
                )}
                <a href={`mailto:${desk.email}`}>{desk.email}</a>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </>
  );
}

export default Contact;
