import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import axios from 'axios';
import { flattenLocation } from './utils';
import './App.css';

const fetchData = async () => {
  return axios
    .get('https://randomuser.me/api/?results=10')
    .then((response) => response.data.results)
    .catch((err) => console.error(err));
};

function App() {
  const [people, setPeople] = useState<any>([]);
  const [locations, setLocations] = useImmer<any>([]);

  useEffect(() => {
    (async () => {
      const apiPeople: any = await fetchData();
      setPeople(apiPeople);

      const apiLocations = apiPeople.map(({ location, login }: any) => ({
        id: crypto.randomUUID(),
        personId: login.uuid,
        payload: flattenLocation(location),
      }));

      setLocations(apiLocations);
    })();
  }, []);

  if (!people.length) return <div>loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          {getHeaders(locations)}
        </tr>
      </thead>
      <tbody>
        {people.map((person: any, idx: number) =>
          getPersonRow(person, locations.at(idx))
        )}
      </tbody>
    </table>
  );
}

function handleHeaderClick(locationId: any) {}

function getHeaders(locations: any) {
  const locationContent = locations.at(0).payload;
  console.log(locationContent);

  return Object.keys(locationContent).map((key) => (
    <th key={key} onClick={() => handleHeaderClick(locationContent)}>
      {key}
    </th>
  ));
}

function getPersonRow(person: any, location: any) {
  const values: any[] = Object.values(location.payload);
  const fullName = person.name.last + ' ' + person.name.first;

  return (
    <tr>
      <td>
        <b>{fullName}</b>
      </td>
      {values.map((value, idx) => (
        <td key={idx}>{value}</td>
      ))}
    </tr>
  );
}

export default App;
