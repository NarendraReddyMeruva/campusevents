import React, { useEffect, useState } from 'react';
import {
  Box, Button, Image, Input, Stack, Text, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useToast, IconButton, Textarea,
  useDisclosure
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { api } from '../../actions/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ 
    _id: '',
    name: '', 
    date: '', 
    description: '', 
    photoBase64: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const res = await axios.get(api + '/events');
      setEvents(res.data);
    } catch (error) {
      toast({
        title: 'Error fetching events',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => { 
    fetchEvents(); 
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        photoBase64: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddEvent = async () => {
    if (!formData.name || !formData.date || !formData.description || !formData.photoBase64) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await axios.put(`${api}/events/${formData._id}`, formData);
        toast({
          title: 'Success',
          description: 'Event updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post(api + '/adminevents', formData);
        toast({
          title: 'Success',
          description: 'Event added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchEvents();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: isEditing ? 'Error updating event' : 'Error adding event',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setFormData({
      _id: event._id,
      name: event.name,
      date: event.date,
      description: event.description,
      photoBase64: event.photoBase64
    });
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/events/${id}`);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      _id: '',
      name: '', 
      date: '', 
      description: '', 
      photoBase64: '' 
    });
    setIsEditing(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Box bg="black" minH="100vh" color="orange.300" p={4}>
      <Button 
        onClick={onOpen} 
        colorScheme="orange" 
        mb={4}
        leftIcon={<FaPlus />}
      >
        Add Event
      </Button>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {events.map(event => (
          <Box 
            key={event._id} 
            p={4} 
            bg="gray.900" 
            borderRadius="xl" 
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          >
            {event.photoBase64 && (
              <Image
                src={event.photoBase64}
                alt={event.name}
                borderRadius="lg"
                mb={3}
                h="200px"
                w="100%"
                objectFit="cover"
              />
            )}
            <Text fontSize="xl" fontWeight="bold">{event.name}</Text>
            <Text>Date: {event.date}</Text>
            <Text noOfLines={3}>{event.description}</Text>
            <Stack direction="row" spacing={2} mt={3}>
              <IconButton
                aria-label="Edit event"
                icon={<FaEdit />}
                colorScheme="blue"
                onClick={() => handleEditEvent(event)}
              />
              <IconButton
                aria-label="Delete event"
                icon={<FaTrash />}
                colorScheme="red"
                onClick={() => handleDelete(event._id)}
              />
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="orange.300">
          <ModalHeader>{isEditing ? 'Edit Event' : 'Add New Event'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Input 
                placeholder="Event Name" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
              <Input 
                type="date"
                placeholder="Date" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })} 
              />
              <Textarea
                placeholder="Description" 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                pt={1}
              />
              {formData.photoBase64 && (
                <Image 
                  src={formData.photoBase64} 
                  alt="Preview" 
                  maxH="200px" 
                  mt={2}
                  borderRadius="md"
                />
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="orange" 
              onClick={handleAddEvent}
              isLoading={isLoading}
              mr={3}
            >
              {isEditing ? 'Update' : 'Submit'}
            </Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsPage;