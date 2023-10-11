import { useEffect, useRef } from 'react';
/**
 * A custom React hook for dynamically creating action buttons within a container.
 * @param {Array} buttons - An array of button objects, each containing an 'id' and 'title'.
 * @param {boolean} loading - A boolean flag indicating if the buttons should be in a loading state.
 * @param {Function} callbackFunction - The callback function to execute when a button is clicked.
 * @param {Array} imagesList - An array of images to pass as a parameter to the callback function.
 * @param {Array} imagesToDelete - An array of image keys to pass as a parameter to the callback function.
 * @returns {Object} - An object containing buttonRefs for each button element.
 */
const useXBlockActionButtons = (buttons, loading, callbackFunction, imagesList, imagesToDelete) => {
  const buttonRefs = useRef({});
  const clickHandlers = {};

  useEffect(() => {
    const actionButtonsContainer = document.querySelector('.modal-actions ul');

    buttons.forEach(({ id, title }) => {
      if (!buttonRefs.current[id]) {
        buttonRefs.current[id] = document.createElement('button');
        buttonRefs.current[id].href = '#';
        buttonRefs.current[id].className = 'button action-primary';
        actionButtonsContainer.appendChild(buttonRefs.current[id]);
      }

      // Always update the button's title and disable state based on the loading prop
      buttonRefs.current[id].textContent = title;

      if (!clickHandlers[id]) {
        clickHandlers[id] = (event) => {
          event.preventDefault();
          callbackFunction(id, imagesList, imagesToDelete, buttonRefs.current[id]);
        };
        buttonRefs.current[id].addEventListener('click', clickHandlers[id]);
      }
    });

    return () => {
      buttons.forEach(({ id }) => {
        buttonRefs.current[id].removeEventListener('click', clickHandlers[id]);
      });
    };
  }, [buttons, loading, callbackFunction, imagesList, imagesToDelete]);

  return buttonRefs;
};

export default useXBlockActionButtons;
