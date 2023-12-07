import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete from "use-places-autocomplete";

import PathDetails from './PathDetails';

const libraries = ['places'];

export default function Create({ formInfo }) {
  // loads Google places autocomplete
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: libraries
  });

  useEffect(() => {
    if(formInfo){
      console.log(formInfo);
      setPath({
        path_name: formInfo.path_name,
        description: formInfo.description,
        places: formInfo.places
      });
    }
  }, [formInfo]);

  // path that will be modified and updated
  const [path, setPath] = useState({
    path_name: '',
    description: '',
    places: [] // an array of place ids
  });

  // updates path object on user inputs
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

  const handlePlaceSelect = async (id) => {
    setPath(prevState => ({
      ...prevState,
      places: [...prevState.places, id]
    }));
  }

  const handleDelete = (placeId) => {
    const updatedPlaces = path.places.filter(place => place !== placeId);
    setPath(prevPath => ({
      ...prevPath,
      places: updatedPlaces
    }));
  };

  const handleClickDone = async () => {
    try {
      let res = await fetch('/api/paths', {
        method: "POST",
        body: JSON.stringify(path),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await statusCheck(res);
      let details = await res.json();
      console.log(details);
      // navigate to the discover page
      window.location.href = '/discover';
    } catch (err) {
      console.log(err);
    }
  }

  // message when there is an error
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  // message when it is still loading
  if (!isLoaded) {
    return <div>Loading</div>;
  }

  return (
    <div className='create container row'>
      <div className='path-editor col-6'>
        <div className='row'>
          <div className='col-10'><h2>Create Your Path</h2></div>
          <div className='col-2'>
            <button className='btn btn-success' onClick={handleClickDone}>Done</button>
          </div>
        </div>
        <div>
          <label className='form-label' htmlFor='path_name'>Path Name</label>
          <input className="form-control" id='path_name' defaultValue={formInfo ? formInfo.path_name : ""}
                  type="text" placeholder="Enter Path Name" onBlur={updatePathName} />
        </div>
        <div>
          <label className='form-label' htmlFor='description'>Description</label>
          <input className="form-control" id='description' defaultValue={formInfo ? formInfo.description : ""}
                  type="text" placeholder="Enter your thoughts to this path!" onBlur={updateDescription} />
        </div>
        <div>
          <label className='form-label' htmlFor='places'>Places</label>
          <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
        </div>
      </div>
      <div className='path-preview col-6 card'>
        {(path.path_name === '' && path.description === '' && path.places.length === 0) && <div>This is a preview to your path!</div>}
        <div className='card-content'>
          <h1 className='my-1 mx-1'>{path.path_name}</h1>
          <p className='my-1 mx-2'>{path.description}</p>
          <PathDetails path={path} onDelete={handleDelete} />
        </div>
      </div>
    </div >
  );
}

function PlacesAutocomplete({ onPlaceSelect }) {
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

  const handleSelect = (place_id) => {
    onPlaceSelect(place_id);
    setValue('');
    clearSuggestions();
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <div className='suggestion' key={place_id} onClick={() => handleSelect(place_id)}>
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </div>
    );
  });

  return (
    <div>
      <input
        className='form-control'
        id='places'
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search for places"
        autoComplete='off'
      />
      {status === "OK" && <div className='suggestions'>{renderSuggestions()}</div>}
    </div>
  );
}

async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}

