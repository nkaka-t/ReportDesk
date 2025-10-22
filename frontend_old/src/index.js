import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Ensure we import the TSX App so the full MUI-based UI (including Signup) is used
import App from './App.tsx';
// Add Roboto font and CssBaseline for Material UI default styling
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<CssBaseline />
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
