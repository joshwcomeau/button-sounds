import styled from 'styled-components';

import { SOUND_DATA } from '@/data';

interface Props {
  name: string;
}

function InfoTable({ name }: Props) {
  const soundData = SOUND_DATA[name];

  if (!soundData) {
    return 'TODO';
  }

  return (
    <Table>
      <tbody>
        <tr>
          <th scope="row">Name</th>
          <td>{soundData.title}</td>
        </tr>
        <tr>
          <th scope="row">Slug</th>
          <td>{name}</td>
        </tr>
        <tr>
          <th scope="row">About</th>
          <td>{soundData.description}</td>
        </tr>
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-gray-200);

  th {
    font-family: var(--font-segment);
  }
`;

export default InfoTable;
