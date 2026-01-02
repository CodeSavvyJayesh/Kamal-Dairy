import "./WhyChooseUs.css";

function WhyChooseUs() {
  const points = [
    {
      title: "100% Farm Fresh",
      desc: "Milk sourced directly from trusted brands.",
    },
    {
      title: "Same-Day Delivery",
      desc: "Delivered fresh to your doorstep daily.",
    },
    {
      title: "Premium Quality",
      desc: "No preservatives. Only pure dairy goodness.",
    },
    {
      title: "Hygienic Packaging",
      desc: "Every product packed with utmost care.",
    },
  ];

  return (
    <section className="why-choose-us">
      <h2 className="why-title">Why Choose Kamal Dairy?</h2>

      <div className="why-grid">
        {points.map((item, i) => (
          <div className="choose-card" key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;