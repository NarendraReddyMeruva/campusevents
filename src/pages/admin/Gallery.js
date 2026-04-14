import React, { useEffect, useState } from 'react';
import {
  Box, Button, Image, Input, Stack, Text, VStack, useDisclosure, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useToast, IconButton, SimpleGrid, Select
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { api } from '../../actions/api';

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ 
    _id: '',
    name: '',
    regno: '',
    role: 'member',
    photoBase64: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const roles = ['member', 'coordinator', 'leader', 'mentor'];

  const fetchGallery = async () => {
    try {
      const res = await axios.get(api + '/gallery');
      setGallery(res.data);
    } catch (error) {
      toast({
        title: 'Error fetching gallery',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => { 
    fetchGallery(); 
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

  const handleAddMember = async () => {
    if (!formData.name || !formData.regno || !formData.photoBase64) {
      toast({
        title: 'Error',
        description: 'All fields except role are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await axios.put(`${api}/gallery/${formData._id}`, formData);
        toast({
          title: 'Success',
          description: 'Member updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post(api + '/admingallery', formData);
        toast({
          title: 'Success',
          description: 'Member added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchGallery();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: isEditing ? 'Error updating member' : 'Error adding member',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setFormData({
      _id: member._id,
      name: member.name,
      regno: member.regno,
      role: member.role,
      photoBase64: member.photoBase64
    });
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/gallery/${id}`);
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchGallery();
    } catch (error) {
      toast({
        title: 'Error deleting member',
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
      regno: '',
      role: 'member',
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
        Add Member
      </Button>
      
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {gallery.map(member => (
          <Box 
            key={member._id} 
            p={4} 
            bg="gray.900" 
            borderRadius="xl" 
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          >
            {member.photoBase64 && (
              <Image
                src={member.photoBase64}
                alt={member.name}
                borderRadius="lg"
                mb={3}
                h="200px"
                w="100%"
                objectFit="cover"
              />
            )}
            <Text fontSize="xl" fontWeight="bold">{member.name}</Text>
            <Text>Reg No: {member.regno}</Text>
            <Text>Role: {member.role}</Text>
            <Stack direction="row" spacing={2} mt={3}>
              <IconButton
                aria-label="Edit member"
                icon={<FaEdit />}
                colorScheme="blue"
                onClick={() => handleEditMember(member)}
              />
              <IconButton
                aria-label="Delete member"
                icon={<FaTrash />}
                colorScheme="red"
                onClick={() => handleDelete(member._id)}
              />
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="orange.300">
          <ModalHeader>{isEditing ? 'Edit Member' : 'Add New Member'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input 
                placeholder="Full Name" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
              <Input 
                placeholder="Registration Number" 
                value={formData.regno}
                onChange={e => setFormData({ ...formData, regno: e.target.value })} 
              />
              <Select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                {roles.map(role => (
                  <option key={role} value={role} style={{ background: '#1A202C', color: '#ED8936' }}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </Select>
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="orange" 
              onClick={handleAddMember}
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

export default GalleryPage;
