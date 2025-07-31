import React, { useState } from 'react';
import {
  Box, Flex, Heading, Input, Button, VStack, Text,
  useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Badge, Table, Thead, Tbody, Tr, Th, Td,
  Tag, TagLabel, Spinner
} from '@chakra-ui/react';
import { FaCheck, FaSearch, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';
import { api } from '../../actions/api';

const TicketVerification = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const toast = useToast();

  const handleVerifyTicket = async () => {
    if (!ticketId) {
      toast({
        title: 'Error',
        description: 'Please enter a ticket ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(`${api}/tickets/verify`, { ticketId });
      setTicketData(response.data);
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Verification failed';
      toast({
        title: 'Error',
        description: errorMsg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGetTicketDetails = async () => {
    if (!ticketId) return;

    setLoading(true);
    try {
      const response = await axios.get(`${api}/tickets/${ticketId}`);
      setTicketData(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch ticket details';
      toast({
        title: 'Error',
        description: errorMsg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? (
      <Badge colorScheme="red" px={2} py={1} borderRadius="full">
        Used
      </Badge>
    ) : (
      <Badge colorScheme="green" px={2} py={1} borderRadius="full">
        Valid
      </Badge>
    );
  };

  return (
    <Box bg="black" color="white" minH="100vh" p={8}>
      <Flex direction="column" maxW="800px" mx="auto">
        <Heading size="xl" mb={8} color="orange.400" textAlign="center">
          <FaTicketAlt style={{ display: 'inline', marginRight: '10px' }} />
          Ticket Verification
        </Heading>

        <VStack spacing={6} bg="gray.900" p={8} borderRadius="xl" boxShadow="lg">
          <Flex width="100%" direction={{ base: 'column', md: 'row' }} gap={4}>
            <Input
              placeholder="Enter Ticket ID"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              size="lg"
              bg="gray.800"
              color="white"
              borderColor="gray.700"
              _hover={{ borderColor: 'orange.400' }}
              _focus={{ borderColor: 'orange.500', boxShadow: '0 0 0 1px orange.500' }}
            />
            <Button
              colorScheme="orange"
              size="lg"
              leftIcon={<FaCheck />}
              onClick={handleVerifyTicket}
              isLoading={isVerifying}
              loadingText="Verifying..."
              flexShrink={0}
            >
              Verify Ticket
            </Button>
            <Button
              variant="outline"
              colorScheme="orange"
              size="lg"
              leftIcon={<FaSearch />}
              onClick={handleGetTicketDetails}
              isLoading={loading}
              loadingText="Loading..."
              flexShrink={0}
            >
              View Details
            </Button>
          </Flex>

          {ticketData && (
            <Box w="100%" mt={6} p={6} bg="gray.800" borderRadius="lg">
              <Heading size="md" mb={4} color="orange.400">
                Verification Result
              </Heading>
              <VStack align="start" spacing={3}>
                <Text>
                  <strong>Status:</strong> {getStatusBadge(ticketData.isVerified)}
                </Text>
                <Text>
                  <strong>Attendee:</strong> {ticketData.attendeeName || 'N/A'}
                </Text>
                {ticketData.attendees && ticketData.attendees.length > 0 && (
                  <Box w="100%">
                    <Text mb={2}><strong>Additional Attendees:</strong></Text>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color="orange.400">Name</Th>
                          <Th color="orange.400">Email</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {ticketData.attendees.map((attendee, index) => (
                          <Tr key={index}>
                            <Td>{attendee.name}</Td>
                            <Td>{attendee.email}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </Flex>

      {/* Ticket Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader color="orange.400">Ticket Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {ticketData ? (
              <VStack spacing={4} align="start">
                <Flex justify="space-between" w="100%">
                  <Text><strong>Ticket ID:</strong> {ticketData.ticketId}</Text>
                  {getStatusBadge(ticketData.isVerified)}
                </Flex>
                
                <Box>
                  <Heading size="sm" color="orange.400" mb={2}>Event Information</Heading>
                  <Text><strong>Event:</strong> {ticketData.eventName || 'N/A'}</Text>
                  <Text><strong>Date:</strong> {ticketData.eventDate ? new Date(ticketData.eventDate).toLocaleString() : 'N/A'}</Text>
                  <Text><strong>Location:</strong> {ticketData.eventLocation || 'N/A'}</Text>
                </Box>

                <Box>
                  <Heading size="sm" color="orange.400" mb={2}>Attendee Information</Heading>
                  <Text><strong>Primary Attendee:</strong> {ticketData.attendeeName || 'N/A'}</Text>
                  <Text><strong>Email:</strong> {ticketData.email || 'N/A'}</Text>
                </Box>

                {ticketData.attendees && ticketData.attendees.length > 0 && (
                  <Box w="100%">
                    <Heading size="sm" color="orange.400" mb={2}>Additional Attendees</Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color="orange.400">Name</Th>
                          <Th color="orange.400">Email</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {ticketData.attendees.map((attendee, index) => (
                          <Tr key={index}>
                            <Td>{attendee.name}</Td>
                            <Td>{attendee.email}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}

                {ticketData.isVerified && (
                  <Tag colorScheme="red" size="lg" mt={4}>
                    <TagLabel>Verified at: {new Date(ticketData.verifiedAt).toLocaleString()}</TagLabel>
                  </Tag>
                )}
              </VStack>
            ) : (
              <Spinner size="xl" color="orange.400" />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TicketVerification;