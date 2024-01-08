import { User } from "../models/user.model";

const SearchResult = (props: {result: User}) => {
  return (
    <div>{props.result.username}</div>
  );
};

export default SearchResult;