import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Grid,
  GridItem,
  Divider,
  Tag,
  Skeleton,
  Button,
  ButtonGroup,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StarIcon } from '@chakra-ui/icons';
import { FaGlobe, FaGithub, FaReddit, FaTwitter } from 'react-icons/fa';
import CryptoChart from '../components/CryptoChart';
import { useWatchlist } from '../hooks/useWatchlist';
import { useThemePreferences } from '../hooks/useThemePreferences';
import { formatNumber, formatPercentage } from '../hooks/useCryptoData';
import { useCryptoDetails } from '../hooks/useCryptoDetails';

const MotionBox = motion(Box);

export default function CryptoDetails() {
  const { id } = useParams();
  const [timeFilter, setTimeFilter] = useState('24h');
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { preferences } = useThemePreferences();
  const { data: cryptoDetails, isLoading } = useCryptoDetails(id);
  const toast = useToast();

  const handleWatchlistClick = (crypto) => {
    if (watchlist.includes(crypto.id)) {
      removeFromWatchlist(crypto.id);
      toast({
        title: "Removed from watchlist",
        description: `${crypto.name} has been removed from your watchlist`,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      addToWatchlist(crypto);
      toast({
        title: "Added to watchlist",
        description: `${crypto.name} has been added to your watchlist`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Skeleton height="64px" width="64px" borderRadius="full" />
          <VStack align="start" spacing={2}>
            <Skeleton height="24px" width="200px" />
            <Skeleton height="20px" width="100px" />
          </VStack>
        </HStack>
        <Skeleton height="400px" borderRadius="xl" />
      </VStack>
    );
  }

  if (!cryptoDetails) {
    return (
      <VStack spacing={6} align="center" py={20}>
        <Text fontSize="xl" color="gray.400">
          Cryptocurrency not found
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <HStack justify="space-between" wrap="wrap" spacing={4}>
        <HStack spacing={4}>
          <Image
            src={cryptoDetails.image}
            alt={cryptoDetails.name}
            boxSize="64px"
            borderRadius="full"
          />
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold">
                {cryptoDetails.name}
              </Text>
              <Text
                fontSize="xl"
                color="gray.400"
                textTransform="uppercase"
              >
                {cryptoDetails.symbol}
              </Text>
              <IconButton
                icon={
                  <StarIcon
                    color={watchlist.includes(cryptoDetails.id) ? 'yellow.400' : 'gray.400'}
                  />
                }
                variant="ghost"
                onClick={() => handleWatchlistClick(cryptoDetails)}
                aria-label="Add to watchlist"
              />
            </HStack>
            <HStack spacing={2}>
              <Tag colorScheme="blue" variant="subtle">
                Rank #{cryptoDetails.market_cap_rank}
              </Tag>
              {cryptoDetails.categories?.slice(0, 2).map((category) => (
                <Tag key={category} colorScheme="purple" variant="subtle">
                  {category}
                </Tag>
              ))}
            </HStack>
          </VStack>
        </HStack>

        {/* Social Links */}
        <HStack spacing={2}>
          {cryptoDetails.links?.homepage && (
            <IconButton
              as="a"
              href={cryptoDetails.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaGlobe />}
              aria-label="Website"
              variant="ghost"
            />
          )}
          {cryptoDetails.links?.github && (
            <IconButton
              as="a"
              href={cryptoDetails.links.github[0]}
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaGithub />}
              aria-label="GitHub"
              variant="ghost"
            />
          )}
          {cryptoDetails.links?.subreddit_url && (
            <IconButton
              as="a"
              href={cryptoDetails.links.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaReddit />}
              aria-label="Reddit"
              variant="ghost"
            />
          )}
          {cryptoDetails.links?.twitter_screen_name && (
            <IconButton
              as="a"
              href={`https://twitter.com/${cryptoDetails.links.twitter_screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaTwitter />}
              aria-label="Twitter"
              variant="ghost"
            />
          )}
        </HStack>
      </HStack>

      {/* Price Stats */}
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={6}
      >
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Price</StatLabel>
              <StatNumber fontSize="2xl">
                {formatNumber(cryptoDetails.current_price)}
              </StatNumber>
              <HStack spacing={2}>
                <StatArrow
                  type={cryptoDetails.price_change_percentage_24h > 0 ? "increase" : "decrease"}
                />
                <Text
                  color={
                    cryptoDetails.price_change_percentage_24h > 0
                      ? "accent.green"
                      : "accent.red"
                  }
                >
                  {formatPercentage(cryptoDetails.price_change_percentage_24h)}
                </Text>
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Market Cap</StatLabel>
              <StatNumber fontSize="2xl">
                {formatNumber(cryptoDetails.market_cap)}
              </StatNumber>
              <Text fontSize="sm" color="gray.400">
                Vol/MCap: {(cryptoDetails.total_volume / cryptoDetails.market_cap).toFixed(4)}
              </Text>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>24h Volume</StatLabel>
              <StatNumber fontSize="2xl">
                {formatNumber(cryptoDetails.total_volume)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Circulating Supply</StatLabel>
              <StatNumber fontSize="2xl">
                {formatNumber(cryptoDetails.circulating_supply)}
              </StatNumber>
              <Text fontSize="sm" color="gray.400">
                Max: {cryptoDetails.max_supply ? formatNumber(cryptoDetails.max_supply) : '∞'}
              </Text>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Price Chart */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Price Chart
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                {['1h', '24h', '7d', '30d', '1y'].map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    variant={timeFilter === filter ? 'solid' : 'outline'}
                    bg={timeFilter === filter ? 'brand.500' : 'transparent'}
                  >
                    {filter}
                  </Button>
                ))}
              </ButtonGroup>
            </HStack>
            <Box h="400px">
              <CryptoChart
                cryptoId={id}
                timeFilter={timeFilter}
                showVolume={preferences.showVolume}
                timeFormat={preferences.timeFormat}
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Description */}
      {cryptoDetails.description?.en && (
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                About {cryptoDetails.name}
              </Text>
              <Text
                color="gray.400"
                dangerouslySetInnerHTML={{
                  __html: cryptoDetails.description.en,
                }}
              />
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
} 