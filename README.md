# CryptoVision - Real-Time Cryptocurrency Dashboard

A modern, feature-rich cryptocurrency dashboard built with React and Vite, providing real-time market data, advanced charting, and comprehensive news tracking.

## 🚀 Technologies Used

### Core Technologies
- **React 19.0.0** - Latest version for optimal performance and features
- **Vite 6.2.0** - For lightning-fast development and build times
- **@tanstack/react-query** - For efficient server state management and caching
- **Chakra UI** - For beautiful, accessible, and responsive components
- **Framer Motion** - For smooth animations and transitions
- **Recharts** - For advanced and responsive charting capabilities

### API Integration
- **Axios** - For robust HTTP client functionality
- **CryptoCompare API** - Real-time cryptocurrency data and news
- **CoinGecko API** - Comprehensive market data and statistics

### Styling & Design
- **Tailwind CSS** - For utility-first styling
- **@emotion/react & styled** - For component-level styling
- **react-icons** - For comprehensive icon library

### Development Tools
- **ESLint** - For code quality and consistency
- **PostCSS** - For modern CSS processing
- **Autoprefixer** - For cross-browser compatibility

## 🎯 Features

### 1. Market Overview
- Real-time market capitalization tracking
- 24-hour volume statistics
- Bitcoin dominance metrics
- Top cryptocurrencies table with live updates
- Advanced sorting and filtering capabilities

### 2. Advanced Charting
- Interactive price charts with multiple timeframes (1h, 24h, 7d, 30d, 1y)
- Volume data visualization
- Candlestick patterns
- Technical indicators
- Custom tooltips with detailed price information
- Responsive design for all screen sizes
- Chart preferences persistence

### 3. News Section
#### Content Management
- Real-time crypto news aggregation
- Category-based filtering
- Source-based filtering
- Advanced search functionality
- Tag-based organization
- Save articles for later reading

#### User Experience
- Infinite scroll implementation
- Lazy loading for images
- Animated transitions
- Keyboard shortcuts (Ctrl/Cmd + K for search)
- Share functionality with fallback options
- Responsive grid layout

#### News Features
- Category tabs for quick filtering
- Source filtering modal
- Sort by date or popularity
- Article saving functionality
- Reading time estimates
- Share buttons with Web Share API support
- Fallback clipboard copy

### 4. User Interface
- Dark mode optimization
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and skeletons
- Error handling with retry options
- Accessible components
- Custom scrollbar styling
- Modern glassmorphism design

### 5. Data Management
- Efficient caching with React Query
- Automatic background updates
- Retry mechanisms for failed requests
- Data persistence for user preferences
- Optimistic updates for better UX
- Error boundary implementation

### 6. Performance Optimizations
- Code splitting and lazy loading
- Memoized components and callbacks
- Debounced search inputs
- Optimized re-renders
- Efficient data transformations
- Image optimization and lazy loading

### 7. User Features
- Watchlist functionality
- Recently viewed tracking
- Customizable chart settings
- Saved articles management
- Custom filter preferences
- Share functionality

## 🔧 Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
cd crypto-vision
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Add your API keys:
- VITE_CRYPTOCOMPARE_API_KEY
- VITE_COINGECKO_API_KEY

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Laptop (1024px)
- Tablet (768px)
- Mobile (320px+)

## 🔐 Security Features

- Environment variable protection
- API key security
- XSS protection
- CORS handling
- Secure external links
- Input sanitization

## 🚦 State Management

- React Query for server state
- Local storage for user preferences
- URL state for shareable filters
- Memory state for UI components
- Cached responses for performance

## 📈 Performance Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: 90+
- Bundle Size: Optimized with code splitting
- API Response Caching: 5 minutes

## 🔄 Updates and Polling

- Market data: 30s
- Charts: 1m
- News: 5m
- Prices: 15s
- Top cryptocurrencies: 30s

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to my repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
