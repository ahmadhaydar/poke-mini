import {
  Flex,
  Heading,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { PokemonButton } from "src/components/PokemonButton";
import { PokemonDrawer } from "src/components/PokemonDrawer";

export default function Home() {
  const fetchPokemons = async ({
    pageParam = "https://pokeapi.co/api/v2/pokemon?limit=100",
  }) => {
    return fetch(pageParam).then((res) => res.json());
  };

  const { data, fetchNextPage, isFetchingNextPage } =
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex w="100dvw" h="100dvh">
      <Flex
        p="5"
        flexDir="column"
        flex="1"
        overflow="auto"
        onScroll={handleScroll}
      >
        <Heading mb={8} textColor="#313943">
          Pokedex
        </Heading>
        <SimpleGrid minChildWidth="155px" spacing={4}>
          {data?.pages.map((page) =>
            page.results.map((pokemon) => (
              <PokemonButton
                key={pokemon.name}
                onClick={(e) => {
                  setPokemonData(e);
                  onOpen();
                }}
                pokeData={pokemon}
              />
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
      {pokemonData && (
        <PokemonDrawer
          onClose={() => {
            onClose();
            setPokemonData(null);
          }}
          isOpen={isOpen}
          pokemonData={pokemonData}
        />
      )}
    </Flex>
  );
}

