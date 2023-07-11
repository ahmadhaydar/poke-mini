import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import PokeballVector from "./components/PokeballVector";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";

export default function Home() {
  const fetchPokemons = ({
    pageParam = "https://pokeapi.co/api/v2/pokemon?limit=20",
  }) => {
    return fetch(pageParam).then((res) => res.json());
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["pokemons"],
    fetchPokemons,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next;
      },
    }
  );

  return (
    <Flex w="100vw" h="100vh" overflow="auto">
      <Flex p="5" flexDir="column" flex="1">
        <Heading mb={8} fontColor="#313943">
          Pokedex
        </Heading>
        <SimpleGrid minChildWidth="155px" spacing={4}>
          {data?.pages.map((page) =>
            page.results.map((pokemon) => (
              <PokemonButton key={pokemon.name} pokeData={pokemon} />
            ))
          )}
          <Button
            colorScheme="teal"
            onClick={fetchNextPage}
            height="128px"
            isLoading={isFetchingNextPage}
            isDisabled={isFetchingNextPage}
          />
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

const TypeBadge = ({ value }) => (
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
  >
    {value}
  </Flex>
);

const PokemonButton = ({ pokeData }) => {
  const { data } = useQuery(
    ["pokemon", pokeData?.name],
    () => {
      return fetch(pokeData?.url).then((res) => res.json());
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Skeleton rounded="2xl" isLoaded={data}>
      <VStack
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
          transform: "scale(0.5)",
        }}
        userSelect="none"
        rounded="2xl"
        overflow="hidden"
      >
        <Heading color="rgba(0, 0, 0, 0.2)" align="end" size="sm">
          #001
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
              color="rgba(255, 255, 255, 0.2)"
            />
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
                src={data?.sprites.other["official-artwork"].front_default}
              />
            </Box>
          </Box>
        </Flex>
      </VStack>
    </Skeleton>
  );
};

const colorDict = {
  grass: "#49d0b0",
  poison: "#a77bd9",
  fire: "#ff9c54",
  flying: "#9bb4e8",
  water: "#58abf6",
  bug: "#a8b822",
  normal: "#a8a878",
  electric: "#f8d030",
  ground: "#e0c068",
  fairy: "#ee99ac",
  fighting: "#c03028",
  psychic: "#f85888",
  rock: "#b8a038",
  steel: "#b8b8d0",
  ice: "#98d8d8",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
};
