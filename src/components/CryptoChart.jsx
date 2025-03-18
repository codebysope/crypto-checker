import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCryptoChart } from '../hooks/useCryptoData';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-3 h-3 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[400px] flex items-center justify-center text-accent-red"
      >
        Error loading chart data
      </motion.div>
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
        <div className="bg-dark-card p-4 rounded-lg shadow-lg border border-dark-border backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            {format(new Date(label), 'PPp')}
          </p>
          <p className="text-lg font-semibold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            {formatYAxis(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1F2937"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#9CA3AF' }}
            stroke="#1F2937"
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#9CA3AF' }}
            stroke="#1F2937"
            tickLine={false}
            width={80}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: '#3B82F6',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
} 