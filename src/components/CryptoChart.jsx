import { useState } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ReferenceLine,
} from 'recharts';
import { useCryptoChart } from '../hooks/useCryptoData';
import { format } from 'date-fns';
import {
  Box,
  Flex,
  Spinner,
  Text,
  useToken,
  Button,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Card,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { RepeatIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

const timeFilters = {
  '1h': '1h',
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
  '1y': '1y',
};

const CustomTooltip = ({ active, payload, label, currency = 'USD' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const priceChange = ((data.close - data.open) / data.open) * 100;
    const isPositive = data.close >= data.open;

    return (
      <Card bg="gray.800" p={4} borderRadius="lg" border="1px" borderColor="whiteAlpha.200">
        <Text color="gray.400" mb={2}>
          {format(new Date(label), 'PPp')}
        </Text>
        <StatGroup>
          <Stat>
            <StatLabel>Open</StatLabel>
            <StatNumber fontSize="md">${data.open.toFixed(2)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Close</StatLabel>
            <StatNumber fontSize="md">${data.close.toFixed(2)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Change</StatLabel>
            <StatNumber fontSize="md">
              <StatArrow type={isPositive ? 'increase' : 'decrease'} />
              {Math.abs(priceChange).toFixed(2)}%
            </StatNumber>
          </Stat>
        </StatGroup>
        <HStack mt={2} justify="space-between">
          <Text color="gray.400" fontSize="sm">
            High: ${data.high.toFixed(2)}
          </Text>
          <Text color="gray.400" fontSize="sm">
            Low: ${data.low.toFixed(2)}
          </Text>
        </HStack>
        <Text color="gray.400" fontSize="sm" mt={2}>
          Volume: ${(data.volume / 1000000).toFixed(2)}M
        </Text>
      </Card>
    );
  }
  return null;
};

export default function CryptoChart({ cryptoId, timeFilter }) {
  const [retryKey, setRetryKey] = useState(0);
  const toast = useToast();
  const { data, isLoading, error, refetch } = useCryptoChart(
    cryptoId,
    timeFilters[timeFilter],
    retryKey
  );

  const [brandColor, accentGreen, accentRed] = useToken('colors', [
    'brand.500',
    'accent.green',
    'accent.red',
  ]);

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
    refetch();
    toast({
      title: "Retrying...",
      description: "Fetching new chart data",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Flex h="400px" align="center" justify="center">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.700" color="brand.500" size="xl" />
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <Flex h="400px" align="center" justify="center" direction="column" gap={4}>
        <Text color="accent.red" textAlign="center">
          Error loading chart data
          <br />
          <Text fontSize="sm" color="gray.400" mt={2}>
            {error?.message || 'Failed to load data'}
          </Text>
        </Text>
        <Button
          colorScheme="brand"
          size="sm"
          onClick={handleRetry}
          leftIcon={<RepeatIcon />}
        >
          Retry
        </Button>
      </Flex>
    );
  }

  if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
    return (
      <Flex h="400px" align="center" justify="center">
        <Text color="gray.400">No data available for this time period</Text>
      </Flex>
    );
  }

  const chartData = data.prices.map((priceData, index) => {
    const volumeData = data.volumes[index] || { volume: 0, quoteVolume: 0 };
    return {
      date: priceData.timestamp,
      price: priceData.close,
      volume: volumeData.volume || 0,
      open: priceData.open || 0,
      close: priceData.close || 0,
      high: priceData.high || 0,
      low: priceData.low || 0,
      quoteVolume: volumeData.quoteVolume || 0,
    };
  });

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    switch (timeFilter) {
      case '1h':
        return format(date, 'HH:mm');
      case '24h':
        return format(date, 'HH:mm');
      case '7d':
        return format(date, 'MMM dd');
      case '30d':
        return format(date, 'MMM dd');
      case '1y':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM dd');
    }
  };

  const formatYAxis = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatVolumeAxis = (value) => {
    if (value === 0) return '0';
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      h={{ base: "300px", md: "400px" }}
      w="full"
      position="relative"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="gray.700" opacity={0.1} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#718096', fontSize: '12px' }}
            stroke="#2D3748"
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis
            yAxisId="price"
            tickFormatter={formatYAxis}
            tick={{ fill: '#718096', fontSize: '12px' }}
            stroke="#2D3748"
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            width={80}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tickFormatter={formatVolumeAxis}
            tick={{ fill: '#718096', fontSize: '12px' }}
            stroke="#2D3748"
            axisLine={false}
            tickLine={false}
            width={65}
          />
          <Tooltip 
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 1000 }}
          />
          <ReferenceLine
            yAxisId="price"
            y={chartData[0]?.price}
            stroke={brandColor}
            strokeDasharray="3 3"
          />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill={brandColor}
            opacity={0.2}
            barSize={20}
          />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={brandColor}
            fill={`url(#colorPrice)`}
            strokeWidth={2}
            dot={false}
          />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={brandColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={brandColor} stopOpacity={0} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Chart Legend */}
      <HStack 
        position="absolute" 
        top={2} 
        right={2} 
        spacing={4} 
        bg="gray.800" 
        p={2} 
        borderRadius="md"
        opacity={0.9}
      >
        <Tooltip label="Price line">
          <HStack spacing={2}>
            <Box w={3} h={0.5} bg={brandColor} />
            <Text fontSize="xs" color="gray.400">Price</Text>
          </HStack>
        </Tooltip>
        <Tooltip label="Trading volume">
          <HStack spacing={2}>
            <Box w={3} h={3} bg={brandColor} opacity={0.2} />
            <Text fontSize="xs" color="gray.400">Volume</Text>
          </HStack>
        </Tooltip>
      </HStack>
    </MotionBox>
  );
} 