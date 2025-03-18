import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCryptoChart } from '../hooks/useCryptoData';
import { format } from 'date-fns';
import { Box, Flex, Spinner, Text, useToken } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const timeFilters = {
  '1h': 0.042,
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '1y': 365,
};

export default function CryptoChart({ cryptoId, timeFilter }) {
  const { data, isLoading, error } = useCryptoChart(
    cryptoId,
    timeFilters[timeFilter] || 1
  );

  // Get theme colors
  const [brandColor, accentPurple] = useToken('colors', ['brand.500', 'accent.purple']);

  if (isLoading) {
    return (
      <Flex h="400px" align="center" justify="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
          color="brand.500"
          size="xl"
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex h="400px" align="center" justify="center">
        <Text color="accent.red">Error loading chart data</Text>
      </Flex>
    );
  }

  const chartData = data?.prices?.map(([timestamp, price]) => ({
    date: new Date(timestamp),
    price,
  }));

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    if (timeFilter === '1h') return format(date, 'HH:mm');
    if (timeFilter === '24h') return format(date, 'HH:mm');
    if (timeFilter === '7d') return format(date, 'MMM dd');
    if (timeFilter === '30d') return format(date, 'MMM dd');
    return format(date, 'MMM yyyy');
  };

  const formatYAxis = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg="gray.800"
          p={4}
          borderRadius="lg"
          border="1px"
          borderColor="whiteAlpha.200"
          boxShadow="lg"
        >
          <Text fontSize="sm" color="gray.400" mb={2}>
            {format(new Date(label), 'PPp')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            bgGradient={`linear(to-r, ${brandColor}, ${accentPurple})`}
            bgClip="text"
          >
            {formatYAxis(payload[0].value)}
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      h="400px"
      w="full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={brandColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={brandColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="gray.700"
            opacity={0.1}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#718096' }}
            stroke="#2D3748"
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#718096' }}
            stroke="#2D3748"
            axisLine={false}
            tickLine={false}
            width={80}
            dx={-10}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: brandColor,
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={brandColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </MotionBox>
  );
} 