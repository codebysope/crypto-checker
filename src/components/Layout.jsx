import { Box, Container, Flex, HStack, IconButton, useColorMode, Text, Button } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaChartLine, FaNewspaper, FaGithub } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const navItems = [
  { icon: FaBitcoin, label: 'Markets' },
  { icon: FaChartLine, label: 'Charts' },
  { icon: FaNewspaper, label: 'News' },
];

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh" bg="gray.900">
      {/* Background Pattern */}
      <Box
        position="fixed"
        inset="0"
        zIndex="0"
        opacity="0.05"
        backgroundImage="radial-gradient(circle at 1px 1px, whiteAlpha.400 1px, transparent 0)"
        backgroundSize="40px 40px"
        pointerEvents="none"
      />

      {/* Navbar */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        width="full"
        zIndex="sticky"
        backdropFilter="blur(12px)"
        borderBottom="1px"
        borderColor="whiteAlpha.100"
        bg="rgba(26, 32, 44, 0.8)"
      >
        <Container maxW="7xl" py={4}>
          <Flex justify="space-between" align="center">
            <MotionFlex
              align="center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                as="div"
                w="40px"
                h="40px"
                borderRadius="xl"
                bg="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={3}
              >
                <FaBitcoin size="24px" />
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
              >
                CryptoVision
              </Text>
            </MotionFlex>

            {/* Navigation Items */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  leftIcon={<Box as={item.icon} />}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  {item.label}
                </Button>
              ))}
            </HStack>

            {/* Right Side Actions */}
            <HStack spacing={4}>
              <IconButton
                icon={<FaGithub />}
                variant="ghost"
                aria-label="GitHub"
                _hover={{ bg: 'whiteAlpha.100' }}
              />
              <IconButton
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                variant="ghost"
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
                _hover={{ bg: 'whiteAlpha.100' }}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" pt="90px" pb={8}>
        <Container maxW="7xl">
          <AnimatePresence mode="wait">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </MotionBox>
          </AnimatePresence>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        borderTop="1px"
        borderColor="whiteAlpha.100"
        bg="rgba(26, 32, 44, 0.8)"
        backdropFilter="blur(12px)"
      >
        <Container maxW="7xl" py={4}>
          <Flex justify="center" align="center" direction="column" spacing={2}>
            <Text color="gray.400" fontSize="sm">
              Data provided by{' '}
              <Text
                as="a"
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                color="brand.500"
                _hover={{ color: 'brand.400' }}
              >
                CoinGecko API
              </Text>
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
} 