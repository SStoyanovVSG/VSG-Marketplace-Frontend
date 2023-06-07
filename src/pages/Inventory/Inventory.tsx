import { useState } from "react";
import AddNewItemForm from "../../components/AddNewItemForm";
import CustomizedTables from "./Table";
import SearchBar from "./SearchBar";

import { IInventoryItem } from "../../types";

function Inventory(): JSX.Element {
  const [isAddNewItemFormOpen, setIsAddNewItemFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<IInventoryItem[]>([]);

  const handleSearchInputChange = (event: React.FormEvent<Element>) => {
    setSearchQuery((event.target as HTMLInputElement).value);
  };

  const handleAddNewItemBtn = () => {
    setIsAddNewItemFormOpen(true);
  };

  return (
    <main className="main">
      
        <AddNewItemForm isAddNewItemFormOpen={isAddNewItemFormOpen} setIsAddNewItemFormOpen={setIsAddNewItemFormOpen} setProducts={setProducts} onClose={() => setIsAddNewItemFormOpen(false)} />
      
      <div className="table-wrapper">
        <SearchBar onSearchInputChange={handleSearchInputChange} searchQuery={searchQuery} >
          <button
            id="addNewItemBtn"
            type="button"
            onClick={handleAddNewItemBtn}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line y1="7.5" x2={15} y2="7.5" stroke="white" />
              <line x1="7.5" x2="7.5" y2={15} stroke="white" />
            </svg>
            <span>Add new</span>
          </button>
        </SearchBar>
        <CustomizedTables
         searchQuery={searchQuery}
          products= {products}
          setProducts = {setProducts}
        />
      </div>
    </main>
  );
}

export default Inventory;
