import { User } from "../models/user.model";

const SearchResult = (props: {result: User}) => {
    console.log(props.result)
  return (
    <div>{props.result.UserName}</div>
  );
};

export default SearchResult;