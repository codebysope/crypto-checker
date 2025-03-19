import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Charts from './pages/Charts';
import News from './pages/News';
import CryptoDetails from './pages/CryptoDetails';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Custom theme configuration
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    }),
  },
  colors: {
    brand: {
      50: '#E5F0FF',
      100: '#B8D4FF',
      200: '#8AB8FF',
      300: '#5C9CFF',
      400: '#2E80FF',
      500: '#0064FF',
      600: '#0050CC',
      700: '#003C99',
      800: '#002866',
      900: '#001433',
    },
    accent: {
      blue: '#00A3FF',
      purple: '#7B61FF',
      pink: '#FF61DC',
      green: '#00DC82',
      red: '#FF5C5C',
      yellow: '#FFB547',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        ghost: {
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          bg: 'gray.800',
          borderColor: 'whiteAlpha.100',
        },
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/news" element={<News />} />
              <Route path="/crypto/:id" element={<CryptoDetails />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
