import moment from "moment";

function DateTime(props) {
  const { value, format = "dd/MM/yyyy" } = props;
  const dateFomartted = moment(value).format(format);
  return <span>{dateFomartted}</span>;
}

export default DateTime;
