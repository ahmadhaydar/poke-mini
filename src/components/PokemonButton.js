import {
  Box,
  Flex, Heading,
  Image, Skeleton, VStack
} from "@chakra-ui/react";
import PokeballVector from "./PokeballVector";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TypeBadge } from "./TypeBadge";
import { colorDict } from "src/components/colorDict";

export const PokemonButton = ({ pokeData, onClick = () => { } }) => {
  const { data } = useQuery(
    ["pokemon", pokeData?.name],
    async () => {
      return fetch(pokeData?.url).then((res) => res.json());
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!pokeData,
    }
  );

  return (
    <Skeleton rounded="2xl" isLoaded={data}>
      <VStack
        onClick={() => onClick(data)}
        align="stretch"
        spacing={0}
        p={3}
        direction="column"
        height="128px"
        bgColor={colorDict[data?.types[0].type.name]}
        _hover={{
          transform: "scale(1.05)",
          transition: "transform 0.2s",
        }}
        _active={{
          transform: "scale(0.95)",
          transition: "transform 0.2s",
        }}
        userSelect="none"
        rounded="2xl"
        overflow="hidden"
      >
        <Heading color="rgba(0, 0, 0, 0.2)" align="end" size="sm">
          #{data?.id}
        </Heading>
        <Flex flex={1}>
          <Flex direction="column" align="start">
            <Heading
              textTransform="capitalize"
              mb="2"
              size="sm"
              color="#FFFFFF"
            >
              {data?.name}
            </Heading>
            <VStack align="start" spacing="1">
              {data?.types.map((type) => (
                <TypeBadge key={type.type.name} value={type.type.name} />
              ))}
            </VStack>
          </Flex>
          <Box flex="1" position="relative">
            <PokeballVector
              position="absolute"
              right="-20%"
              bottom="-50%"
              w={{
                base: "96px",
                md: "110px",
              }}
              color="rgba(255, 255, 255, 0.2)" />
            <Box
              position="absolute"
              right="10%"
              bottom="-10%"
              width={{
                base: "64px",
                md: "80px",
              }}
              height={{
                base: "64px",
                md: "80px",
              }}
            >
              <Image
                boxSize={{
                  base: "64px",
                  md: "80px",
                }}
                loading="lazy"
                src={data?.sprites.other["official-artwork"].front_default} />
            </Box>
          </Box>
        </Flex>
      </VStack>
    </Skeleton>
  );
};
