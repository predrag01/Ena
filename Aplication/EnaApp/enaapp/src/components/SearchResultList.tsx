import { User } from "../models/user.model";
import SearchResult from "./SearchResult";


const SearchResultList = (props: {username: string; results: User[]}) => {
  return (
    <div className="result-list">
       {props.results.map((result, id) => {
        return <SearchResult username={props.username} result={result} key={id} />
       })}
    </div>
  );
};

export default SearchResultList;