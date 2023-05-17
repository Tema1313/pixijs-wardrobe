import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WardrobeReact from './WardrobeReact';
import PixiInTsx from './PixiInTsx';
import testdata from "./testData/testsmall.json"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <App />
    <WardrobeReact data={testdata} />
    // <PixiInTsx />
);

