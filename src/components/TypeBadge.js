import { Flex } from "@chakra-ui/react";
import React from "react";

export const TypeBadge = ({ value, ...props }) => (
  <Flex
    align="center"
    justify="center"
    py="1"
    px="3"
    rounded="full"
    fontSize="2xs"
    bgColor="rgba(255, 255, 255, 0.2)"
    color="#FFFFFF"
    textTransform="capitalize"
    {...props}
  >
    {value}
  </Flex>
);
