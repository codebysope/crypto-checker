import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  VStack,
  Card,
  CardBody,
  Text,
  Image,
  SimpleGrid,
  Link,
  Skeleton,
  Box,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tabs,
  TabList,
  Tab,
  Wrap,
  WrapItem,
  Badge,
  Heading,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getCryptoNews } from '../services/cryptoApi';
import { format } from 'date-fns';
import { FaNewspaper, FaTag, FaClock, FaLink } from 'react-icons/fa';

const MotionCard = motion(Card);

const NewsCard = ({ article }) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const tagBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');

  return (
    <MotionCard
      bg={cardBg}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      overflow="hidden"
      h="full"
    >
      <CardBody>
        <Box position="relative" mb={4}>
          <Image
            src={article.imageurl}
            alt={article.title}
            borderRadius="lg"
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <HStack
            position="absolute"
            bottom={2}
            left={2}
            spacing={2}
          >
            {article.categories.slice(0, 2).map((category) => (
              <Badge
                key={category}
                colorScheme="brand"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
                bg="rgba(0, 100, 255, 0.8)"
              >
                {category}
              </Badge>
            ))}
          </HStack>
        </Box>

        <VStack align="start" spacing={3}>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: 'none' }}
          >
            <Heading size="md" noOfLines={2} mb={2}>
              {article.title}
            </Heading>
          </Link>

          <Text fontSize="sm" color="gray.400" noOfLines={3}>
            {article.body}
          </Text>

          <Wrap spacing={2} mt={2}>
            {article.tags.slice(0, 3).map((tag) => (
              <WrapItem key={tag}>
                <Tag size="sm" bg={tagBg} borderRadius="full">
                  <TagLeftIcon as={FaTag} />
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>

          <HStack justify="space-between" width="100%" mt={2} pt={2} borderTop="1px" borderColor="whiteAlpha.200">
            <HStack spacing={2}>
              <Icon as={FaNewspaper} color="gray.500" />
              <Text fontSize="sm" color="gray.500">
                {article.source_info?.name}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FaClock} color="gray.500" />
              <Text fontSize="sm" color="gray.500">
                {format(new Date(article.published_on * 1000), 'MMM d, yyyy')}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['cryptoNews', selectedCategory],
    queryFn: () => getCryptoNews(selectedCategory),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading
          size="xl"
          bgGradient="linear(to-r, brand.500, accent.purple)"
          bgClip="text"
          mb={6}
        >
          Crypto News
        </Heading>

        <Tabs variant="soft-rounded" colorScheme="brand" mb={8}>
          <TabList overflowX="auto" py={2}>
            <Tab
              key="ALL"
              onClick={() => setSelectedCategory('ALL')}
              _selected={{ bg: 'brand.500' }}
            >
              All News
            </Tab>
            {Object.entries(data?.categories || {}).map(([key, value]) => (
              key !== 'ALL' && (
                <Tab
                  key={key}
                  onClick={() => setSelectedCategory(value)}
                  _selected={{ bg: 'brand.500' }}
                >
                  {key}
                </Tab>
              )
            ))}
          </TabList>
        </Tabs>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardBody>
                    <Skeleton height="200px" mb={4} />
                    <Skeleton height="20px" mb={2} />
                    <Skeleton height="20px" />
                  </CardBody>
                </Card>
              ))
          : data?.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
      </SimpleGrid>
    </VStack>
  );
} 