import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
    const { title, leftItems, rightItems } = props;
    return (
      <div className="toolbar">
        <div className="left-items">{ leftItems }</div>
        <div className="toolbar-title">{ title }</div>
        <div className="right-items">{ rightItems }</div>
      </div>
    );
}