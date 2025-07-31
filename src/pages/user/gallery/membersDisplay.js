import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Heading, SimpleGrid, Image, Text,
  Spinner, useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, useDisclosure,Badge,VStack
} from '@chakra-ui/react';
import { api } from '../../../actions/api';
import axios from 'axios';

const UserGalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/gallery`);
      setGallery(response.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery');
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery members',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    onOpen();
  };

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

  return (
    <Box bg="black" color="white" minH="100vh" py={8} px={4}>
      <Flex justify="center" mb={10}>
        <Heading size="xl" color="orange.400" textAlign="center">
          Our Team Gallery
        </Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} px={4}>
        {gallery.map((member) => (
          <Box
            key={member._id}
            bg="gray.900"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="lg"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(255, 140, 0, 0.4)',
            }}
            transition="all 0.3s ease"
            cursor="pointer"
            onClick={() => handleMemberClick(member)}
          >
            <Image
              src={member.photoBase64}
              alt={member.name}
              w="100%"
              h="250px"
              objectFit="cover"
              borderTopRadius="xl"
            />
            <Box p={4}>
              <Heading size="md" color="orange.400" mb={1}>
                {member.name}
              </Heading>
              <Text color="gray.400" fontSize="sm" mb={1}>
                {member.class}
              </Text>
              <Badge colorScheme={getRoleColor(member.role)} borderRadius="full" px={2}>
                {member.role.toUpperCase()}
              </Badge>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Member Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white" border="1px" borderColor="orange.400">
          <ModalHeader color="orange.400">{selectedMember?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMember && (
              <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                <Box flex={1}>
                  <Image
                    src={selectedMember.photoBase64}
                    alt={selectedMember.name}
                    borderRadius="xl"
                    w="100%"
                    maxH="400px"
                    objectFit="cover"
                  />
                </Box>
                <Box flex={1}>
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontWeight="bold" color="orange.400">Class:</Text>
                      <Text>{selectedMember.class}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="orange.400">Registration Number:</Text>
                      <Text>{selectedMember.regno}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="orange.400">Role:</Text>
                      <Badge colorScheme={getRoleColor(selectedMember.role)} fontSize="md">
                        {selectedMember.role.toUpperCase()}
                      </Badge>
                    </Box>
                  </VStack>
                </Box>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Helper function to get color based on role
const getRoleColor = (role) => {
  switch (role) {
    case 'leader': return 'red';
    case 'coordinator': return 'blue';
    case 'mentor': return 'purple';
    default: return 'orange';
  }
};

export default UserGalleryPage;