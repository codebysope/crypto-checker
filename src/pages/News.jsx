import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useToast,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCryptoNews } from '../services/cryptoApi';
import { format, formatDistanceToNow } from 'date-fns';
import { FaNewspaper, FaTag, FaClock, FaSearch, FaShare, FaBookmark, FaSortAmountDown, FaFilter, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useInView } from 'react-intersection-observer';

const MotionCard = motion(Card);
const ARTICLES_PER_PAGE = 12;

const NewsCard = ({ article, onSave, isSaved }) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const tagBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');
  const toast = useToast();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.body,
          url: article.url,
        });
        toast({
          title: "Shared successfully",
          status: "success",
          duration: 2000,
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(article.url);
        toast({
          title: "Link copied to clipboard",
          status: "info",
          duration: 2000,
        });
      } catch (clipboardError) {
        toast({
          title: "Failed to copy link",
          status: "error",
          duration: 2000,
        });
      }
    }
  };

  const timeAgo = formatDistanceToNow(new Date(article.published_on * 1000), { addSuffix: true });

  return (
    <MotionCard
      ref={ref}
      bg={cardBg}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      overflow="hidden"
      h="full"
      role="article"
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
            fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
            loading="lazy"
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
          <HStack
            position="absolute"
            top={2}
            right={2}
            spacing={2}
          >
            <IconButton
              icon={<FaShare />}
              size="sm"
              colorScheme="whiteAlpha"
              onClick={handleShare}
              aria-label="Share article"
            />
            <IconButton
              icon={<FaBookmark />}
              size="sm"
              colorScheme={isSaved ? "yellow" : "whiteAlpha"}
              onClick={() => onSave(article)}
              aria-label={isSaved ? "Remove from saved" : "Save article"}
            />
          </HStack>
        </Box>

        <VStack align="start" spacing={3}>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: 'none' }}
            onClick={(e) => {
              // Prevent click if user is selecting text
              if (window.getSelection().toString()) {
                e.preventDefault();
              }
            }}
          >
            <HStack spacing={2} align="start">
              <Heading size="md" noOfLines={2} flex="1">
                {article.title}
              </Heading>
              <Icon as={FaExternalLinkAlt} color="gray.500" mt={1} />
            </HStack>
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
            <Tooltip label={`Source: ${article.source_info?.name}`}>
              <HStack spacing={2}>
                <Icon as={FaNewspaper} color="gray.500" />
                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                  {article.source_info?.name}
                </Text>
              </HStack>
            </Tooltip>
            <Tooltip label={format(new Date(article.published_on * 1000), 'PPP')}>
              <HStack spacing={2}>
                <Icon as={FaClock} color="gray.500" />
                <Text fontSize="sm" color="gray.500">
                  {timeAgo}
                </Text>
              </HStack>
            </Tooltip>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedSources, setSelectedSources] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [savedArticles, setSavedArticles] = useLocalStorage('savedArticles', []);
  const [showSaved, setShowSaved] = useState(false);
  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);
  const prevDataLength = useRef(0);

  const { ref: loadMoreInViewRef, inView: isLoadMoreVisible } = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  });

  // Combine refs for load more button
  const setLoadMoreRef = useCallback(
    (node) => {
      loadMoreRef.current = node;
      loadMoreInViewRef(node);
    },
    [loadMoreInViewRef]
  );

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['cryptoNews', selectedCategory, page],
    queryFn: () => getCryptoNews(selectedCategory, ARTICLES_PER_PAGE * page),
    refetchInterval: 300000, // Refetch every 5 minutes
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    prevDataLength.current = 0;
  }, [selectedCategory]);

  // Check if we have more data to load
  useEffect(() => {
    if (data?.articles) {
      const currentLength = data.articles.length;
      if (currentLength === prevDataLength.current || currentLength < ARTICLES_PER_PAGE * page) {
        setHasMore(false);
      } else {
        prevDataLength.current = currentLength;
      }
    }
  }, [data?.articles, page]);

  // Auto load more when the button comes into view
  useEffect(() => {
    if (isLoadMoreVisible && !showSaved && !isLoading && !isFetching && hasMore) {
      loadMore();
    }
  }, [isLoadMoreVisible, showSaved, isLoading, isFetching, hasMore]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const filteredAndSortedArticles = useMemo(() => {
    if (!data?.articles) return [];
    
    let articles = showSaved ? savedArticles : data.articles;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.body.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.source_info?.name.toLowerCase().includes(query)
      );
    }

    // Apply source filter
    if (selectedSources.length > 0) {
      articles = articles.filter(article =>
        selectedSources.some(source => 
          source.name === article.source_info?.name && 
          source.id === (article.source_info?.lang || 'en')
        )
      );
    }

    // Apply sorting
    return [...articles].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.published_on - a.published_on;
        case 'popularity':
          // Sort by score (upvotes - downvotes) and then by views
          const scoreA = a.score || 0;
          const scoreB = b.score || 0;
          if (scoreB !== scoreA) {
            return scoreB - scoreA;
          }
          return (b.views || 0) - (a.views || 0);
        default:
          return b.published_on - a.published_on;
      }
    });
  }, [data?.articles, searchQuery, sortBy, selectedSources, showSaved, savedArticles]);

  const availableSources = useMemo(() => {
    if (!data?.articles) return [];
    const sourcesMap = new Map();
    data.articles.forEach(article => {
      if (article.source_info?.name) {
        const sourceKey = `${article.source_info.name}_${article.source_info.lang || 'en'}`;
        sourcesMap.set(sourceKey, {
          name: article.source_info.name,
          id: article.source_info.lang || 'en'
        });
      }
    });
    return Array.from(sourcesMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.articles]);

  const handleSaveArticle = useCallback((article) => {
    setSavedArticles(prev => {
      const isAlreadySaved = prev.some(saved => saved.id === article.id);
      if (isAlreadySaved) {
        return prev.filter(saved => saved.id !== article.id);
      }
      return [...prev, article];
    });
  }, []);

  if (error) {
    return (
      <VStack spacing={4} align="center" justify="center" h="60vh">
        <Text color="accent.red" fontSize="lg">
          Error loading news
        </Text>
        <Text color="gray.400" fontSize="md">
          {error.message}
        </Text>
        <Button
          onClick={() => window.location.reload()}
          colorScheme="brand"
          size="sm"
        >
          Retry
        </Button>
      </VStack>
    );
  }

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

        {/* Search and Filters */}
        <HStack mb={6} spacing={4} wrap="wrap">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              ref={searchInputRef}
              placeholder="Search news... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="whiteAlpha.50"
            />
          </InputGroup>

          <Menu>
            <MenuButton as={Button} leftIcon={<FaSortAmountDown />} variant="outline">
              Sort by: {sortBy === 'date' ? 'Latest' : 'Popular'}
            </MenuButton>
            <MenuList>
              <MenuItem 
                onClick={() => setSortBy('date')}
                icon={sortBy === 'date' ? <Icon as={FaCheck} /> : undefined}
              >
                Latest
              </MenuItem>
              <MenuItem 
                onClick={() => setSortBy('popularity')}
                icon={sortBy === 'popularity' ? <Icon as={FaCheck} /> : undefined}
              >
                Popular
              </MenuItem>
            </MenuList>
          </Menu>

          <Button leftIcon={<FaFilter />} onClick={onOpen} variant="outline">
            Filters {selectedSources.length > 0 && `(${selectedSources.length})`}
          </Button>

          <Button
            leftIcon={<FaBookmark />}
            onClick={() => setShowSaved(!showSaved)}
            variant={showSaved ? "solid" : "outline"}
            colorScheme={showSaved ? "yellow" : "gray"}
          >
            Saved ({savedArticles.length})
          </Button>
        </HStack>

        {/* Categories */}
        <Tabs 
          variant="soft-rounded" 
          colorScheme="brand" 
          mb={8}
          onChange={(index) => {
            const categories = Object.values(data?.categories || {});
            setSelectedCategory(index === 0 ? 'ALL' : categories[index]);
            setPage(1); // Reset page when changing category
            setHasMore(true);
          }}
        >
          <TabList overflowX="auto" py={2} css={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' },
          }}>
            <Tab>All News</Tab>
            {Object.entries(data?.categories || {}).map(([key, value]) => (
              key !== 'ALL' && (
                <Tab key={key}>
                  {key}
                </Tab>
              )
            ))}
          </TabList>
        </Tabs>
      </Box>

      {/* Filters Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Filter News</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" spacing={4}>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text>News Sources</Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setSelectedSources([])}
                    isDisabled={selectedSources.length === 0}
                  >
                    Clear All
                  </Button>
                </HStack>
                <VStack align="start" maxH="300px" overflowY="auto" spacing={2}>
                  {availableSources.map(source => (
                    <Checkbox
                      key={`${source.name}_${source.id}`}
                      isChecked={selectedSources.some(s => s.name === source.name && s.id === source.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSources(prev => [...prev, source]);
                        } else {
                          setSelectedSources(prev => 
                            prev.filter(s => !(s.name === source.name && s.id === source.id))
                          );
                        }
                      }}
                    >
                      {source.name}
                    </Checkbox>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* News Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading && page === 1
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
          : filteredAndSortedArticles.map((article) => (
              <NewsCard
                key={`${article.id}-${article.published_on}`}
                article={article}
                onSave={handleSaveArticle}
                isSaved={savedArticles.some(saved => saved.id === article.id)}
              />
            ))}
      </SimpleGrid>

      {/* Load More Section */}
      {!showSaved && filteredAndSortedArticles.length > 0 && hasMore && (
        <Flex justify="center" mt={8} ref={setLoadMoreRef}>
          {isFetching ? (
            <Spinner size="lg" color="brand.500" thickness="4px" />
          ) : (
            <Button
              onClick={loadMore}
              variant="outline"
              colorScheme="brand"
              isDisabled={!hasMore}
            >
              Load More
            </Button>
          )}
        </Flex>
      )}

      {/* Empty State */}
      {filteredAndSortedArticles.length === 0 && !isLoading && (
        <Box textAlign="center" py={10}>
          <Text color="gray.400" fontSize="lg">
            {showSaved
              ? "No saved articles yet"
              : searchQuery
                ? "No articles found matching your search"
                : "No articles found matching your criteria"}
          </Text>
          {(searchQuery || selectedSources.length > 0) && (
            <Button
              mt={4}
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setSelectedSources([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {/* Keyboard Shortcuts Modal Trigger */}
      <Portal>
        <Box
          position="fixed"
          bottom={4}
          right={4}
          bg="gray.800"
          p={2}
          borderRadius="md"
          opacity={0.8}
          _hover={{ opacity: 1 }}
        >
          <Text fontSize="sm" color="gray.400">
            Press Ctrl + K to search
          </Text>
        </Box>
      </Portal>
    </VStack>
  );
} 