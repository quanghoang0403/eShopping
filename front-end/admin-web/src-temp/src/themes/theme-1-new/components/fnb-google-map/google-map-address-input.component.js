import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { useMediaQuery } from "react-responsive";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { CloseCircleBlackIcon, LocationOutlineIcon } from "../../assets/icons.constants";
import { FnbInput } from "../fnb-input/fnb-input.component";
import "./google-map-address-input.component.scss";

const { forwardRef, useImperativeHandle } = React;

export const GooglePlacesAutocompleteInput = forwardRef((props, ref) => {
  const { onSelectLocation, onEmptyLocation, placeholder, initLocation, maxLength = 100, onErrorDataLocation } = props;
  const [isError, setIsError] = useState(false);
  const isMaxWidth428 = useMediaQuery({ maxWidth: 428 });

  useEffect(() => {
    if (initLocation) {
      handleSelect({ description: initLocation });
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
    onEmptyLocation(value);
    if (!value) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    if (onErrorDataLocation) {
        if (status === 'ZERO_RESULTS') {
            onErrorDataLocation(true);
        }else{
            onErrorDataLocation(false);
        }
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
            <Col span={isMaxWidth428 ? 3 : 2}>
              <div className="d-flex icon-box">
                <span className="icon-location">
                  <LocationOutlineIcon />
                </span>
              </div>
            </Col>
            <Col span={isMaxWidth428 ? 21 : 22}>
              <div className="address-box">
                <p className="mb-0 street-text text-overflow">{main_text}</p>
                <p className="mb-0 ward-text text-overflow">{secondary_text}</p>
              </div>
            </Col>
          </Row>
        </div>
      );
    });

  return (
    <div ref={refClickOutside}>
      <FnbInput
        maxLength={maxLength}
        className={`fnb-input select-address-input ${isError && "error-address-input"}`}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        allowClear={{ clearIcon: <CloseCircleBlackIcon /> }}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <div className="address-popover">{renderSuggestions()}</div>}
    </div>
  );
});
