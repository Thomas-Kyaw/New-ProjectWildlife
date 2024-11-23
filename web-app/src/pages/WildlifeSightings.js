import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/WildlifeSightings.css';

// Mock data for wildlife sightings
const mockWildlifeSightings = [
  { species: 'Orangutan', sightings: 12 },
  { species: 'Clouded Leopard', sightings: 5 },
  { species: 'Proboscis Monkey', sightings: 8 },
  { species: 'Hornbill', sightings: 15 },
];

const WildlifeSightings = () => {
  return (
    <div className="wildlife-sightings-page">
      <h1>Wildlife Sightings</h1>
      <table className="sightings-table">
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
              <td>{animal.species}</td>
              <td>{animal.sightings}</td>
              <td>
                <Link to={`/wildlife-details/${animal.species.toLowerCase().replace(/\s+/g, '-')}`}>
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
