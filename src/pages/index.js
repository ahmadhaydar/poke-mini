import {
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
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
    return fetch(pageParam)
      .then((res) => res.json())
      .then((data) => {
        const pokemons = data.results.map(async (pokemon) => {
          const pokemonData = await fetch(pokemon.url).then((res) =>
            res.json()
          );
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types.map((type) => type.type.name),
            sprite: pokemonData.sprites.front_default,
            url: pokemon.url,
          };
        });
        return Promise.all(pokemons).then((pokemons) => {
          return {
            next: data.next,
            results: pokemons,
          };
        });
      });
  };

  const { data, fetchNextPage, isFetching } = useInfiniteQuery(
    ["pokemons"],
    fetchPokemons,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next;
      },
    }
  );

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
    if (bottom && !isFetching) fetchNextPage();
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
        <SimpleGrid minChildWidth={{
          base: "128px",
          sm: "160px",
        }} spacing={4}>
          {data?.pages.map((page) =>
            page?.results.map((pokemon) => (
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
        </SimpleGrid>
        {isFetching && (
          <Flex mt="8" width="100%" align="center" justify="center">
            <Spinner size="lg" thickness="4px" />
          </Flex>
        )}
      </Flex>
      <PokemonDrawer
        onClose={() => {
          onClose();
          setPokemonData(null);
        }}
        isOpen={isOpen}
        pokeData={pokemonData}
      />
    </Flex>
  );
}
