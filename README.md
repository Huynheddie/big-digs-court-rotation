# Big Digs Court Rotation System

A React-based web application for managing volleyball court rotations and team organization. Built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Court Management**: Visual representation of volleyball courts with rotation tracking
- **Team Organization**: Add and manage teams with custom colors and player assignments
- **Real-time Updates**: Dynamic state management for seamless user experience
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Custom React hooks
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Huynheddie/big-digs-court-rotation.git
   cd big-digs-court-rotation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint`
- **Run tests**: `npm test`

## Deployment

### GitHub Pages (Automatic)

The application is automatically deployed to GitHub Pages when you push to the `main` branch. The deployment is handled by GitHub Actions.

**Live Demo**: https://huynheddie.github.io/big-digs-court-rotation/

### Manual Deployment

To manually deploy:

1. **Using the deployment script**:
   ```bash
   ./deploy.sh
   ```

2. **Manual steps**:
   ```bash
   npm run build
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

### Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CourtCard.tsx   # Court display component
│   └── modals/         # Modal components
├── context/            # React context providers
├── data/               # Initial data and constants
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
