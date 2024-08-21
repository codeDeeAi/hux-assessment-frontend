# Hux Ventures Contacts App Frontend

This project is the frontend application for managing contacts within the Hux Ventures ecosystem. It provides an intuitive interface for users to create, view, edit, and manage their contacts.

## Features

- User Authentication
- Contact Management (Create, View, Edit, Delete)
- Error Handling for Unavailable Routes
- Secure Routes for Authorized Users

## Tech Stack

- **Vue.js** - Frontend Framework
- **Vue Router** - Routing
- **Pinia** - State Management
- **Axios** - HTTP Client

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/codeDeeAi/hux-assessment-frontend.git
   cd hux-assessment-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the `.env.example` to `.env` and set up your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API server URL:

   ```
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application should now be running on `http://localhost:3000`.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

### Testing

To run tests:

```bash
npm run test
# or
yarn test
```

## Environment Variables

The following environment variables need to be configured in your `.env` file:

- `VITE_API_BASE_URL`: The base URL for the API server.

Example `.env`:

```plaintext
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## License

This project is licensed under the MIT License.
