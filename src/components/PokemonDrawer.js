import {
  Flex,
  HStack,
  Heading,
  Image,
  Spacer,
  VStack,
  Text,
  IconButton,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { Drawer, DrawerOverlay, DrawerContent } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import PokeballVector from "src/components/PokeballVector";
import React from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { TypeBadge } from "src/components/TypeBadge";
import { colorDict } from "./colorDict";
import { useQuery } from "@tanstack/react-query";

export const PokemonDrawer = ({ onClose, isOpen, pokeData }) => {
  const { data, isLoading } = useQuery(
    ["pokemon", pokeData?.url],
    async () => {
      const pokemonData = await fetch(pokeData?.url).then((res) => res.json());
      return pokemonData;
    },
    {
      enabled: !!pokeData,
    }
  );

  return (
    <Drawer size="md" placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        {!isLoading ? (<Flex
          direction="column"
          flex={1}
          bgColor={colorDict[data?.types[0].type.name] || "#DFDFDF"}
          overflowX="hidden"
          overflowY="auto"
          position="relative"
        >
          <PokeballVector
            position="absolute"
            right="-10%"
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
              <IconButton
                icon={<ArrowBackIcon />}
                variant="ghost"
                colorScheme="white.alpha.50"
                textColor="white"
                onClick={onClose}
              />
              <Heading textTransform="capitalize" color="#FFFFFF" size="xl">
                {data?.name}
              </Heading>
              <HStack>
                {data?.types.map((type) => (
                  <TypeBadge
                    key={type.type.name}
                    value={type.type.name}
                    fontSize="sm"
                  />
                ))}
              </HStack>
            </VStack>
            <Spacer />
            <Heading color="#FFFFFF" size="md">
              #{data?.id}
            </Heading>
          </HStack>
          <Flex minHeight="160px" maxH="160px" position="relative">
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
              src={data?.sprites.other["official-artwork"].front_default}
              display={data ? "block" : "none"}
            />
          </Flex>
          <Flex
            roundedTopLeft="3xl"
            roundedTopRight="3xl"
            bgColor="white"
            flex={1}
            p="3"
          >
            <Tabs width="100%" height="100%">
              <TabList width="100%">
                <Tab w="25%">About</Tab>
                <Tab w="25%">Base Stats</Tab>
                <Tab w="25%">Evolution</Tab>
                <Tab w="25%">Moves</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <HStack mb="4" width="100%" spacing="0">
                    <Text width="50%" color="gray.500">
                      Height
                    </Text>
                    <Text width="50%" fontWeight="semibold">
                      {data?.height / 10}m
                    </Text>
                  </HStack>
                  <HStack mb="4" width="100%" spacing="0">
                    <Text width="50%" color="gray.500">
                      Weight
                    </Text>
                    <Text width="50%" fontWeight="semibold">
                      {data?.weight / 10}kg
                    </Text>
                  </HStack>
                  <HStack mb="4" width="100%" spacing="0">
                    <Text width="50%" color="gray.500">
                      Abilities
                    </Text>
                    <Text
                      width="50%"
                      textTransform="capitalize"
                      fontWeight="semibold"
                    >
                      {data?.abilities
                        .map((ability) => ability.ability.name)
                        .join(", ")}
                    </Text>
                  </HStack>
                </TabPanel>
                <TabPanel>
                  {data?.stats.map(({ base_stat, stat }) => (
                    <HStack mb="4" width="100%" spacing="0">
                      <Text
                        width="30%"
                        textTransform={
                          stat.name === "hp" ? "uppercase" : "capitalize"
                        }
                        color="gray.500"
                      >
                        {stat.name}
                      </Text>
                      <Text width="10%" fontWeight="semibold">
                        {base_stat}
                      </Text>
                      <Progress
                        rounded="full"
                        width="60%"
                        value={(base_stat / 255) * 100}
                        size="sm"
                        colorScheme={
                          base_stat > 100
                            ? "green"
                            : base_stat > 50
                            ? "yellow"
                            : "red"
                        }
                      />
                    </HStack>
                  ))}
                </TabPanel>
                <TabPanel>
                  <Flex w="100%" h="100%" align="center" justify="center">
                    <Text> Not Implemented </Text>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex w="100%" h="100%" align="center" justify="center">
                    <Text> Not Implemented </Text>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Flex>) : <Flex direction="column" justify="center" align="center" w="100%" h="100%" bgColor={colorDict[
          pokeData?.types[0]
        ]}>
          <Spinner color="white" size="xl" mb="3" thickness="5px"/>
          <Heading color="white" size="xl">Loading...</Heading>
          </Flex>}
      </DrawerContent>
    </Drawer>
  );
};
