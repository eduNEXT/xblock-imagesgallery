// All this code will be removed, it's for testing TypeScript
import { FC } from 'react';
import { UserI } from './interfaces';

interface Props {
  title: string;
}

const userData: UserI = {
  name: 'test',
  age: 40,
  isActive: true,
  logs: []
};

const BasicComponent: FC<Props> = ({ title }) => {
  console.log(userData);
  return (
    <div>
      <h1>Name: {title}</h1>
    </div>
  );
};

export default BasicComponent;
