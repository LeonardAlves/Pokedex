import { TYPE_COLORS } from "../constants/types";
import "./TypeBadge.css";

function TypeBadge({ type }) {
  return (
    <span
      className="type-badge"
      style={{ backgroundColor: TYPE_COLORS[type] || "#888" }}
    >
      {type}
    </span>
  );
}

export default TypeBadge;