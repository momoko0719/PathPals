import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import Popup from "./Popup";
import PathCard from "./PathCard";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Discover({ searchTerm, userInfo, fillForm }) {
  const [paths, setPaths] = useState([]);
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState("date");
  const [sortingOrder, setSortingOrder] = useState("descending");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);

  const openModal = (path) => {
    // Check if the user is logged in
    const identityInfo = JSON.parse(sessionStorage.getItem('identityInfo'));
    if (identityInfo.status !== 'loggedin') {
      window.location.href = `${SERVER_URL}/auth/signin`;
      return null;
    }

    if (!path._id) {
      console.error('No _id property on path object:', path);
      return;
    }

    incrementPathViews(path._id);
    setSelectedPath(path);
    setModalIsOpen(true);
  };

  const incrementPathViews = async (pathId) => {
    // Convert pathId to string for comparison
    const updatedPaths = paths.map(p =>
      p._id === pathId ? { ...p, num_views: p.num_views + 1 } : p
    );
    setPaths(updatedPaths);

    const updatedFilteredPaths = filteredPaths.map(p =>
      p._id === pathId ? { ...p, num_views: p.num_views + 1 } : p
    );
    setFilteredPaths(updatedFilteredPaths);

    try {
      await fetch('/api/paths/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pathId: pathId })
      });
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const changeLikes = (id, newLikes, totalLikes) => {
    const updatedPaths = paths.map((path) =>
      path._id === id ? { ...path, num_likes: newLikes, likes: totalLikes } : path
    );
    setPaths(updatedPaths);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      height: "80vh",
      overflow: "hidden",
    },
  };

  useEffect(() => {
    fetchPaths(searchTerm);
  }, [searchTerm]);

  const fetchPaths = async () => {
    try {
      const response = await fetch("/api/paths");
      const data = await response.json();
      setPaths(data);
    } catch (error) {
      console.error("Error fetching paths:", error);
    }
  };

  // Function to sort paths
  const sortPaths = useCallback((pathsToSort) => {
    const sortedPaths = [...pathsToSort];

    switch (sortingCriteria) {
      case "likes":
        sortedPaths.sort((a, b) => {
          const likesA = a.likes.length;
          const likesB = b.likes.length;
          if (sortingOrder === "ascending") {
            return likesA - likesB;
          } else {
            return likesB - likesA;
          }
        });
        break;
      case "views":
        sortedPaths.sort((a, b) => {
          const viewsA = a.num_views;
          const viewsB = b.num_views;
          if (sortingOrder === "ascending") {
            return viewsA - viewsB;
          } else {
            return viewsB - viewsA;
          }
        });
        break;
      case "date":
        sortedPaths.sort((a, b) => {
          const dateA = new Date(a.date_created);
          const dateB = new Date(b.date_created);
          if (sortingOrder === "ascending") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        });
        break;
      default:
        // Default sorting (no sorting)
        break;
    }

    return sortedPaths;
  }, [sortingCriteria, sortingOrder]);

  useEffect(() => {
    // Filter paths based on the search term
    const filtered = paths.filter((path) => {
      const pathNameMatch = path.path_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const placesMatch = path.places.some((place) =>
        place.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return pathNameMatch || placesMatch;
    });
    const sortedPaths = sortPaths(filtered);
    setFilteredPaths(sortedPaths);
  }, [searchTerm, paths, sortingCriteria, sortingOrder, sortPaths]);

  // Function to handle sorting criteria change
  const handleSortingCriteriaChange = (criteria) => {
    if (criteria === sortingCriteria) {
      setSortingOrder((prevOrder) =>
        prevOrder === "ascending" ? "descending" : "ascending"
      );
    } else {
      setSortingCriteria(criteria);
      setSortingOrder("ascending");
    }
  };

  // Function to render sorting icons based on sorting criteria
  const renderSortingIcon = (criteria) => {
    const isActive = criteria === sortingCriteria;
    const iconClass = isActive
      ? sortingOrder === "ascending"
        ? "bi-sort-up"
        : "bi-sort-down"
      : "bi-sort-down";
    const colorClass = isActive ? "text-primary" : "text-secondary";

    return <i className={`bi ${iconClass} ${colorClass}`}></i>;
  };

  return (
    <div className="content container">
      <div className="content-controllers">
        <Controllers
          handleSortingCriteriaChange={handleSortingCriteriaChange}
          renderSortingIcon={renderSortingIcon}
        />
      </div>
      <div className="content-cards row row-cols-3">
        {filteredPaths.length === 0 && (
          <p className="text-center">No paths found</p>
        )}
        {filteredPaths.map((path, index) => (
          <div className="col" style={{ height: '200px' }} key={index}>
            <PathCard path={path} onPathClick={openModal} user={userInfo} />
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Path Details"
      >
        {selectedPath &&
          <Popup path={selectedPath} user={userInfo} setLikes={changeLikes} fillForm={fillForm} />}

        <button
          onClick={() => setModalIsOpen(false)}
          className="btn-close"
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
          }}
        >
        </button>
      </Modal>
    </div>
  );
}

function Controllers({ handleSortingCriteriaChange, renderSortingIcon }) {
  return (
    <div className="row">
      <div
        className="col-2"
        onClick={() => handleSortingCriteriaChange("likes")}
      >
        Likes {renderSortingIcon("likes")}
      </div>
      <div
        className="col-2"
        onClick={() => handleSortingCriteriaChange("views")}
      >
        Views {renderSortingIcon("views")}
      </div>

      <div
        className="col-2"
        onClick={() => handleSortingCriteriaChange("date")}
      >
        Date {renderSortingIcon("date")}
      </div>
    </div>
  );
}