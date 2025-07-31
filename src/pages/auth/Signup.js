import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Heading,
  Flex,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { api } from "../../actions/api";
import { Link } from "react-router-dom";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Signup = async () => {
    try {
      const res = await axios.post(api + "/signup", {
        name,
        mobilenumber,
        dateofbirth,
        email,
        password,
      });

      if (res.data.message) {
        console.log(res?.data?.values);
        alert("Signup successful");
        window.location.href = "/signin";
      } else if (res.data.error) {
        if (
          res.data.error ===
          "Email already exists. Please enter another email."
        ) {
          alert("Email already exists. Please enter another email.");
        } else {
          alert(res.data.error);
        }
      } else {
        alert("Unknown error. Please try again.");
      }
    } catch (e) {
      console.log(e);
      alert("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundColor="black"
      px={4}
    >
      <Box
        width={{ base: "100%", sm: "450px", md: "480px" }}
        p={8}
        borderWidth={2}
        borderRadius="lg"
        boxShadow="lg"
        backgroundColor="white"
        borderColor="black"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} fontWeight="bold">
          Sign Up
        </Heading>

        <FormControl mb={4}>
          <FormLabel fontWeight="bold">Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your name"
            borderColor="black"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel fontWeight="bold">Mobile Number</FormLabel>
          <Input
            type="number"
            placeholder="Enter your Mobile number"
            borderColor="black"
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel fontWeight="bold">Date of Birth</FormLabel>
          <Input
            type="date"
            borderColor="black"
            onChange={(e) => setDateofbirth(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel fontWeight="bold">Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            borderColor="black"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <FormControl mb={6}>
          <FormLabel fontWeight="bold">Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            borderColor="black"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormHelperText>Make sure your password is strong.</FormHelperText>
        </FormControl>

        <Button
          colorScheme="orange"
          size="lg"
          width="full"
          onClick={Signup}
          _hover={{
            bg: "black",
            color: "white",
          }}
        >
          Sign Up
        </Button>

        <Text textAlign="center" mt={4}>
          Already have an account?{" "}
          <Link to={"/signin"}>
            <u>Sign in!</u>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default SignUp;
