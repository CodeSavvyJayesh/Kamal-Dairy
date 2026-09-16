import "./ProductCardSkeleton.css";

function ProductCardSkeleton() {
  return (
    <div className="pskel kd-card" aria-hidden="true">
      <div className="kd-skel pskel__media" />

      <div className="pskel__body">
        <div className="kd-skel pskel__line pskel__line--xs" />
        <div className="kd-skel pskel__line" />
        <div className="kd-skel pskel__line pskel__line--sm" />

        <div className="pskel__foot">
          <div className="kd-skel pskel__price" />
          <div className="kd-skel pskel__btn" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
