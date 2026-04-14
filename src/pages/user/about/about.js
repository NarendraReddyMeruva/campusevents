import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Container,
  SimpleGrid,
  useDisclosure,
  IconButton,
  Slide,
  Divider,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "../../../assets/srkrlogo.jpeg"

const AboutPage = () => {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("events")) setActiveNavItem("events");
    else if (path.includes("gallery")) setActiveNavItem("gallery");
    else if (path.includes("about")) setActiveNavItem("about");
    else setActiveNavItem("");
  }, [location]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box bg="black" color="white" minH="100vh" overflowX="hidden">
      {/* Navigation Bar */}
      <Box bg="white" position="sticky" top={0} zIndex={20} boxShadow="md">
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <HStack spacing={4}>
              <Image
                src={logo}
                alt="SRKR CampusEvents Logo"
                h="70px"
                fallbackSrc="https://via.placeholder.com/150x40/000000/FFFFFF?text=SRKR+CE"
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="black"
                whiteSpace="nowrap"
              >
                SRKR CampusEvents
              </Text>
            </HStack>

            {/* Desktop Nav */}
            <HStack as="nav" spacing={8} display={{ base: "none", md: "flex" }}>
              <Link to="/events">
                <Button
                  variant="ghost"
                  color="black"
                  position="relative"
                  fontSize="xl"
                  fontWeight="bold"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    height: "2px",
                    bg:
                      activeNavItem === "events" ? "orange.400" : "transparent",
                    transform:
                      activeNavItem === "events" ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.3s ease, background 0.3s ease",
                  }}
                  _hover={{
                    _after: {
                      bg: "orange.400",
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Events
                </Button>
              </Link>

              <Link to="/gallery">
                <Button
                  variant="ghost"
                  color="black"
                  position="relative"
                  fontSize="xl"
                  fontWeight="bold"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    height: "2px",
                    bg:
                      activeNavItem === "gallery" ? "orange.400" : "transparent",
                    transform:
                      activeNavItem === "gallery" ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.3s ease, background 0.3s ease",
                  }}
                  _hover={{
                    _after: {
                      bg: "orange.400",
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  Gallery
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="ghost"
                  color="black"
                  position="relative"
                  fontSize="xl"
                  fontWeight="bold"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    height: "2px",
                    bg:
                      activeNavItem === "about" ? "orange.400" : "transparent",
                    transform:
                      activeNavItem === "about" ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.3s ease, background 0.3s ease",
                  }}
                  _hover={{
                    _after: {
                      bg: "orange.400",
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  About
                </Button>
              </Link>
            </HStack>

            {/* Mobile Nav Toggle */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={onToggle}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="outline"
              aria-label="Toggle Navigation"
              color="black"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Nav */}
      <Slide direction="right" in={isOpen} style={{ zIndex: 30 }}>
        <Box bg="white" p={4} color="black" shadow="lg" w="full">
          <VStack align="stretch" spacing={4}>
            <Link to="/events" onClick={onToggle}>
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                fontSize="xl"
                fontWeight="bold"
              >
                Events
              </Button>
            </Link>
            <Link to="/gallery" onClick={onToggle}>
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                fontSize="xl"
                fontWeight="bold"
              >
                Gallery
              </Button>
            </Link>
            <Link to="/about" onClick={onToggle}>
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                fontSize="xl"
                fontWeight="bold"
              >
                About
              </Button>
            </Link>
          </VStack>
        </Box>
      </Slide>

      {/* About Page Content */}
      <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={12}>
        <Box textAlign="center" mb={16}>
          <Heading as="h1" size="2xl" color="orange.400" mb={4}>
            About SRKR CampusEvents
          </Heading>
          <Text fontSize="xl" color="gray.300" maxW="3xl" mx="auto">
            SRKR CampusEvents is the official platform for managing and celebrating
            all campus activities and technical events at SRKR Engineering College.
            We connect students, organizers, and departments through a unified space
            that makes event discovery, registration, and participation effortless.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} mb={20}>
          <Box>
            <Heading as="h2" size="xl" mb={4} color="teal.400">
              Our Mission
            </Heading>
            <Text fontSize="lg" mb={4}>
              To bring every campus event under one digital roof, simplifying
              coordination and boosting student engagement.
            </Text>
            <Text fontSize="lg" mb={4}>
              We aim to make every event—be it a workshop, hackathon, or fest—
              easily accessible and organized through technology.
            </Text>
            <Text fontSize="lg">
              Together, we make campus life more vibrant, connected, and memorable.
            </Text>
          </Box>
          <Image
            src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=900&q=80"
            alt="Campus Event"
            borderRadius="lg"
            objectFit="cover"
            h="400px"
            w="full"
          />
        </SimpleGrid>

        <Box textAlign="center" mb={16}>
          <Heading as="h2" size="xl" mb={6} color="orange.400">
            Our Team
          </Heading>
          <Text fontSize="lg" mb={10} color="gray.300">
            The dedicated team behind SRKR CampusEvents ensures every event,
            seminar, and celebration is executed seamlessly.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              { name: "Narendra Reddy", role: "Member" },
              { name: "Marri Nandini", role: "Member" },
              { name: "LINGAMPALLI RAKESH", role: "Member" },
               { name: "MANDAPATI SRI VENKATA SIVA KRISHNA", role: "Member" },
            ].map((member, i) => (
              <Box
                key={i}
                p={6}
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                borderRadius="lg"
                textAlign="center"
                _hover={{
                  borderColor: "orange.400",
                  transform: "translateY(-5px)",
                  transition: "all 0.3s ease",
                }}
              >
                <Avatar
                  size="xl"
                  name={member.name}
                  mb={4}
                  src="https://via.placeholder.com/150"
                />
                <Heading as="h3" size="md" color="orange.300">
                  {member.name}
                </Heading>
                <Text color="gray.400">{member.role}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Flex justify="center" mt={10}>
          <Button
            as={Link}
            to="/events"
            colorScheme="orange"
            size="lg"
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Explore Upcoming Events
          </Button>
        </Flex>
      </Container>

      {/* Footer */}
      <Box bg="gray.900" py={8}>
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            <Image
              src={logo}
              alt="SRKR CampusEvents Logo"
              h="100px"
              mb={{ base: 4, md: 0 }}
              fallbackSrc="https://via.placeholder.com/150x30/000000/FFFFFF?text=SRKR+CE"
            />
            <HStack spacing={6}>
              <Link to="/about">About</Link>
              <Link to="/events">Events</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
            </HStack>
          </Flex>
          <Divider my={4} borderColor="whiteAlpha.200" />
          <Text textAlign="center" color="gray.500">
            © {new Date().getFullYear()} SRKR CampusEvents. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
