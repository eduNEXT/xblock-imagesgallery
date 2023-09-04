import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ImageItem from './components/ImageItem';

import './styles.css';

function generateUniqueID() {
    // A simple function to generate a unique ID using the current timestamp
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'brown', 'gray'];

  const colorObjects = [];

  for (let i = 0; i < 15; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const uniqueID = generateUniqueID();
    colorObjects.push({ id: uniqueID, name: randomColor });
  }

function ListImages() {


  return (
    <div className="grid" >
      {/* Card 1 */}
      {colorObjects.map(({ id}) => <ImageItem key={id} />)}
      {/* Add more cards as needed */}
    </div>
  );
}

export default ListImages;
