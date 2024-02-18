import { ReserveStatus, STATUS_ALL_RESERVE } from "../../../../../../constants/reserve.constants";

function TitleFilterStatus(props) {
  const { id, value, statusSelected, title, onClickStatus, totalAllStatus, requesting, titleColor } = props;

  const getTotalItems = () => {
    switch (value) {
      case ReserveStatus.Cancelled:
        return totalAllStatus?.cancelled;
      case ReserveStatus.WaitToConfirm:
        return totalAllStatus?.waitToConfirm;
      case ReserveStatus.Confirmed:
        return totalAllStatus?.confirmed;
      case ReserveStatus.Completed:
        return totalAllStatus?.serving + totalAllStatus?.completed;
      case STATUS_ALL_RESERVE:
        return totalAllStatus?.all;
      default:
        return 0;
    }
  };

  return (
    <div
      id={id}
      className={`item-filter-reservation ${
        statusSelected === value && !requesting ? "item-filter-reservation--is-selected" : ""
      }`}
      onClick={() => onClickStatus(value)}
    >
      <div>
        <span
          className="item-filter-reservation__title"
          style={statusSelected === value && !requesting ? { color: titleColor } : {}}
        >{`${title}`}</span>
        <span
          className="item-filter-reservation__title"
          style={
            statusSelected === value && !requesting
              ? { visibility: "unset", color: titleColor }
              : { visibility: "hidden" }
          }
        >
          {` (${getTotalItems()})`}
        </span>
      </div>
      <hr
        className="item-filter-reservation__divide"
        style={statusSelected === value ? { borderTopColor: titleColor } : {}}
      />
    </div>
  );
}

export default TitleFilterStatus;
