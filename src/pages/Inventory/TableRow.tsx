
import { useDeleteProductMutation } from "../../services/productService";
import EditItemForm from "../../components/EditItemForm";
import { useState } from "react";
import { IInventoryItem } from "../../types";
import DeleteIcon from "./DeleteIcon";
import { toast } from "react-toastify";
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import LendForHomeForm from "../../components/LendForHomeForm";

type InventoryItemsProps = {
  product: IInventoryItem;
  setProducts: React.Dispatch<React.SetStateAction<IInventoryItem[]>>
};


const TableRowComponent = ({
  product,
  setProducts,
}: InventoryItemsProps): JSX.Element => {
  const [isEditItemFormOpen, setIsEditItemFormOpen] = useState(false);
  const [isLendForHomeForm, setIsLendForHomeForm] = useState(false);

  const [deleteProduct] = useDeleteProductMutation();
  const str = `Are you sure you want to delete this item?`;

  const handleEditItemBtn = () => {
    setIsEditItemFormOpen(true);
  };

  const handleLendForHomeIcon = () => {
    setIsLendForHomeForm(true);
  };

  const onDelete = async () => {
    const response = await deleteProduct(product.id);
    if (!('error' in response)) {
      toast.success("Successfully deleted item!");
      setProducts((oldProducts) =>
        oldProducts.filter((p) => p !== product)
      );
    }
  };

  return (
    <>
      {isEditItemFormOpen && (
        <EditItemForm
          onClose={() => setIsEditItemFormOpen(false)}
          product={product}
          setProducts={setProducts}
        />
      )}
       {isLendForHomeForm && (
        <LendForHomeForm
        onClose={()=> setIsLendForHomeForm(false)}
        product={product}
        />
      )}
          <a className="edit-icon" onClick={handleEditItemBtn}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8125 4.6875L12.5938 5.90625L10.0938 3.40625L11.3125 2.1875C11.4375 2.0625 11.5938 2 11.7812 2C11.9688 2 12.125 2.0625 12.25 2.1875L13.8125 3.75C13.9375 3.875 14 4.03125 14 4.21875C14 4.40625 13.9375 4.5625 13.8125 4.6875ZM2 11.5L9.375 4.125L11.875 6.625L4.5 14H2V11.5Z"
                fill="#ED6C02"
              />
            </svg>
          </a>
          <a onClick={handleLendForHomeIcon} className="lendHomeIcon">
          <AddHomeWorkOutlinedIcon sx={{color: '#ed1c25', fontSize: '18px'}}/>
          </a>

          <DeleteIcon str={str} onYes={onDelete} />
       
    </>
  );
};

export default TableRowComponent;
