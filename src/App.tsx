import React, { useState, useEffect } from 'react';

interface Mass {
  massValue: number;
  massExponent: number;
}

interface Body {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  gravity: number;
  mass: Mass;
  density: number;
  meanRadius: number;
  // Add more properties as needed
}

const BodyInfo: React.FC<{ body: Body }> = ({ body }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-md mt-4">
      <h2 className="text-xl font-semibold mb-2 text-white">{body.name}</h2>
      <p className="text-gray-300">Gravity: {body?.gravity}</p>
      <p className="text-gray-300">Mass: {body?.mass?.massValue} x 10^{body?.mass?.massExponent}</p>
      <p className="text-gray-300">Density: {body?.density}</p>
      <p className="text-gray-300">Mean Radius: {body?.meanRadius}</p>
      {/* Add more information fields as needed */}
    </div>
  );
};

const PlanetForm: React.FC = () => {
  const [isPlanet, setIsPlanet] = useState(false);
  const [gravity, setGravity] = useState(0);
  const [selectedBody, setSelectedBody] = useState<Body | null>(null);
  const [bodies, setBodies] = useState<Body[]>([]);
  const [filteredBodies, setFilteredBodies] = useState<Body[]>([]);
  const [infoVisible, setInfoVisible] = useState(false);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies');
        const data = await response.json();
        setBodies(data.bodies);
        setFilteredBodies(data.bodies);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter bodies based on isPlanet and gravity
    const filtered = bodies.filter((body) => {
      return (!isPlanet || body.isPlanet) && body.gravity >= gravity;
    });

    setFilteredBodies(filtered);
  }, [isPlanet, gravity, bodies]);

  const handleBodyChange = (bodyId: string) => {
    const selected = filteredBodies.find((body) => body.id === bodyId);
    setSelectedBody(selected || null);
    setInfoVisible(true);
  };

  return (
    <div className="bg-gray-700 p-8 rounded-md max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-white">Is Planet:</label>
        <input
          type="checkbox"
          checked={isPlanet}
          onChange={() => setIsPlanet(!isPlanet)}
          className="ml-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white">Gravity:</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={gravity}
          onChange={(e) => setGravity(parseFloat(e.target.value))}
        />
        <p className="text-white mt-2">{gravity}</p>
      </div>

      <div className="mb-4">
        <label className="block text-white">Select a Body:</label>
        <select
          onChange={(e) => handleBodyChange(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md"
        >
          <option value="" disabled selected>
            Select a body
          </option>
          {filteredBodies.map((body) => (
            <option key={body.id} value={body.id}>
              {body.englishName}
            </option>
          ))}
        </select>
      </div>

      {infoVisible && selectedBody && <BodyInfo body={selectedBody} />}
    </div>
  );
};

export default PlanetForm;
