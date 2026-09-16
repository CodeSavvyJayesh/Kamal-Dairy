import { FiClock, FiDroplet, FiPackage, FiShield } from "react-icons/fi";
import "./WhyChooseUs.css";

const POINTS = [
  {
    icon: <FiDroplet />,
    title: "100% Farm Fresh",
    desc: "Sourced every morning, direct from dairies we have worked with for decades.",
  },
  {
    icon: <FiClock />,
    title: "Same-Day Delivery",
    desc: "Order by midnight, and it is at your door before the kettle boils.",
  },
  {
    icon: <FiShield />,
    title: "Premium Quality",
    desc: "No preservatives, no shortcuts. Cold chain maintained end to end.",
  },
  {
    icon: <FiPackage />,
    title: "Hygienic Packaging",
    desc: "Sealed, tamper-evident and insulated so it arrives exactly as it left.",
  },
];

function WhyChooseUs() {
  return (
    <section className="kd-section why">
      <div className="kd-section-head">
        <span className="kd-eyebrow">Why Kamal Dairy</span>
        <h2>Four decades of getting milk right</h2>
        <p>
          The unglamorous things — sourcing, cold chain, timing — done properly,
          every single day.
        </p>
      </div>

      <div className="why__grid">
        {POINTS.map((item) => (
          <article className="why__card kd-card kd-card--hover" key={item.title}>
            <span className="why__icon" aria-hidden="true">
              {item.icon}
            </span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
