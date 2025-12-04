# Problem Ticket Search

## App Description

A Topbar app that provides quick search functionality to find and view problem tickets across your Zendesk instance. Agents can search by ticket ID, subject keywords, or requester information and see a compact list of matching problem tickets with essential details.

## Architecture

The app follows a component-based architecture with clear separation of concerns:

- Main app component handles theme management and ZAF initialization
- SearchContainer manages search state and API interactions
- ResultsTable displays search results in a clean, accessible table format
- Styled-components provide consistent styling across the app

## List of Features

- Search problem tickets by entering ticket ID, subject keywords, or requester information
- Display search results in a compact table showing ticket ID, subject, status, and priority
- Click ticket ID to navigate directly to the ticket in Zendesk
- Real-time search with loading states
- Dark mode support with automatic theme switching
- Responsive design optimized for Topbar location
- Empty state messaging for better user experience
- Error handling with detailed error messages
- Custom icon with search magnifier and alert indicator

## Documentation Used

- topBar
- coreAppsAPI
- search
- react-forms
- react-buttons
- react-tables
- react-theming
- react-loaders

## Tech Stack

- React 18
- Zendesk Garden Components v9
- Zendesk App Framework (ZAF) APIs
- Zendesk Search REST API
- styled-components

## File Structure

- `index.jsx` - Main app entry point with theme provider and ZAF initialization
- `components/SearchContainer.jsx` - Search input and search logic
- `components/ResultsTable.jsx` - Results display with table layout
- `styles/SearchContainer.js` - Styled components for search section
- `styles/ResultsTable.js` - Styled components for results display
- `assets/icon.svg` - Custom SVG icon with search and alert indicator
- `mock.js` - Mock ZAF client for development and testing

## Integration Details

Uses Zendesk Search REST API (`/api/v2/search.json`) to query problem tickets with the following parameters:

- `query`: Combines `type:ticket`, `ticket_type:problem`, and user search input
- `sort_by`: created_at
- `sort_order`: desc

## Icon Design

Custom SVG icon featuring a search magnifier with an exclamation mark inside, representing the search functionality for problem tickets. The icon is optimized for small sizes and maintains clarity at the Topbar scale.
