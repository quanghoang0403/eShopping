import ReserveTableContent from "./ReserveTableContent";
import ReserveTableHeader from "./ReserveTableHeader";
export default function ReserveTableWrapper(props) {
  return (
    <div className="reserve-table-wrapper">
      <ReserveTableHeader {...props} />
      <ReserveTableContent {...props} />
    </div>
  );
}
