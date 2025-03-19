import { Box, Container, Flex, HStack, IconButton, useColorMode, Text, Button, useDisclosure, VStack, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon, HamburgerIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaChartLine, FaNewspaper, FaGithub } from 'react-icons/fa';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const navItems = [
  { icon: FaBitcoin, label: 'Markets', path: '/' },
  { icon: FaChartLine, label: 'Charts', path: '/charts' },
  { icon: FaNewspaper, label: 'News', path: '/news' },
];

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const MobileNav = () => (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="gray.900">
        <DrawerCloseButton />
        <DrawerHeader>
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.500, accent.purple)"
            bgClip="text"
          >
            Menu
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {navItems.map((item) => (
              <Button
                key={item.label}
                as={RouterLink}
                to={item.path}
                variant="ghost"
                leftIcon={<Box as={item.icon} />}
                bg={location.pathname === item.path ? 'whiteAlpha.100' : 'transparent'}
                _hover={{ bg: 'whiteAlpha.200' }}
                size="lg"
                justifyContent="flex-start"
                onClick={onClose}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

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
        left="0"
        right="0"
        width="100%"
        zIndex="1000"
        backdropFilter="blur(12px)"
        borderBottom="1px"
        borderColor="whiteAlpha.100"
        bg="rgba(26, 32, 44, 0.8)"
      >
        <Container maxW="7xl" py={4} px={{ base: 4, md: 6 }}>
          <Flex justify="space-between" align="center" gap={4}>
            <MotionFlex
              as={RouterLink}
              to="/"
              align="center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              _hover={{ textDecoration: 'none' }}
              flex="0 0 auto"
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
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
                whiteSpace="nowrap"
              >
                CryptoVision
              </Text>
            </MotionFlex>

            {/* Navigation Items */}
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }} flex="1" justify="center">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  as={RouterLink}
                  to={item.path}
                  variant="ghost"
                  leftIcon={<Box as={item.icon} />}
                  bg={location.pathname === item.path ? 'whiteAlpha.100' : 'transparent'}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  size="md"
                >
                  {item.label}
                </Button>
              ))}
            </HStack>

            {/* Right Side Actions */}
            <HStack spacing={2} flex="0 0 auto">
              <IconButton
                as="a"
                href="https://github.com/codebysope/crypto-checker"
                target="_blank"
                rel="noopener noreferrer"
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
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="ghost"
                aria-label="Open menu"
                icon={<HamburgerIcon />}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <MobileNav />

      {/* Main Content */}
      <Box as="main" pt={{ base: "80px", md: "90px" }} pb={8}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={location.pathname}
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
                href="https://www.coindesk.com/indices"
                target="_blank"
                rel="noopener noreferrer"
                color="brand.500"
                _hover={{ color: 'brand.400' }}
              >
                CoinDesk Indices
              </Text>
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
} 