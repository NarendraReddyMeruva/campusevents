import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input,
  VStack, Heading, useToast, Spinner, Text
} from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { api } from '../../../actions/api';
import { useNavigate} from "react-router-dom";


const EventRegister = () => {
  const navigate = useNavigate();
  const { userId, eventId } = useParams(); // both userId and eventId from URL
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendees: 1 });
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${api}/register/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        toast({
          title: 'Failed to load event',
          description: err.response?.data?.error || err.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post(`${api}/register/${userId}/${eventId}`, formData);
      setTicket(res.data);

      toast({
        title: 'Ticket Generated',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Ticket generation failed',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading event details...</Text>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box textAlign="center" mt={10}>
        <Heading size="md">Event not found.</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} bg="gray.800" borderRadius="lg" color="white">
      <Heading mb={6} textAlign="center">{event.name}</Heading>

      {ticket ? (
        <Box textAlign="center">
          <Text mb={4}>Ticket Generated Successfully!</Text>
          <QRCodeCanvas
            value={ticket.ticketId}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <Text mt={4}><strong>Ticket ID:</strong> {ticket.ticketId}</Text>
          <Button
        mt={6}
        colorScheme="orange"
        onClick={() => navigate(`/events/${userId}`)}
      >
        Back to Events
      </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>No. of Attendees</FormLabel>
              <Input name="attendees" type="number" min={1} value={formData.attendees} onChange={handleChange} />
            </FormControl>

            <Button type="submit" colorScheme="orange" width="full">
              Generate Ticket
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

export default EventRegister;
