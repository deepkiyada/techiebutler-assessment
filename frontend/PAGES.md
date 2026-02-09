# Frontend Pages Documentation

## Overview
This document describes the four main pages of the polling application.

## Pages

### 1. PollListPage (`/`)
**Location:** `src/pages/PollListPage.jsx`

**Features:**
- Displays all active polls in a card layout
- Shows poll title, description, vote count, and active status
- "Create Poll" button to navigate to create page
- "Vote" button on each poll card
- "View Results" button on each poll card
- Loading and error states
- Empty state message when no polls exist

**API Used:**
- `GET /polls` - Fetches all active polls

---

### 2. PollDetailPage (`/poll/:id`)
**Location:** `src/pages/PollDetailPage.jsx`

**Features:**
- Displays poll question and description
- Radio button selection for voting options
- Submit vote button
- View results button
- Back to polls navigation
- Handles duplicate vote detection (409 error)
- Success message and automatic redirect to results
- Loading and error states
- Disabled submit when no option selected

**API Used:**
- `GET /polls/:id` - Fetches poll with options
- `POST /polls/:id/vote` - Submits vote

**Error Handling:**
- 409 Conflict: Already voted
- 404 Not Found: Poll or option not found
- 500 Server Error: Generic error

---

### 3. CreatePollPage (`/create`)
**Location:** `src/pages/CreatePollPage.jsx`

**Features:**
- Text field for poll question (required)
- Dynamic option fields (minimum 2)
- Add option button (with + icon)
- Remove option button (with delete icon, minimum 2 options)
- Form validation
- Submit button with loading state
- Cancel button to go back
- Back to polls navigation

**API Used:**
- `POST /polls` - Creates new poll

**Validation:**
- Question cannot be empty
- At least 2 non-empty options required
- Empty options are filtered out before submission

---

### 4. ResultsPage (`/results/:id`)
**Location:** `src/pages/ResultsPage.jsx`

**Features:**
- Displays poll title and description
- Shows total vote count
- Visual results with progress bars
- Percentage and vote count for each option
- "Vote on This Poll" button
- "Refresh" button to reload results
- Back to polls navigation
- Empty state when no votes
- Loading and error states

**API Used:**
- `GET /polls/:id/results` - Fetches results with percentages

**Display:**
- Linear progress bars showing percentage
- Percentage displayed to 2 decimal places
- Vote count with singular/plural handling

---

## Common Features Across All Pages

### UI Components
- Material UI components for consistent design
- Paper/Card components for content containers
- Buttons with proper colors (primary, secondary, outlined)
- Alert components for errors and success messages
- CircularProgress for loading states

### Navigation
- React Router Link components for navigation
- Back buttons on detail pages
- Breadcrumb-style navigation

### Error Handling
- Try-catch blocks for all API calls
- User-friendly error messages
- Console logging for debugging
- Fallback UI for error states

### Styling
- Responsive container with max width
- Consistent spacing and padding
- Material UI theme integration
- Clean, modern design

---

## API Configuration

All pages use the same API URL:
```javascript
const API_URL = 'http://localhost:3001';
```

To change the backend URL, update this constant in each page file, or create a shared config file.

---

## Dependencies

- `react` - Core React library
- `react-router-dom` - Routing (useParams, useNavigate, Link)
- `@mui/material` - UI components
- `@mui/icons-material` - Material icons (Add, Delete)
- `axios` - HTTP client for API requests

---

## Future Enhancements

Potential improvements:
- Shared API configuration file
- Custom hooks for API calls
- Global error boundary
- Toast notifications instead of inline alerts
- Polling for live results updates
- User authentication
- Poll editing functionality
- Poll deletion from UI
- Share poll functionality
- Dark mode toggle
