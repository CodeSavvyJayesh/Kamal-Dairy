import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaClock } from "react-icons/fa";

function Contact() {
  return (
    <div style={{ background: "#fffaf0", padding: "40px" }}>
      
      {/* HEADER */}
      <h1 style={{
        textAlign: "center",
        color: "#005f73",
        marginBottom: "40px",
        fontSize: "32px"
      }}>
        <span style={{ color: "#e63946" }}>•</span> Hold the Line, Please! <span style={{ color: "#e63946" }}>•</span>
      </h1>


      {/* LOCATIONS + MAP */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "30px"
      }}>

        {/* LEFT SIDE LOCATIONS */}
        <div style={{ flex: 1 }}>
          
          {[
            {
              title: "MARINE LINES",
              addr: "261/63, Shamaldas Gandhi Marg, Marine Lines, Mumbai - 400002",
              time: "Mon - Sun, 08 am - 12:00 am",
              phone: "+91 9970469894",
              whatsapp: "9970469894",
            },
            {
              title: "GHATKOPAR",
              addr: "Shop number 12/13, Jayant Villa, Tilak Rd, Pant Nagar, Ghatkopar East, Mumbai",
              time: "Mon - Sun, 09 am - 7:30 pm",
              phone: "+91 9970469894",
              whatsapp: " 9970469894",
            },
            {
              title: "BORIVALI",
              addr: "Parsi Dairy Farm, Shop No.8/9 Prasanna Jeevan CHSL, Chandavarkar Road, Borivali West, Mumbai - 400092",
              time: "Mon - Sun, 08 am - 12:30 am",
              phone: "+91 9970469894",
              whatsapp: "+91 9970469894",
            },
            {
              title: "DAIRYLAND PARLOUR",
              addr: "Parsi Dairy Farm, Nariman Nagar, Varsava, NH 8, Talasari, Maharashtra",
              time: "Mon - Sun, 07 am - 10:00 pm",
              phone: "++91 9970469894",
            }
          ].map((item) => (
            <div key={item.title} style={{ marginBottom: "25px" }}>
              <h3 style={{ color: "#005f73", marginBottom: "8px" }}>{item.title}</h3>

              <p><FaMapMarkerAlt /> {item.addr}</p>
              <p><FaClock /> {item.time}</p>
              <p><FaPhoneAlt /> Contact: {item.phone}</p>
              {item.whatsapp && <p><FaWhatsapp /> WhatsApp: {item.whatsapp}</p>}
            </div>
          ))}

        </div>

        {/* RIGHT SIDE MAP */}
        <img 
          src="images/map/map.png"
          alt="map"
          style={{ width: "700px",height:"600px" ,borderRadius: "10px" }}
        />

      </div>


      {/* QUERY FORM */}
      <h2 style={{
        textAlign: "center",
        color: "#005f73",
        marginTop: "50px",
        marginBottom: "20px"
      }}>
        <span style={{ color: "#e63946" }}>•</span> Your Queries <span style={{ color: "#e63946" }}>•</span>
      </h2>

      <div style={{ display: "flex", gap: "40px" }}>
        
        {/* FORM */}
        <form style={{ flex: 2 }}>
          <input placeholder="Name" style={inputBox} />
          <input placeholder="Email" style={inputBox} />
          <input placeholder="Phone number" style={inputBox} />
          <textarea placeholder="Comments" style={{ ...inputBox, height: "120px" }} />

          <button style={buttonStyle}>SUBMIT</button>
        </form>

        {/* CONTACT DETAILS */}
        <div style={{ flex: 1 }}>
          <h3>For Exports</h3>
          <p>Contact: +91 +91 9970469894</p>
          <p>Email: exports@kamalfarm.com</p>

          <h3 style={{ marginTop: "20px" }}>For Corporate Orders</h3>
          <p>Contact: ++91 9970469894</p>
          <p>Email: corporates@kamalfarm.com</p>

          <h3 style={{ marginTop: "20px" }}>For Jobs</h3>
          <p>Email: hr@kamalfarm.com</p>
        </div>

      </div>

    </div>
  );
}

const inputBox = {
  width: "90%",
  padding: "13px",
  marginBottom: "12px",
  border: "3px solid #ccc",
  borderRadius: "6px"
};

const buttonStyle = {
  background: "#0077b6",
  color: "white",
  border: "none",
  padding: "10px 25px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px"
};

export default Contact;
