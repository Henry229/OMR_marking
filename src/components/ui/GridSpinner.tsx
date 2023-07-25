import { GridLoader } from 'react-spinners';

type Props = {
  color?: string;
};

export default function GridSpinner({ color = 'red' }: Props) {
  return <GridLoader color={color} />;
}
