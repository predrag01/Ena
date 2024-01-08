import { User } from "../models/user.model";
import SearchResult from "./SerachResult";


const SearchResultList = (props: {results: User[]}) => {
  return (
    <div className="result-list">nije
       {props.results.map((result, id) => {
        return <SearchResult result={result} key={id} />
       })}
    </div>
  );
};

export default SearchResultList;