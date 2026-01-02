import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const locations = [
    {
      title: "MARINE LINES",
      addr: "261/63, Shamaldas Gandhi Marg, Marine Lines, Mumbai - 400002",
      time: "Mon - Sun, 08 am - 12:00 am",
      phone: "+91 9970469894",
      whatsapp: "9970469894",
    },
    {
      title: "GHATKOPAR",
      addr:
        "Shop number 12/13, Jayant Villa, Tilak Rd, Pant Nagar, Ghatkopar East, Mumbai",
      time: "Mon - Sun, 09 am - 7:30 pm",
      phone: "+91 9970469894",
      whatsapp: "9970469894",
    },
    {
      title: "BORIVALI",
      addr:
        "Parsi Dairy Farm, Shop No.8/9 Prasanna Jeevan CHSL, Chandavarkar Road, Borivali West, Mumbai - 400092",
      time: "Mon - Sun, 08 am - 12:30 am",
      phone: "+91 9970469894",
      whatsapp: "9970469894",
    },
    {
      title: "DAIRYLAND PARLOUR",
      addr:
        "Parsi Dairy Farm, Nariman Nagar, Varsava, NH 8, Talasari, Maharashtra",
      time: "Mon - Sun, 07 am - 10:00 pm",
      phone: "+91 9970469894",
    },
  ];

  return (
    <div className="contact-page">
      {/* HEADER */}
      <h1 className="contact-title">
        <span>•</span> Hold the Line, Please! <span>•</span>
      </h1>

      {/* LOCATIONS + MAP */}
      <div className="contact-layout">
        <div className="contact-locations">
          {locations.map((item) => (
            <div className="location-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>
                <FaMapMarkerAlt /> {item.addr}
              </p>
              <p>
                <FaClock /> {item.time}
              </p>
              <p>
                <FaPhoneAlt /> {item.phone}
              </p>
              {item.whatsapp && (
                <p>
                  <FaWhatsapp /> {item.whatsapp}
                </p>
              )}
            </div>
          ))}
        </div>

        <img
          src="images/map/map.png"
          alt="Delivery locations map"
          className="contact-map"
        />
      </div>

      {/* QUERY SECTION */}
      <h2 className="query-title">
        <span>•</span> Your Queries <span>•</span>
      </h2>

      <div className="contact-form-layout">
        <form className="contact-form">
          <input placeholder="Name" />
          <input placeholder="Email" />
          <input placeholder="Phone number" />
          <textarea placeholder="Comments" />
          <button type="submit">SUBMIT</button>
        </form>

        <div className="contact-info">
          <h3>For Exports</h3>
          <p>📞 +91 9970469894</p>
          <p>✉ exports@kamalfarm.com</p>

          <h3>For Corporate Orders</h3>
          <p>📞 +91 9970469894</p>
          <p>✉ corporates@kamalfarm.com</p>

          <h3>For Jobs</h3>
          <p>✉ hr@kamalfarm.com</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;