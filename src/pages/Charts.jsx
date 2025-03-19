import { useState } from 'react';
import {
  VStack,
  Card,
  CardBody,
  Text,
  ButtonGroup,
  Button,
  SimpleGrid,
  Select,
  HStack,
  Box,
} from '@chakra-ui/react';
import { useTopCryptos } from '../hooks/useCryptoData';
import CryptoChart from '../components/CryptoChart';

export default function Charts() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeFilter, setTimeFilter] = useState('24h');
  const { data: topCryptos } = useTopCryptos(50);

  return (
    <VStack spacing={6} align="stretch">
      <Text
        fontSize="2xl"
        fontWeight="bold"
        bgGradient="linear(to-r, brand.500, accent.purple)"
        bgClip="text"
        mb={4}
      >
        Cryptocurrency Charts
      </Text>

      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.200"
                _hover={{ borderColor: 'whiteAlpha.300' }}
              >
                {topCryptos?.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </Select>

              <ButtonGroup size="sm" isAttached variant="outline" justifyContent="end">
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
            </SimpleGrid>

            <Box h="500px">
              <CryptoChart cryptoId={selectedCrypto} timeFilter={timeFilter} />
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
} 