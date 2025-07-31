import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
    Box, Flex, Heading, Text, Button, Image,
    VStack, HStack, Container, Avatar, SimpleGrid,
    useDisclosure, IconButton, Slide, Divider,
    AspectRatio, useInterval, Spinner
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import logo from "../../assets/srkrcodingclublogo.png"
import {api} from "../../actions/api"

const HomePage = () => {
    const { isOpen, onToggle } = useDisclosure();
    const location = useLocation();
    const { id } = useParams();
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeNavItem, setActiveNavItem] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registeredEvents, setRegisteredEvents] = useState([]);
   

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsRes = await axios.get(`${api}/events`);
                setEvents(eventsRes.data);

                if (id) {
                    const regRes = await axios.get(`${api}/register/${id}`);
                    setRegisteredEvents(regRes.data);
                }
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [id]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('events')) setActiveNavItem('events');
        else if (path.includes('gallery')) setActiveNavItem('gallery');
        else if (path.includes('about')) setActiveNavItem('about');
        else setActiveNavItem('');
    }, [location]);

    useInterval(() => {
        if (events.length > 0) {
            setActiveSlide((prev) => (prev + 1) % events.length);
        }
    }, 5000);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box bg="black" color="white" minH="100vh" overflowX="hidden" overflowY="hidden">
            {/* Navigation Bar - Keep exactly as is */}
            <Box bg="white" position="sticky" top={0} zIndex={20} boxShadow="md">
                <Container maxW="container.xl">
                    <Flex h={16} alignItems="center" justifyContent="space-between">
                        <HStack spacing={4}>
                            <Image
                                src={logo}
                                alt="SRKR Coding Club Logo"
                                h="70px"
                                fallbackSrc="https://via.placeholder.com/150x40/000000/FFFFFF?text=SRKR+CC"
                            />
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="black"
                                whiteSpace="nowrap"
                            >
                                SRKREC Coding Club
                            </Text>
                        </HStack>

                        {/* Desktop Nav */}
                        <HStack as="nav" spacing={8} display={{ base: "none", md: "flex" }}>
                            <Link to={`/events/${id}`}>
                                <Button
                                    variant="ghost"
                                    color="black"
                                    position="relative"
                                    fontSize="xl"
                                    fontWeight="bold"
                                    _after={{
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        bg: activeNavItem === 'events' ? 'orange.400' : 'transparent',
                                        transform: activeNavItem === 'events' ? 'scaleX(1)' : 'scaleX(0)',
                                        transition: 'transform 0.3s ease, background 0.3s ease'
                                    }}
                                    _hover={{
                                        _after: {
                                            bg: 'orange.400',
                                            transform: 'scaleX(1)'
                                        }
                                    }}
                                >
                                    Events
                                </Button>
                            </Link>

                            <Link to={`/gallery`}>
                                <Button
                                    variant="ghost"
                                    color="black"
                                    position="relative"
                                    fontSize="xl"
                                    fontWeight="bold"
                                    _after={{
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        bg: activeNavItem === 'gallery' ? 'orange.400' : 'transparent',
                                        transform: activeNavItem === 'gallery' ? 'scaleX(1)' : 'scaleX(0)',
                                        transition: 'transform 0.3s ease, background 0.3s ease'
                                    }}
                                    _hover={{
                                        _after: {
                                            bg: 'orange.400',
                                            transform: 'scaleX(1)'
                                        }
                                    }}
                                >
                                    Gallery
                                </Button>
                            </Link>

                            <Link to={`/about`}>
                                <Button
                                    variant="ghost"
                                    color="black"
                                    position="relative"
                                    fontSize="xl"
                                    fontWeight="bold"
                                    _after={{
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        bg: activeNavItem === 'about' ? 'orange.400' : 'transparent',
                                        transform: activeNavItem === 'about' ? 'scaleX(1)' : 'scaleX(0)',
                                        transition: 'transform 0.3s ease, background 0.3s ease'
                                    }}
                                    _hover={{
                                        _after: {
                                            bg: 'orange.400',
                                            transform: 'scaleX(1)'
                                        }
                                    }}
                                >
                                    About
                                </Button>
                            </Link>

                            <Link to={`/profile/${id}`}>
                                <Avatar
                                    size="md"
                                    name="Profile"
                                    src=" "
                                    _hover={{
                                        boxShadow: '0 0 10px rgba(255, 140, 0, 0.7)',
                                        transform: 'scale(1.1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
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

            {/* Mobile Nav - Keep exactly as is */}
            <Slide direction="right" in={isOpen} style={{ zIndex: 30 }}>
                <Box bg="white" p={4} color="black" shadow="lg" w="full">
                    <VStack align="stretch" spacing={4}>
                        <Link to={`/events/${id}`} onClick={onToggle}>
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

                        <Link to={`/gallery`} onClick={onToggle}>
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

                        <Link to={`/about`} onClick={onToggle}>
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

                        <Link to={`/profile/${id}`} onClick={onToggle}>
                            <Button
                                variant="ghost"
                                w="full"
                                justifyContent="flex-start"
                                fontSize="xl"
                                fontWeight="bold"
                                pl={2}
                            >
                                Profile
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </Slide>

            {/* Hero Slider - Upcoming Events */}
            <Box w="full" h={{ base: "50vh", md: "70vh" }} position="relative" overflow="hidden">
                {events.map((event, index) => (
                    <Box
                        key={event._id}
                        position="absolute"
                        top={0}
                        left={0}
                        w="full"
                        h="full"
                        opacity={index === activeSlide ? 1 : 0}
                        transition="opacity 1s ease-in-out"
                        zIndex={index === activeSlide ? 1 : 0}
                    >
                        <AspectRatio ratio={16 / 9} w="full" h="full">
                            <Box position="relative">
                                <Image
                                    src={`${event.photoBase64}`}
                                    alt={event.name}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    filter="brightness(0.7)"
                                />
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    p={8}
                                    bgGradient="linear(to-t, blackAlpha.900, transparent)"
                                >
                                    <Container maxW="container.xl">
                                        <Heading as="h2" size="2xl" mb={4} color="white">
                                            {event.name}
                                        </Heading>
                                        <Text fontSize="xl" mb={6} color="whiteAlpha.900">
                                            {event.description}
                                        </Text>
                                        <Button
                                            as={Link}
                                            to={`/register/${id}/${event._id}`}
                                            colorScheme="orange"
                                            size="lg"
                                            _hover={{ transform: "scale(1.05)" }}
                                            transition="all 0.2s"
                                        >
                                            Register Now
                                        </Button>
                                    </Container>
                                </Box>
                            </Box>
                        </AspectRatio>
                    </Box>
                ))}

                {/* Slide indicators */}
                <HStack
                    position="absolute"
                    bottom={4}
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={2}
                    spacing={2}
                >
                    {events.map((event, index) => (
                        <Box
                            key={event._id}
                            w="12px"
                            h="12px"
                            borderRadius="full"
                            bg={index === activeSlide ? "orange.400" : "whiteAlpha.500"}
                            cursor="pointer"
                            onClick={() => setActiveSlide(index)}
                            _hover={{ bg: "orange.300" }}
                            transition="background 0.2s"
                        />
                    ))}
                </HStack>
            </Box>

            {/* Rest of your existing content - Keep exactly as is */}
            <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
                {/* Club Story Section */}
                <Box mb={16}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
                        <Box>
                            <Heading as="h2" size="xl" mb={6} color="orange.400">
                                Our Coding Journey
                            </Heading>
                            <Text mb={4} fontSize="lg">
                                Founded in 2015, SRKR Coding Club has grown from a small group of programming enthusiasts to a vibrant community of 200+ members.
                            </Text>
                            <Text mb={4} fontSize="lg">
                                Our mission is to foster technical skills, encourage innovation, and prepare students for the tech industry through hands-on learning.
                            </Text>
                            <Text fontSize="lg">
                                We've conducted 50+ workshops, 15 hackathons, and helped 100+ students land tech internships.
                            </Text>
                        </Box>
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Coding Club Team"
                            borderRadius="lg"
                            objectFit="cover"
                            h="400px"
                            w="full"
                        />
                    </SimpleGrid>
                </Box>

                {/* Registered Events Section (only if user is logged in) */}
                {id && registeredEvents.length > 0 && (
                    <Box mb={16}>
                        <Heading as="h2" size="xl" mb={8} color="teal.400">
                            Your Registered Programs
                        </Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            {registeredEvents.map((event) => (
                                <Box
                                    key={event._id}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    borderColor="whiteAlpha.200"
                                    overflow="hidden"
                                    _hover={{
                                        borderColor: "orange.400",
                                        transform: "translateY(-5px)",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <Image
                                        src={`${event.event.photoBase64}`}
                                        alt={event.event.name}
                                        h="250px"
                                        w="full"
                                        objectFit="cover"
                                    />
                                    <Box p={6}>
                                        <Heading as="h3" size="lg" mb={2} color="orange.400">
                                            {event.event.name}
                                        </Heading>
                                        <Text color="gray.400" mb={2}>{new Date(event.event.date).toLocaleDateString()}</Text>
                                        <Text mb={4}>{event.event.description}</Text>
                                        <Text fontWeight="bold">Registration ID: {event._id}</Text>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}

                {/* All Events Section */}
                <Box mb={16}>
                    <Heading as="h2" size="xl" mb={8} color="teal.400">
                        Upcoming Events
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                        {events.map((event) => (
                            <Box
                                key={event._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                borderColor="whiteAlpha.200"
                                overflow="hidden"
                                _hover={{
                                    borderColor: "orange.400",
                                    transform: "translateY(-5px)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <Image
                                    src={`${event.photoBase64}`}
                                    alt={event.name}
                                    h="250px"
                                    w="full"
                                    objectFit="cover"
                                />
                                <Box p={6}>
                                    <Heading as="h3" size="lg" mb={2} color="orange.400">
                                        {event.name}
                                    </Heading>
                                    <Text color="gray.400" mb={2}>{new Date(event.date).toLocaleDateString()}</Text>
                                    <Text mb={4}>{event.description}</Text>
                                    <Button
                                        as={Link}
                                        to={`/register/${id}/${event._id}`}
                                        colorScheme="orange"
                                        size="sm"
                                        _hover={{ transform: "scale(1.05)" }}
                                        transition="all 0.2s"
                                    >
                                        Register Now
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>

                    <Flex justify="center" mt={8}>
                        <Button
                            as={Link}
                            to={`/events/${id}`}
                            colorScheme="orange"
                            size="lg"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="all 0.2s"
                        >
                            View All Events
                        </Button>
                    </Flex>
                </Box>
            </Container>

            {/* Footer - Keep exactly as is */}
            <Box bg="gray.900" py={8}>
                <Container maxW="container.xl">
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
                        <Image
                            src="/srkr-coding-club-logo.png"
                            alt="SRKR Coding Club Logo"
                            h="30px"
                            mb={{ base: 4, md: 0 }}
                            fallbackSrc="https://via.placeholder.com/150x30/000000/FFFFFF?text=SRKR+CC"
                        />
                        <HStack spacing={6}>
                            <Link to={`/about/${id}`}>About</Link>
                            <Link to={`/events/${id}`}>Events</Link>
                            <Link to={`/gallery/${id}`}>Gallery</Link>
                            <Link to={`/contact/${id}`}>Contact</Link>
                        </HStack>
                    </Flex>
                    <Divider my={4} borderColor="whiteAlpha.200" />
                    <Text textAlign="center" color="gray.500">
                        © {new Date().getFullYear()} SRKR Coding Club. All rights reserved.
                    </Text>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;