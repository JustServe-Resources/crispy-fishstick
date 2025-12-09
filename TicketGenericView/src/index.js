import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';



//when uploaded presumably this variable will not exist so this will not be run that means that, the mounting will be taken care of automatically by zendesk just like they expect
if(process.env.NODE_ENV==="development"){
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<App />);
}
