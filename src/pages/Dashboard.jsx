import { useState } from 'react';
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMarketData, useTopCryptos, formatNumber, formatPercentage } from '../hooks/useCryptoData';
import CryptoChart from '../components/CryptoChart';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

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
  const { data: marketData, isLoading: isLoadingMarket } = useMarketData();
  const { data: topCryptos, isLoading: isLoadingCryptos } = useTopCryptos(20);

  const tableBg = useColorModeValue('gray.800', 'gray.800');
  const hoverBg = useColorModeValue('gray.700', 'gray.700');

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
            <HStack justify="space-between" wrap="wrap" spacing={4}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
              >
                Bitcoin Price Chart
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                {['1h', '24h', '7d', '30d', '1y'].map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    variant={timeFilter === filter ? 'solid' : 'outline'}
                    bg={timeFilter === filter ? 'brand.500' : 'transparent'}
                    _hover={{
                      bg: timeFilter === filter ? 'brand.600' : 'whiteAlpha.100',
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </ButtonGroup>
            </HStack>
            <Box h="400px">
              <CryptoChart cryptoId="bitcoin" timeFilter={timeFilter} />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Cryptocurrencies Table */}
      <Card overflow="hidden">
        <CardBody>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={6}
            bgGradient="linear(to-r, brand.500, accent.purple)"
            bgClip="text"
          >
            Top Cryptocurrencies
          </Text>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.400">#</Th>
                  <Th color="gray.400">Name</Th>
                  <Th isNumeric color="gray.400">Price</Th>
                  <Th isNumeric color="gray.400">24h %</Th>
                  <Th isNumeric color="gray.400">Market Cap</Th>
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
                  topCryptos?.map((crypto, index) => (
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
        </CardBody>
      </Card>
    </VStack>
  );
} 