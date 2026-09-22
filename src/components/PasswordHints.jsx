import { FiCheck } from "react-icons/fi";
import { PASSWORD_RULES } from "../api/auth";

/** Live checklist under a new-password field. */
function PasswordHints({ value }) {
  return (
    <ul className="pw-hints" aria-label="Password needs">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(value || "");
        return (
          <li key={r.id} className={ok ? "is-ok" : ""}>
            <span className="pw-hints__dot" aria-hidden="true">
              {ok && <FiCheck />}
            </span>
            {r.label}
            <span className="kd-sr-only">{ok ? " – done" : " – still needed"}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordHints;
