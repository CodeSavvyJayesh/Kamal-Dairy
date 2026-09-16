import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="page-loader__glass">
        <span className="page-loader__drop" />
        <span className="page-loader__drop" />
        <span className="page-loader__drop" />
      </div>
      <p>Pouring something fresh…</p>
    </div>
  );
}

export default PageLoader;
