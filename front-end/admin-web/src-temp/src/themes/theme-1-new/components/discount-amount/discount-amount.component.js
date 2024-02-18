import { formatTextCurrency } from "../../../utils/helpers";

export function DiscountAmount(props) {
  const { value } = props;

  return <>-{formatTextCurrency(value)}</>;
}
