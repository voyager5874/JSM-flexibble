type Props = {
  params: {
    id: string;
  };
};
const UserProfile = ({ params: { id } }: Props) => {
  return <div>{id}</div>;
};

export default UserProfile;
