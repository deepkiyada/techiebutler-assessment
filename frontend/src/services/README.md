# API Service Documentation

## Overview

The `api.js` file provides a centralized service layer for all backend API communications. It uses axios to handle HTTP requests and includes proper error handling, timeouts, and response interceptors.

## Configuration

### Base URL
The API base URL can be configured via environment variable:

```bash
# .env file
VITE_API_URL=http://localhost:3001
```

Default: `http://localhost:3001`

### Axios Instance
- **Timeout:** 10 seconds
- **Headers:** `Content-Type: application/json`
- **Interceptors:** Response interceptor for error logging

## API Functions

### 1. `getPolls()`

Fetches all active polls from the backend.

**Usage:**
```javascript
import { getPolls } from './services/api';

const polls = await getPolls();
```

**Returns:**
```javascript
[
  {
    id: 1,
    title: "Poll title",
    description: "Poll description",
    totalVotes: 10,
    isActive: true,
    createdAt: "2026-02-09T12:00:00.000Z"
  },
  // ... more polls
]
```

**Errors:**
- Throws error with message on failure

---

### 2. `getPollDetails(id)`

Fetches a specific poll with all its options.

**Parameters:**
- `id` (number|string) - Poll ID

**Usage:**
```javascript
import { getPollDetails } from './services/api';

const poll = await getPollDetails(1);
```

**Returns:**
```javascript
{
  id: 1,
  title: "Poll title",
  description: "Poll description",
  totalVotes: 10,
  isActive: true,
  createdAt: "2026-02-09T12:00:00.000Z",
  options: [
    {
      id: 1,
      pollId: 1,
      text: "Option 1",
      voteCount: 5
    },
    // ... more options
  ]
}
```

**Errors:**
- `"Poll not found"` - 404 status
- Generic error message for other failures

---

### 3. `createPoll(pollData)`

Creates a new poll with options.

**Parameters:**
- `pollData` (Object)
  - `question` (string) - Poll question
  - `options` (Array<string>) - Array of option texts (min 2)

**Usage:**
```javascript
import { createPoll } from './services/api';

const newPoll = await createPoll({
  question: "What is your favorite color?",
  options: ["Red", "Blue", "Green"]
});
```

**Returns:**
```javascript
{
  id: 4,
  title: "What is your favorite color?",
  description: "",
  createdAt: "2026-02-09T14:30:00.000Z",
  totalVotes: 0,
  isActive: true,
  options: [
    {
      id: 5,
      pollId: 4,
      text: "Red",
      voteCount: 0
    },
    // ... more options
  ]
}
```

**Errors:**
- `"Invalid poll data"` - 400 status (validation error)
- Generic error message for other failures

---

### 4. `votePoll(pollId, optionId)`

Submits a vote for a specific option on a poll.

**Parameters:**
- `pollId` (number|string) - Poll ID
- `optionId` (number) - Option ID to vote for

**Usage:**
```javascript
import { votePoll } from './services/api';

const updatedPoll = await votePoll(1, 2);
```

**Returns:**
```javascript
{
  id: 1,
  title: "Poll title",
  description: "Poll description",
  totalVotes: 11,
  isActive: true,
  createdAt: "2026-02-09T12:00:00.000Z",
  options: [
    {
      id: 1,
      pollId: 1,
      text: "Option 1",
      voteCount: 5
    },
    {
      id: 2,
      pollId: 1,
      text: "Option 2",
      voteCount: 6  // incremented
    }
  ]
}
```

**Errors:**
- `"You have already voted on this poll"` - 409 status (duplicate vote)
- `"Poll or option not found"` - 404 status
- `"Invalid vote data"` - 400 status
- Generic error message for other failures

---

### 5. `getResults(id)`

Fetches poll results with vote counts and percentages.

**Parameters:**
- `id` (number|string) - Poll ID

**Usage:**
```javascript
import { getResults } from './services/api';

const results = await getResults(1);
```

**Returns:**
```javascript
{
  pollId: 1,
  title: "Poll title",
  description: "Poll description",
  totalVotes: 10,
  options: [
    {
      id: 1,
      text: "Option 1",
      voteCount: 3,
      percentage: "30.00"
    },
    {
      id: 2,
      text: "Option 2",
      voteCount: 7,
      percentage: "70.00"
    }
  ]
}
```

**Errors:**
- `"Poll not found"` - 404 status
- Generic error message for other failures

---

## Error Handling

All functions use try-catch blocks and throw errors with descriptive messages. The response interceptor logs all errors to the console for debugging.

**Example Error Handling:**
```javascript
try {
  const polls = await getPolls();
  setPolls(polls);
} catch (error) {
  setError(error.message); // User-friendly error message
  console.error(error);     // Logged by interceptor
}
```

## Advanced Usage

### Custom Requests

The configured axios instance is exported as the default export:

```javascript
import apiClient from './services/api';

const response = await apiClient.get('/custom-endpoint');
```

### Modifying Configuration

To change the base URL at runtime:

```javascript
import apiClient from './services/api';

apiClient.defaults.baseURL = 'https://api.production.com';
```

## Best Practices

1. **Always use try-catch** when calling API functions
2. **Display error messages** to users via `error.message`
3. **Don't hard-code API URLs** in components - use this service
4. **Use environment variables** for different environments (dev, staging, prod)
5. **Keep API logic centralized** - add new functions here instead of direct axios calls

## Testing

When testing components that use these API functions, mock them:

```javascript
import * as api from './services/api';

jest.mock('./services/api');

// In test
api.getPolls.mockResolvedValue([{ id: 1, title: 'Test Poll' }]);
```
