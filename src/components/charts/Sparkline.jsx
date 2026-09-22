import { useRef } from "react";
import { useWidth } from "./useWidth";
import "./Charts.css";

/** Trend line in the quiet colour, with today's point in the accent. */
function Sparkline({ values, height = 34, label }) {
  const ref = useRef(null);
  const width = useWidth(ref, 160);

  const nums = values.map((v) => Number(v) || 0);
  const max = Math.max(...nums, 0);
  const pad = 5;
  const step = nums.length > 1 ? (width - pad * 2) / (nums.length - 1) : 0;
  const y = (v) => (max === 0 ? height - pad : height - pad - (v / max) * (height - pad * 2));
  const points = nums.map((v, i) => `${pad + i * step},${y(v)}`).join(" ");
  const lastX = pad + (nums.length - 1) * step;
  const lastY = y(nums[nums.length - 1] ?? 0);

  return (
    <div className="kspark" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={label}>
        <polyline className="kspark__line" points={points} />
        {nums.length > 0 && <circle className="kspark__dot" cx={lastX} cy={lastY} r={4} />}
      </svg>
    </div>
  );
}

export default Sparkline;
