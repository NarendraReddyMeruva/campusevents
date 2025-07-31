import React, { useEffect, useState } from 'react';
import {
  Box, Button, Image, Text, SimpleGrid, Stack,
  useToast, Heading, Flex, Badge
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {api} from "../../../actions/api"

const UserEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { userId } = useParams(); // ✅ Extract userId from URL params


  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(api + '/events'); // ✅ Using axios directly
      setEvents(res.data);
    } catch (error) {
      toast({
        title: 'Error fetching events',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (eventId) => {
    if (!userId) {
      toast({
        title: "User ID not found",
        description: "Cannot register without user ID in URL",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    navigate(`/register/${userId}/${eventId}`); // ✅ Navigate with both userId and eventId
  };

  return (
    <Box bg="black" minH="100vh" color="orange.300" p={4}>
      <Heading mb={8} textAlign="center" borderBottom="2px" borderColor="orange.500" pb={2}>
        Upcoming Events
      </Heading>

      {isLoading ? (
        <Flex justify="center" align="center" minH="300px">
          <Text>Loading events...</Text>
        </Flex>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={8} px={4}>
          {events.map(event => (
            <Box
              key={event._id}
              bg="gray.900"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
            >
              {event.photoBase64 && (
                <Image
                  src={event.photoBase64}
                  alt={event.name}
                  h="250px"
                  w="100%"
                  objectFit="cover"
                  borderTopRadius="xl"
                />
              )}
              <Box p={5}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading fontSize="xl">{event.name}</Heading>
                  <Badge colorScheme="orange" px={2} py={1}>
                    {new Date(event.date).toLocaleDateString()}
                  </Badge>
                </Flex>
                <Text noOfLines={3} mb={4}>{event.description}</Text>
                <Button
                  colorScheme="orange"
                  w="full"
                  onClick={() => handleRegister(event._id)}
                  _hover={{ bg: 'orange.600' }}
                >
                  Register Now
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default UserEventsPage;
