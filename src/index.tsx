
//personally I prefer the index file to be just amounting the app
//so I can have a whole App as a basic component. 
//its easier for testing and such, not just that its neat this way.

import ReactDom from 'react-dom';
import App from './app/App';
import React from 'react';
import './styles/main.scss';

ReactDom.render(<App />, document.getElementById('app-container'));