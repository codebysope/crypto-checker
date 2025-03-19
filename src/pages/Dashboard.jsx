import { useState, useMemo } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  ButtonGroup,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  VStack,
  HStack,
  Text,
  Skeleton,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Select
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMarketData, useTopCryptos, formatNumber, formatPercentage } from '../hooks/useCryptoData';
import CryptoChart from '../components/CryptoChart';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { SearchIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const StatCard = ({ label, value, gradient }) => (
  <MotionCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    overflow="hidden"
    position="relative"
  >
    <Box
      position="absolute"
      top="-50%"
      left="-50%"
      width="200%"
      height="200%"
      bgGradient={gradient}
      opacity={0.05}
      transform="rotate(-45deg)"
      pointerEvents="none"
    />
    <CardBody>
      <Stat>
        <StatLabel fontSize="sm" color="gray.400">{label}</StatLabel>
        <StatNumber
          fontSize="2xl"
          fontWeight="bold"
          bgGradient={gradient}
          bgClip="text"
        >
          {value}
        </StatNumber>
      </Stat>
    </CardBody>
  </MotionCard>
);

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const { data: marketData, isLoading: isLoadingMarket } = useMarketData();
  const { data: topCryptos, isLoading: isLoadingCryptos } = useTopCryptos(50);

  const tableBg = useColorModeValue('gray.800', 'gray.800');
  const hoverBg = useColorModeValue('gray.700', 'gray.700');

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filteredAndSortedCryptos = useMemo(() => {
    if (!topCryptos) return [];
    
    let filtered = topCryptos;
    if (searchQuery) {
      filtered = topCryptos.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [topCryptos, searchQuery, sortConfig]);

  return (
    <VStack spacing={6} align="stretch">
      {/* Market Overview Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard
          label="Market Cap"
          value={isLoadingMarket ? 'Loading...' : formatNumber(marketData?.total_market_cap?.usd || 0)}
          gradient="linear(to-r, brand.500, accent.purple)"
        />
        <StatCard
          label="24h Volume"
          value={isLoadingMarket ? 'Loading...' : formatNumber(marketData?.total_volume?.usd || 0)}
          gradient="linear(to-r, accent.purple, accent.pink)"
        />
        <StatCard
          label="BTC Dominance"
          value={isLoadingMarket ? 'Loading...' : `${marketData?.market_cap_percentage?.btc.toFixed(1)}%`}
          gradient="linear(to-r, accent.yellow, accent.red)"
        />
      </SimpleGrid>

      {/* Chart Section */}
      <Card overflow="hidden">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack 
              justify={{ base: "center", sm: "space-between" }}
              align={{ base: "center", sm: "flex-start" }}
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 4, sm: 0 }}
              wrap="wrap"
            >
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
                textAlign={{ base: "center", sm: "left" }}
              >
                Bitcoin Price Chart
              </Text>
              <ButtonGroup 
                size="sm" 
                isAttached 
                variant="outline"
                mt={{ base: 2, sm: 0 }}
              >
                {['1h', '24h', '7d', '30d', '1y'].map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    variant={timeFilter === filter ? 'solid' : 'outline'}
                    bg={timeFilter === filter ? 'brand.500' : 'transparent'}
                    _hover={{
                      bg: timeFilter === filter ? 'brand.600' : 'whiteAlpha.100',
                    }}
                    px={{ base: 2, md: 4 }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {filter}
                  </Button>
                ))}
              </ButtonGroup>
            </HStack>
            <Box h={{ base: "300px", md: "400px" }}>
              <CryptoChart cryptoId="bitcoin" timeFilter={timeFilter} />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Cryptocurrencies Table */}
      <Card overflow="hidden">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" wrap={{ base: "wrap", md: "nowrap" }} spacing={4}>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
              >
                Top Cryptocurrencies
              </Text>
              <InputGroup maxW={{ base: "100%", md: "300px" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={SearchIcon} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="filled"
                  bg="whiteAlpha.50"
                  _hover={{ bg: "whiteAlpha.100" }}
                  _focus={{ bg: "whiteAlpha.100" }}
                />
              </InputGroup>
            </HStack>

            <Box overflowX="auto" mx={-4} px={4}>
              <Table variant="simple" size={{ base: "sm", md: "md" }}>
                <Thead>
                  <Tr>
                    <Th color="gray.400">#</Th>
                    <Th 
                      color="gray.400" 
                      cursor="pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th 
                      isNumeric 
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => handleSort('current_price')}
                    >
                      Price {sortConfig.key === 'current_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th 
                      isNumeric 
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => handleSort('price_change_percentage_24h')}
                    >
                      24h % {sortConfig.key === 'price_change_percentage_24h' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th 
                      isNumeric 
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => handleSort('market_cap')}
                    >
                      Market Cap {sortConfig.key === 'market_cap' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoadingCryptos ? (
                    Array(5).fill(0).map((_, i) => (
                      <Tr key={i}>
                        <Td><Skeleton height="20px" width="20px" /></Td>
                        <Td><Skeleton height="20px" width="150px" /></Td>
                        <Td isNumeric><Skeleton height="20px" width="100px" /></Td>
                        <Td isNumeric><Skeleton height="20px" width="80px" /></Td>
                        <Td isNumeric><Skeleton height="20px" width="120px" /></Td>
                      </Tr>
                    ))
                  ) : (
                    filteredAndSortedCryptos.map((crypto, index) => (
                      <Tr
                        key={crypto.id}
                        _hover={{ bg: hoverBg }}
                        transition="background-color 0.2s"
                        cursor="pointer"
                      >
                        <Td color="gray.400">{index + 1}</Td>
                        <Td>
                          <HStack spacing={3}>
                            <Image
                              src={crypto.image}
                              alt={crypto.name}
                              boxSize="32px"
                              borderRadius="full"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{crypto.name}</Text>
                              <Text fontSize="sm" color="gray.400">
                                {crypto.symbol.toUpperCase()}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td isNumeric fontWeight="medium">
                          {formatNumber(crypto.current_price)}
                        </Td>
                        <Td isNumeric>
                          <HStack justify="flex-end" spacing={1}>
                            {crypto.price_change_percentage_24h > 0 ? (
                              <FaCaretUp color="#00DC82" />
                            ) : (
                              <FaCaretDown color="#FF5C5C" />
                            )}
                            <Text
                              color={crypto.price_change_percentage_24h > 0 ? 'accent.green' : 'accent.red'}
                              fontWeight="medium"
                            >
                              {formatPercentage(crypto.price_change_percentage_24h)}
                            </Text>
                          </HStack>
                        </Td>
                        <Td isNumeric fontWeight="medium">
                          {formatNumber(crypto.market_cap)}
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
} 