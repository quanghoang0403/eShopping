import { languageCode } from "../../../../../../constants/language.constants";
import ExampleInstructionEN from "./example-instruction-en.component";
import ExampleInstructionVI from "./example-instruction-vi.component";

export const TYPE_EXAMPLE = {
  PRODUCT: "product",
  ORDER: "order",
  BOTH: "both",
};

function ExampleInstruction(props) {
  const { language, type } = props;
  return (
    <>
      {language === languageCode.en ? (
        <ExampleInstructionEN TYPE_EXAMPLE={TYPE_EXAMPLE} type={type} />
      ) : (
        <ExampleInstructionVI TYPE_EXAMPLE={TYPE_EXAMPLE} type={type} />
      )}
    </>
  );
}

export default ExampleInstruction;
