import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import './styles.css';

const ErrorMessage = ({ message, className = '' }) => {
  return (
    <div className={`error-message ${className}`}>
      <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
      <p className="error-text">{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default ErrorMessage;
