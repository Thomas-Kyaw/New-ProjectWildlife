import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/WildlifeDetails.module.css';

// Mock data for wildlife details
const mockWildlifeData = {
  orangutan: {
    name: 'Orangutan',
    description: 'Orangutans are one of the closest relatives to humans and are highly intelligent.',
    sightings: 12,
    habitat: 'Rainforests of Borneo and Sumatra',
    image: require('../assets/Tourism-Image-Card-2.jpg'),
  },
  'clouded-leopard': {
    name: 'Clouded Leopard',
    description: 'The clouded leopard is known for its cloud-shaped spots and is a master of climbing trees.',
    sightings: 5,
    habitat: 'Dense forests of Southeast Asia',
    image: require('../assets/Tourism-Image-Card-5.jpg'),
  },
  'proboscis-monkey': {
    name: 'Proboscis Monkey',
    description: 'Known for their large noses, these monkeys are found near rivers and mangroves in Borneo.',
    sightings: 8,
    habitat: 'Mangrove forests in Borneo',
    image: require('../assets/Tourism-Image-Card-3.avif'),
  },
  hornbill: {
    name: 'Hornbill',
    description: 'Hornbills are large birds with huge beaks, often found in tropical forests.',
    sightings: 15,
    habitat: 'Tropical and subtropical forests',
    image: require('../assets/Tourism-Image-Card-4.jpeg'),
  },
};

const WildlifeDetails = () => {
  const { species } = useParams();
  const animal = mockWildlifeData[species];

  if (!animal) {
    return <div className={styles.notFound}>Animal not found.</div>;
  }

  return (
    <div className={styles.detailsPage}>
      <div className={styles.imageContainer}>
        <img src={animal.image} alt={animal.name} className={styles.animalImage} />
      </div>
      <div className={styles.textContent}>
        <h1 className={styles.animalName}>{animal.name}</h1>
        <p className={styles.animalDescription}>{animal.description}</p>
        <p><strong>Number of Sightings:</strong> {animal.sightings}</p>
        <p><strong>Habitat:</strong> {animal.habitat}</p>
      </div>
    </div>
  );
};

export default WildlifeDetails;
