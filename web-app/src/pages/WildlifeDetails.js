import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/WildlifeDetails.css';

// Mock data for wildlife details
const mockWildlifeData = {
  orangutan: {
    name: 'Orangutan',
    description: 'Orangutans are one of the closest relatives to humans and are highly intelligent.',
    sightings: 12,
    habitat: 'Rainforests of Borneo and Sumatra',
  },
  'clouded-leopard': {
    name: 'Clouded Leopard',
    description: 'The clouded leopard is known for its cloud-shaped spots and is a master of climbing trees.',
    sightings: 5,
    habitat: 'Dense forests of Southeast Asia',
  },
  'proboscis-monkey': {
    name: 'Proboscis Monkey',
    description: 'Known for their large noses, these monkeys are found near rivers and mangroves in Borneo.',
    sightings: 8,
    habitat: 'Mangrove forests in Borneo',
  },
  hornbill: {
    name: 'Hornbill',
    description: 'Hornbills are large birds with huge beaks, often found in tropical forests.',
    sightings: 15,
    habitat: 'Tropical and subtropical forests',
  },
};

const WildlifeDetails = () => {
  const { species } = useParams();
  const animal = mockWildlifeData[species];

  if (!animal) {
    return <div>Animal not found.</div>;
  }

  return (
    <div className="wildlife-details-page">
      <h1>{animal.name}</h1>
      <p>{animal.description}</p>
      <p><strong>Number of Sightings:</strong> {animal.sightings}</p>
      <p><strong>Habitat:</strong> {animal.habitat}</p>
    </div>
  );
};

export default WildlifeDetails;
