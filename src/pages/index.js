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
  Spacer,
  VStack,
} from "@chakra-ui/react";
import PokeballVector from "../components/PokeballVector";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";

export default function Home() {
  const fetchPokemons = async ({
    pageParam = "https://pokeapi.co/api/v2/pokemon?limit=40",
  }) => {
    return fetch(pageParam).then((res) => res.json());
  };

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(["pokemons"], fetchPokemons, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next;
      },
    });

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
    if (bottom && !isFetchingNextPage) fetchNextPage();
  };

  const [pokemonData, setPokemonData] = React.useState(null);

  return (
    <Flex w="100vw" h="100vh">
      <Flex
        p="5"
        flexDir="column"
        flex="1"
        overflow="auto"
        onScroll={handleScroll}
      >
        <Heading mb={8} fontColor="#313943">
          Pokedex
        </Heading>
        <SimpleGrid minChildWidth="155px" spacing={4}>
          {data?.pages.map((page) =>
            page.results.map((pokemon) => (
              <PokemonButton key={pokemon.name} onClick={
                (e) => setPokemonData(e)
              } pokeData={pokemon} />
            ))
          )}
          {isFetchingNextPage && (
            <>
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
              <PokemonButton />
            </>
          )}
        </SimpleGrid>
      </Flex>
      <Flex
        display={{
          base: "none",
          md: "flex",
        }}
        direction="column"
        flex={1}
        bgColor={colorDict[pokemonData?.types[0].type.name] || "#DFDFDF"}
        overflowX="hidden"
        overflowY="auto"
        position="relative"
      >
        <PokeballVector
          position="absolute"
          right="-10%"
          bottom="50%"
          w="300px"
          color="rgba(255, 255, 255, 0.2)"
          // make it spin slowly
          animation="spin 20s linear infinite"
          sx={{
            "@keyframes spin": {
              from: {
                transform: "rotate(0deg)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
        />
        <HStack p="5">
          <VStack align="start">
            <Heading textTransform="capitalize" color="#FFFFFF" size="xl">
              {pokemonData?.name}
            </Heading>
            <HStack>
              {pokemonData?.types.map((type) => (
                <TypeBadge key={type.type.name} value={type.type.name} fontSize="sm"/>
              ))}
            </HStack>
          </VStack>
          <Spacer />
          <Heading color="#FFFFFF" size="md">
            #{pokemonData?.id}
          </Heading>
        </HStack>
        <Flex height="160px" position="relative">
          <Image
            position="absolute"
            // horizonally centered, add an offset -bottom to overlap the bottom part
            left="50%"
            transform="translateX(-50%)"
            bottom="-20%"
            boxSize={{
              base: "160px",
              md: "256px",
            }}
            loading="lazy"
            src={pokemonData?.sprites.other["official-artwork"].front_default}
            display={pokemonData ? "block" : "none"}
          />
        </Flex>
        <Flex
          roundedTopLeft="3xl"
          roundedTopRight="3xl"
          bgColor="white"
          flex={1}
        ></Flex>
      </Flex>
    </Flex>
  );
}

const TypeBadge = ({ value, ...props }) => (
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

const PokemonButton = ({ pokeData, onClick = () => {} }) => {
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
          transform: "scale(0.5)",
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
