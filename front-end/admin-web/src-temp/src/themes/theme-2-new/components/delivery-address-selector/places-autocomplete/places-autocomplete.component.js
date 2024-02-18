import { Col, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { CloseCircleIcon, LocationOutlineIcon } from "../../../assets/icons.constants";
import { FnbInput } from "../../fnb-input/fnb-input.component";
import "./places-autocomplete.style.scss";

export const PlacesAutocompleteComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { onSelectLocation, onEmptyLocation, placeholder, initLocation, initAddress } = props;
  const [isError, setIsError] = useState(false);
  const isMaxWidth428 = useMediaQuery({ maxWidth: 428 });

  useEffect(() => {
    if (initLocation) {
      handleSelect({ description: initLocation });
    }
    if (initAddress) {
      setValue(initAddress);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    setIsError(isError) {
      setIsError(isError);
    },
    clearCurrentLocation() {
      setValue(null);
      setIsError(false);
    },
    setAddress(address) {
      setValue(address);
    },
  }));

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      region: "vn",
      language: "vi",
    },
    debounce: 500,
  });

  const refClickOutside = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    const value = e.target.value;
    setValue(value);
    if (!value) {
      onEmptyLocation();
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const handleSelect = ({ description }) => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      onSelectLocation({
        center: { lat, lng },
        address: description,
      });
    });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <div className="address-popover-item" key={place_id} onClick={() => handleSelect(suggestion)}>
          <Row>
            <Col span={isMaxWidth428 ? 4 : 2}>
              <div className="d-flex icon-box">
                <span className="icon-location">
                  <LocationOutlineIcon />
                </span>
              </div>
            </Col>
            <Col span={isMaxWidth428 ? 20 : 22}>
              <div className="address-box">
                <span className="street-text text-overflow">{main_text}</span>
                <br />
                <span className="ward-text text-overflow">{secondary_text}</span>
              </div>
            </Col>
          </Row>
        </div>
      );
    });

  return (
    <div ref={refClickOutside} style={{ width: "100%" }}>
      <FnbInput
        className={`fnb-input delivery-select-address-input ${isError && "error-address-input"}`}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        allowClear={{ clearIcon: <CloseCircleIcon /> }}
        prefix={<LocationOutlineIcon />}
        maxLength={255}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <div className="delivery-address-popover">
        <div className="delivery-address-popover-scroll">
        {renderSuggestions()}
        </div>
        </div>}
    </div>
  );
});
