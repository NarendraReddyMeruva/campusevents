
import { Link } from 'react-router-dom';
import {  Button, Flex, VStack, Image } from '@chakra-ui/react';
import logo from "../../assets/srkrlogo.jpeg"

export const LandingPage = () => {
  return (
    <Flex
      minH="100vh"
      bg="black"
      alignItems="center"
      justifyContent="center"
      p={10}
    >
      <VStack spacing={12}>
       
        <Image 
          src={logo} 
          alt="Coding Club Logo"
          boxSize="600px"
          fallbackSrc="https://via.placeholder.com/150/FFFFFF/000000?text=CC"
        />

      
        <VStack spacing={4} width="500px">
          <Button
            as={Link}
            to="/adminsignin"
            variant="outline"
            colorScheme="black"
            color="white"
            size="lg"
            width="full"
            fontSize={"20px"}
            _hover={{ bg: 'white',
              color:"black"
            }}
          >
            Admin Login
          </Button>

          <Button
            as={Link}
            to="/signin"
            variant="outline"
            colorScheme="black"
            color="white"
            size="lg"
            width="full"
            fontSize={"20px"}
            _hover={{ bg: 'white',
              color:"black"
             }}
          >
            Student Login
          </Button>

          <Button
            as={Link}
            to="/home/688b6a37ce4a6a16fc2de37c"
            variant="outline"
            color="white"
            size="lg"
            width="full"
            fontSize={"20px"}
            _hover={{ bg: "white",
              color:"black"
             }}
          >
            Continue as Guest
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};