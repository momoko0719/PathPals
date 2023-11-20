import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete from "use-places-autocomplete";

const libraries = ['places']

export default function Create() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: libraries
  });

  const [path, setPath] = useState({
    path_name: '',
    description: '',
    places: []
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading</div>;
  }

  const updatePathName = (e) => {
    let newName = e.target.value;
    setPath({
      ...path,
      path_name: newName
    })
  };

  const updateDescription = (e) => {
    let newDescr = e.target.value;
    setPath({
      ...path,
      description: newDescr
    })
  };

  return (
    <div className='create-container row'>
      <div className='path-editor col'>
        <div>
          <label className='form-label' htmlFor='path_name'>Path Name</label>
          <input className="form-control" id='path_name' type="text" placeholder="Enter Path Name" onBlur={updatePathName} />
        </div>
        <div>
          <label className='form-label' htmlFor='path_name'>Path Name</label>
          <input className="form-control" id='path_name' type="text" placeholder="Enter Path Name" onBlur={updateDescription} />
        </div>
        <div>
          <label className='form-label' htmlFor='path_name'>Path Name</label>
          <PlacesAutocomplete />
        </div>
      </div>
      <div className='path-preview col'>
        This is a preview to your path!
        {path.path_name !== '' && <li>{path.path_name}</li>}
        {path.description !== '' && <li>{path.description}</li>}
        {path.places.length > 0 && <li>{path.places}</li>}
      </div>
    </div>
  );
}

function PlacesAutocomplete() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When the user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </li>
    );
  });

  return (
    <div>
      <input
        className='form-control'
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search for places"
      />
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
}