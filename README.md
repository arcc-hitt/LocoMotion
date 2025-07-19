# LocoMotion - Real-time Vehicle Tracking Simulation

A modern, optimized, and production-ready web application that simulates real-time vehicle movement along predefined routes using React, TypeScript, and Leaflet maps. Built with industry best practices, performance optimizations, and comprehensive error handling.

## 🚀 Features

### Core Functionality
- **Interactive Map View**: Centered on predefined routes with OpenStreetMap tiles
- **Real-time Vehicle Simulation**: Smooth animated vehicle marker that follows actual roads
- **Dynamic Route Drawing**: Route path extends as the vehicle progresses
- **Play/Pause Controls**: Full control over simulation playback
- **Reset Functionality**: Return to starting position
- **Road API Integration**: Real road-following coordinates from OpenRouteService

### Advanced Features
- **Speed Calculation**: Real-time speed calculation based on GPS coordinates and timestamps
- **Distance Tracking**: Total distance and distance traveled metrics
- **Progress Tracking**: Visual progress bar and percentage completion
- **Elapsed Time**: Real-time elapsed time display
- **Metadata Display**: Comprehensive vehicle information including coordinates, speed, and distance
- **Multiple Route Types**: Simple routes, multi-point routes, and API-based routing

### UI/UX Enhancements
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Interface**: Clean, professional design with Tailwind CSS
- **Smooth Animations**: Fluid transitions and hover effects
- **Visual Feedback**: Progress indicators and status displays
- **Accessibility**: Proper contrast, keyboard navigation, and ARIA labels
- **Loading States**: Elegant loading spinners and error handling
- **Performance Optimized**: Memoized components and efficient re-renders

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Maps**: Leaflet with react-leaflet
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm
- **Road API**: OpenRouteService

## 📁 Project Structure

```
src/
├── components/
│   ├── MapView.tsx      # Optimized map component with custom hooks
│   ├── Controls.tsx     # Enhanced control panel with memoized components
│   └── Card.tsx         # Reusable card component with variants
├── hooks/               # Custom React hooks
│   ├── index.ts         # Hook exports
│   ├── useMapCenter.ts  # Map center management hook
│   ├── useMarkerPosition.ts # Marker position updates hook
│   ├── useVehicleIcon.ts # Vehicle icon creation hook
│   ├── useRouteManagement.ts # Route state management hook
│   ├── useRouteLoader.ts # Route loading operations hook
│   ├── useSimulationTimer.ts # Simulation timer management hook
│   └── useVehicleMetadata.ts # Vehicle metadata calculation hook
├── utils/
│   ├── calculations.ts  # Utility functions for distance, speed, etc.
│   └── roadApi.ts       # Road API integration with robust error handling
├── types.d.ts           # TypeScript type definitions
├── App.tsx              # Main application with custom hooks
└── index.css            # Global styles
```

## 🎯 Key Optimizations & Best Practices

### Performance Optimizations
- **React.memo()**: All components are memoized to prevent unnecessary re-renders
- **useMemo()**: Expensive calculations are memoized
- **useCallback()**: Event handlers are memoized to prevent child re-renders
- **Custom Hooks**: Logic is extracted into reusable hooks
- **Efficient State Management**: Optimized state updates and management

### Code Quality
- **DRY Principle**: No code duplication, reusable components
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **TypeScript**: Full type safety with proper interfaces
- **Constants**: Configuration values extracted to constants
- **Error Boundaries**: Comprehensive error handling and fallbacks

### Component Architecture
- **Composable Components**: Small, focused, and reusable components
- **Props Interface**: Well-defined prop interfaces with optional props
- **Default Values**: Sensible defaults for all optional props
- **Accessibility**: Keyboard navigation and ARIA labels
- **Responsive Design**: Mobile-first approach

### Custom Hooks Organization
- **Dedicated Hooks Folder**: All custom hooks organized in `src/hooks/`
- **Single Responsibility**: Each hook has a focused, specific purpose
- **Reusability**: Hooks can be easily imported and reused across components
- **Testing**: Isolated hooks are easier to test independently
- **Maintainability**: Clear separation of concerns and logic
- **Type Safety**: Full TypeScript support with proper interfaces

### API Integration
- **Robust Error Handling**: Graceful fallbacks when API fails
- **Loading States**: User feedback during API calls
- **Retry Mechanisms**: Easy retry functionality
- **Timeout Handling**: Proper timeout management
- **Data Validation**: Input validation and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LocoMotion
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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Road API Setup
1. Get a free API key from [OpenRouteService](https://openrouteservice.org/)
2. Update the API key in `src/utils/roadApi.ts`
3. Configure route coordinates in `src/App.tsx`

### Customization Options
- **Map Configuration**: Modify `MAP_CONFIG` in MapView component
- **Simulation Speed**: Adjust `UPDATE_INTERVAL` in App component
- **Route Coordinates**: Update `ROUTE_CONFIG` for different locations
- **Styling**: Customize Tailwind classes and CSS variables

## 📊 Data Format

The application uses a standardized format for route points:

```typescript
interface RoutePoint {
  latitude: number
  longitude: number
  timestamp: string // ISO format
}
```

## 🎯 Component Features

### MapView Component
- **Custom Hooks**: `useMapCenter`, `useMarkerPosition`, `useVehicleIcon`
- **Performance**: Memoized calculations and optimized re-renders
- **Configurable**: Optional props for showing/hiding elements
- **Accessibility**: Keyboard navigation support

### Controls Component
- **Modular Design**: Separate components for buttons, progress, metadata
- **Memoization**: All sub-components are memoized
- **Flexible**: Optional display of different sections
- **Responsive**: Adapts to different screen sizes

### Card Component
- **Variants**: Multiple styling variants (default, elevated, outlined)
- **Sizes**: Different size options (sm, md, lg)
- **Interactive**: Optional click handlers with keyboard support
- **Accessible**: Proper ARIA labels and keyboard navigation

## 🪝 Custom Hooks

### Map-Related Hooks
- **`useMapCenter`**: Manages map center updates with smooth animation
- **`useMarkerPosition`**: Handles vehicle marker position updates
- **`useVehicleIcon`**: Creates and memoizes vehicle icon with pulse effect

### Route Management Hooks
- **`useRouteManagement`**: Centralized route state management with all CRUD operations
- **`useRouteLoader`**: Handles route loading from API with fallback generation
- **`useSimulationTimer`**: Manages simulation timing and progression
- **`useVehicleMetadata`**: Calculates and memoizes vehicle metadata (speed, distance, etc.)

### Hook Benefits
- **Separation of Concerns**: Logic separated from UI components
- **Reusability**: Hooks can be used across multiple components
- **Testability**: Each hook can be tested independently
- **Maintainability**: Easier to modify and extend functionality
- **Performance**: Optimized with proper memoization and cleanup

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

The application is built with testability in mind:
- **Component Isolation**: Components can be tested independently
- **Custom Hooks**: Logic is extracted for easy testing
- **Type Safety**: TypeScript prevents runtime errors
- **Error Boundaries**: Graceful error handling

## 🚀 Performance Metrics

- **Bundle Size**: Optimized with tree shaking and code splitting
- **Render Performance**: Memoized components prevent unnecessary re-renders
- **Memory Usage**: Efficient state management and cleanup
- **Network Requests**: Optimized API calls with proper caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established code patterns and conventions
4. Add tests for new functionality
5. Ensure all components are memoized and optimized
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- OpenRouteService for road routing data
- Leaflet for mapping functionality
- React team for the amazing framework
- Tailwind CSS for the utility-first styling approach
- OpenStreetMap for map tiles
