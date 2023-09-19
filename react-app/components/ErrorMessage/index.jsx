import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import './styles.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
      <p className="error-text">{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
