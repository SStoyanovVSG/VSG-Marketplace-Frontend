import { useRef, useState } from "react";
import { IProduct } from "../../types";
import ProductModal from "./ProductModal";
import { useCreateOrderMutation } from "../../services/ordersService";
import PopperComponent from "../Popper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type ProductProps = {
  product: IProduct;
};
type PopperStringProps = {
  selectValue: React.MutableRefObject<number>;
  product: IProduct;
};

const PopperString = ({ selectValue, product }: PopperStringProps) => {
  return (
    <p>
      Are you sure you want to buy
      {<b> {selectValue.current}</b>} item for
      {<b> {Number(selectValue.current) * product.price} BGN</b>}?
    </p>
  );
};

const Card = ({ product }: ProductProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  const handlePopup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectValue = useRef(1);
  const onBuy = async () => {
    const productId = product.id;
    const qty = selectValue.current;
    const response = await createOrder({ productId, qty });

    if (!("error" in response)) {
      toast.success("Successfully placed order!");
      navigate("/my-orders");
    }
    setAnchorEl(null);
  };

  const handleOnImageClick = () => {
    setIsModalOpen(true);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    selectValue.current = Number(event.target.value);
  };

  return (
    <>
      <ProductModal
        product={product}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="card-item">
        <a className="product-image" onClick={handleOnImageClick}>
          <img
            src={
              product.image
                ? product.image
                : `./images/no_image-placeholder.png`
            }
            alt="ProductImage"
          />
        </a>
        <div className="details">
          <div className="name-price">
            <p>{product.price} BGN</p>
            <p>{product.category}</p>
          </div>
          <div className="details-wrapper">
            <div className="qty">
              <p>Qty</p>
              <select
                name="qty"
                className="selectQty"
                onChange={handleSelectChange}
              >
                {Array(product.saleQty)
                  .fill(1)
                  .map((n, i) => n + i)
                  .map((o) => (
                    <option value={o} key={o}>
                      {o}
                    </option>
                  ))}
              </select>
            </div>

            <div className="icon popup">
              <a
                role="button"
                className="circle"
                id="firstBtn"
                onClick={handlePopup}
              >
                <img src="../../images/dollar.svg" alt="DollarImage" />
              </a>
            </div>
          </div>
        </div>
      </div>
        <PopperComponent
          PopperString={
            <PopperString selectValue={selectValue} product={product} />
          }
          onYes={onBuy}
          anchor={anchorEl}
          setAnchor={setAnchorEl}
        />
    </>
  );
};

export default Card;
