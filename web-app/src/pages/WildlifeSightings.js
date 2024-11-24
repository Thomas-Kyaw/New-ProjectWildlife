import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/WildlifeSightings.module.css';

// Mock data for wildlife sightings
const mockWildlifeSightings = [
  { species: 'Orangutan', sightings: 12 },
  { species: 'Clouded Leopard', sightings: 5 },
  { species: 'Proboscis Monkey', sightings: 8 },
  { species: 'Hornbill', sightings: 15 },
];

const WildlifeSightings = () => {
  return (
    <div className={styles.wildlifeSightingsPage}>
      <h1 className={styles.title}>Wildlife Sightings</h1>
      <table className={`table table-striped table-hover ${styles.sightingsTable}`}>
        <thead>
          <tr>
            <th>Species</th>
            <th>Number of Sightings</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {mockWildlifeSightings.map((animal) => (
            <tr key={animal.species}>
              <td className={styles.species}>{animal.species}</td>
              <td>{animal.sightings}</td>
              <td>
                <Link
                  to={`/wildlife-details/${animal.species.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.detailsLink}
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WildlifeSightings;
