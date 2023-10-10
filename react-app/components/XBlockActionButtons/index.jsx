import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import globalObject from '@constants/globalObject';

const XBlockActionButtons = (props) => {
  const { buttons, callbackFunction, imagesList, imagesToDelete } = props;
  const { isEditView, xblockId } = globalObject;
  const buttonRefs = useRef({});
  const { filesToUpload } = useSelector((state) => state.files);

  useEffect(() => {
    if (isEditView) {
      const actionButtonsContainer = document.querySelector('.modal-actions ul');
      const clickHandler = (event) => handleButtonClick(event);

      buttons.forEach(({ id, title }) => {
        // Get or create a button element with a unique ID
        if (!buttonRefs.current[id]) {
          buttonRefs.current[id] = document.createElement('a');
          buttonRefs.current[id].href = '#';
          buttonRefs.current[id].className = 'button action-primary';
          actionButtonsContainer.appendChild(buttonRefs.current[id]);
        }

        // Update click event listener for the button
        buttonRefs.current[id].textContent = title;

        // Remove the previous event listener to avoid duplicates
        buttonRefs.current[id].removeEventListener('click', clickHandler);

        // Add the event listener
        buttonRefs.current[id].addEventListener('click', clickHandler);
      });

      return () => {
        buttons.forEach(({ id }) => {
          // Remove the event listener when the component unmounts
          buttonRefs.current[id].removeEventListener('click', clickHandler);
        });
      };
    }
  }, [buttons, imagesList, imagesToDelete]);


  // Define the click event handler for the buttons
  const handleButtonClick = (event) => {
     event.preventDefault();
     callbackFunction(imagesList, imagesToDelete);
     console.log('imagesList', imagesList);
  };

  return null;
};

XBlockActionButtons.propTypes = {
  callbackFunction: PropTypes.func,
  imagesToDelete: PropTypes.arrayOf(PropTypes.string),
  imagesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      assetKey: PropTypes.string.isRequired
    })
  ),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      xblockIdItem: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default memo(XBlockActionButtons);
