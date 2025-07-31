import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Flex, Heading, Text, Avatar, VStack,
  HStack, Container, Divider, Spinner,
  Badge, Button, useToast, Icon
} from '@chakra-ui/react';
import { FiEdit, FiCalendar, FiPhone, FiMail, FiLogOut } from 'react-icons/fi';
import {api} from "../../actions/api"

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSignOut = () => {
    // Add any sign-out logic here (clearing tokens, etc.)
    navigate('/');
  };

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        // ✅ UPDATE BACKEND URL HERE
        const response = await axios.get(`${api}/profile/${id}`);
        setProfile(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load profile';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="black">
        <Spinner size="xl" color="orange.400" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="black">
        <Text color="white">{error}</Text>
      </Flex>
    );
  }

  if (!profile) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="black">
        <Text color="white">Profile not found</Text>
      </Flex>
    );
  }

  return (
    <Box bg="black" color="white" minH="100vh" py={10}>
      <Container maxW="container.lg">
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          {/* Left Side - Profile Card */}
          <Box
            w={{ base: '100%', md: '30%' }}
            bg="gray.900"
            borderRadius="lg"
            p={6}
            boxShadow="dark-lg"
          >
            <VStack spacing={4} align="center">
              <Avatar
                size="2xl"
                name={profile.name}
                bg="orange.400"
                color="black"
                fontWeight="bold"
              />
              <Heading size="lg" color="orange.400">
                {profile.name}
              </Heading>
              <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                Member
              </Badge>

              <Divider borderColor="gray.700" />

              <VStack spacing={3} align="start" w="full">
                <HStack>
                  <Icon as={FiMail} color="orange.400" />
                  <Text>{profile.email}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiPhone} color="orange.400" />
                  <Text>{profile.phone || 'Not provided'}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiCalendar} color="orange.400" />
                  <Text>
                    {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not provided'}
                  </Text>
                </HStack>
              </VStack>

              <Button
                leftIcon={<FiEdit />}
                colorScheme="orange"
                variant="outline"
                w="full"
                mt={2}
              >
                Edit Profile
              </Button>

              <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="solid"
                w="full"
                mt={2}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </VStack>
          </Box>

          {/* Right Side - Content */}
          <Box
            flex={1}
            bg="gray.900"
            borderRadius="lg"
            p={6}
            boxShadow="dark-lg"
          >
            <Heading size="lg" mb={6} color="orange.400">
              Your Activities
            </Heading>

            <Box mb={8}>
              <Heading size="md" mb={4}>
                Registered Events
              </Heading>
              <Box
                p={4}
                bg="gray.800"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="orange.400"
              >
                <Text>You haven't registered for any events yet.</Text>
                <Button colorScheme="orange" size="sm" mt={2}>
                  Browse Events
                </Button>
              </Box>
            </Box>

            <Box>
              <Heading size="md" mb={4}>
                Achievements
              </Heading>
              <Box
                p={4}
                bg="gray.800"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="orange.400"
              >
                <Text>No achievements yet.</Text>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default ProfilePage;
