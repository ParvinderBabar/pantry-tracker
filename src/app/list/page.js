
import ShoppingListPage from '../../Components/ShoppingListPage.js';
import { db } from "../config/firebase.js";


// Adjust the path based on your project structure

const List = () => {
  return (
    <div>
      <ShoppingListPage />
    </div>
  );
};

export default List;
