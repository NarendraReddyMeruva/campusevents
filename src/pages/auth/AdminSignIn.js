import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Flex,
  Text,
  useToast,
  Spinner
} from "@chakra-ui/react";
import axios from 'axios';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../actions/api";
import { useUser } from '../../context/UserContext';

const AdminSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useUser();

  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${api}/adminsignin`, { 
        email, 
        password 
      });

      if (res.data.message === "Login successful" && res.data.user) {
        const userData = res.data.user;
        setUser(userData);
        
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Navigate to home page with user ID
        setTimeout(() => navigate(`/admin/${userData._id}`), 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        if (error.response.data.error === "Email not found") {
          errorMessage = "Email not found. Please sign up.";
          setTimeout(() => navigate("/adminsignup"), 2000);
        } else if (error.response.data.error === "Incorrect password") {
          errorMessage = "Incorrect password. Please try again.";
        }
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      minH="100vh"
      align="center"
      justify="center"
      bg="black"
      px={{ base: 4, md: 0 }}
    >
      <Box
        w="100%"
        maxW="md"
        p={8}
        borderWidth={1}
        borderColor="gray.700"
        borderRadius="xl"
        bg="gray.900"
        boxShadow="xl"
      >
        <Heading 
          as="h1" 
          size="xl" 
          textAlign="center" 
          mb={8}
          color="orange.400"
        >
          Admin Sign In
        </Heading>

        <form onSubmit={handleSignin}>
          <FormControl mb={6} isRequired>
            <FormLabel color="white">Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              bg="gray.800"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "orange.400",
                boxShadow: "0 0 0 1px orange.400"
              }}
            />
          </FormControl>

          <FormControl mb={8} isRequired>
            <FormLabel color="white">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              bg="gray.800"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "orange.400",
                boxShadow: "0 0 0 1px orange.400"
              }}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="orange"
            size="lg"
            width="full"
            isLoading={isLoading}
            loadingText="Signing In..."
            spinner={<Spinner size="sm" mr={2} />}
            mb={4}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg"
            }}
          >
            Sign In
          </Button>
        </form>

        <Text textAlign="center" color="gray.400" mt={4}>
          Don't have an account?{' '}
          <Button
            as={Link}
            to="/adminsignup"
            variant="link"
            color="orange.400"
            fontWeight="semibold"
            _hover={{ textDecoration: "underline" }}
          >
            Sign Up
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};

export default AdminSignIn;