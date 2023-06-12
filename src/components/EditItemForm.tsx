import { useEffect, useState } from "react";
import { useUpdateProductMutation } from "../services/productService";
import {
  ICategory,
  IFormInputs,
  IInventoryItem,
  ILocation,
  IReturnedValue,
} from "../types";
import {
  useDeleteImageMutation,
  usePostImageMutation,
} from "../services/imageServices";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { useGetCategoriesQuery } from "../services/categoryService";
import { useGetLocationsQuery } from "../services/locationService";
import { toast } from "react-toastify";

interface EditItemProps {
  product: IInventoryItem;
  setProducts: React.Dispatch<React.SetStateAction<IInventoryItem[]>>;
  isEditItemFormOpen: boolean,
  setIsEditItemFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditItemForm = ({
  product,
  setProducts,
  isEditItemFormOpen,
  setIsEditItemFormOpen
}: EditItemProps): JSX.Element => {

  const [categoryOption, setCategoryOption] = useState(0);
  const [locationOption, setLocationOption] = useState(0);

  const { data: categories } = useGetCategoriesQuery("");
  const { data: locations } = useGetLocationsQuery("");
  const [updateProduct] = useUpdateProductMutation();

  const [postImage] = usePostImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [imageValue, setImageValue] = useState(
    product.image ? product.image : "../../images/no_image-placeholder.png"
  );


  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    defaultValues: {
      code: product.code,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      locationId: product.locationId,
      lendQty: product.lendQty || null,
      saleQty: product.saleQty || null,
      price: product.price || null,
      combinedQty: product.combinedQty,
      image: product.image,
    },
  });

  const handleRemoveImage = () => {
    setImageValue("../../images/no_image-placeholder.png");
  };
  useEffect(() => {
    setCategoryOption(product.categoryId);
  }, []);

  useEffect(() => {
    setLocationOption(product.locationId);
  }, []);

  const inputChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const image = URL.createObjectURL(files[0]);
    setImageValue(image);
  };

  const onSubmit = async (data: IFormInputs): Promise<void> => {
    data.price = data.price || null;
    data.saleQty = data.saleQty || null;
    data.lendQty = data.lendQty || null;


    const id = product.id;
    const response = await updateProduct({ id, data });

    const selectedCategory = categories.filter(
      (c: ICategory) => c.id === Number(data.categoryId)
    )[0] as ICategory;
    const selectedLocation = locations.filter(
      (l: ILocation) => l.id === Number(data.locationId)
    )[0] as ILocation;

    const newData = {
      ...data,
      category: selectedCategory.name,
      location: selectedLocation.name,
      id,
    } as IInventoryItem;

    if (
      imageValue == "../../images/no_image-placeholder.png" &&
      !("error" in response)
    ) {
      await deleteImage(id);
      setProducts((oldProducts) =>
        oldProducts.map((p: IInventoryItem) =>
          p.id !== newData.id ? p : { ...newData, image: imageValue }
        )
      );
      toast.success("Successfully updated item!");
    } else if (data.image !== imageValue && !("error" in response)) {
      const image = data.image[0] as unknown as File;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      const imgUrl = (await postImage({ id, imageFormData })) as {
        data: IReturnedValue;
      };
      setProducts((oldProducts) =>
        oldProducts.map((p: IInventoryItem) =>
          p.id !== newData.id
            ? p
            : ({
                ...newData,
                image: imgUrl.data.returnedValue,
              } as IInventoryItem)
        )
      );
      toast.success("Successfully updated item!");
      
    } else if (!("error" in response)) {
      setProducts((oldProducts) =>
        oldProducts.map((p: IInventoryItem) =>
          p.id !== newData.id ? p : newData
        )
      );
      toast.success("Successfully updated item!");
    }
    setIsEditItemFormOpen(false)
  };

  return (
    <>
      <ModalWrapper open={isEditItemFormOpen} setOpen={setIsEditItemFormOpen}>
        <div className="add-item-modal">
          <form
            className="add-item-modal add-item-form"
            action="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="row">
              <a  className="close-modal-button" onClick={()=>setIsEditItemFormOpen(false)}>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.7305 2.02734L10.7578 9L17.7305 15.9727L15.9727 17.7305L9 10.7578L2.02734 17.7305L0.269531 15.9727L7.24219 9L0.269531 2.02734L2.02734 0.269531L9 7.24219L15.9727 0.269531L17.7305 2.02734Z"
                    fill="black"
                  />
                </svg>
              </a>
              <div className="left-side">
                <span>Edit item</span>
                <TextField
                  className="inputField"
                  id="standard-basic"
                  label="Code*"
                  variant="standard"
                  defaultValue={product.code}
                  error={Boolean(errors.code)}
                  helperText={errors.code?.message}
                  {...register("code", {
                    required: "Code field is required",
                    minLength: {
                      value: 3,
                      message: "Code must be at least 3 symbols",
                    },
                    maxLength: {
                      value: 50,
                      message: "Code name cannot be longer than 50 characters",
                    },
                  })}
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                ></TextField>
                <TextField
                  className="inputField"
                  type="text"
                  id="item-name"
                  variant="standard"
                  label="Name"
                  defaultValue={product.name}
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  {...register("name", {
                    required: "Name field is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 symbols",
                    },
                    maxLength: {
                      value: 100,
                      message: "Name cannot be longer than 100 characters",
                    },
                  })}
                />
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  multiline
                  rows={2}
                  className="inputField"
                  variant="standard"
                  defaultValue={product.description}
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                  {...register("description")}
                />
                <FormControl variant="standard" className="inputField">
                  <InputLabel focused={false}>Category</InputLabel>
                  <Select
                    value={categoryOption}
                    label="Category"
                    {...register("categoryId", {
                      required: "Category field is required",
                      onChange: (e) =>
                        setCategoryOption(e.target.value as number),
                    })}
                  >
                    {categories?.map((c: ICategory) => (
                      <MenuItem value={c.id} key={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="standard" className="inputField">
                  <InputLabel focused={false}>Location</InputLabel>
                  <Select
                    value={locationOption}
                    label="Category"
                    {...register("locationId", {
                      required: "Category field is required",
                      onChange: (e) =>
                        setLocationOption(e.target.value as number),
                    })}
                  >
                    {locations?.map((l: ILocation) => (
                      <MenuItem value={l.id} key={l.id}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  className="inputField"
                  type="number"
                  id="item-name"
                  variant="standard"
                  label="Qty For Sale"
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                  defaultValue={product.saleQty}
                  {...register("saleQty")}
                />
                 <TextField
                className="inputField"
                type="number"
                variant="standard"
                label="Qty For Lend"
                InputLabelProps={{ style: { color: "#9A9A9A" } }}
                defaultValue={product.lendQty}
                error={Boolean(errors.lendQty)}
                helperText={errors.lendQty?.message}
                {...register("lendQty" , {
                  min: {
                    value: 0,
                    message: "Qty for lend must be a positive number",
                  }
                  })}
              />
                <TextField
                  className="inputField"
                  type="number"
                  id="sale-price"
                  variant="standard"
                  label="Sale price"
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                  defaultValue={product.price}
                  {...register("price")}
                />
                <TextField
                  className="inputField"
                  type="number"
                  id="quantity-available"
                  variant="standard"
                  label="Qty *"
                  InputLabelProps={{ style: { color: "#9A9A9A" } }}
                  defaultValue={product.combinedQty}
                  error={Boolean(errors.combinedQty)}
                  helperText={errors.combinedQty?.message}
                  {...register("combinedQty", {
                    required: "Qty field is required",
                    validate: (value) =>
                      (value as unknown as number) >=
                        Number(getValues("saleQty")) ||
                      "Qty cannot be lower than Qty for sale",
                  })}
                />
              </div>
              <div className="imgSection">
                <img
                  id="addCurrentImg"
                  src={imageValue}
                  alt="noImgPlaceholder"
                />
                <input
                  id="fileUpload"
                  type="file"
                  style={{ display: "none" }}
                  {...register("image", {
                    onChange: (e) => inputChange(e),
                  })}
                />
                <div className="img-buttons">
                  <label className="upload-button" htmlFor="fileUpload">
                    Upload
                  </label>
                  <button
                    onClick={handleRemoveImage}
                    id="remove-button"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            {isSubmitting ? (
              <CircularProgress className="spinning-loader" />
            ) : (
              <button id="submitFormBtn" type="submit">
                Modify
              </button>
            )}
          </form>
        </div>
      </ModalWrapper>
    </>
  );
};
export default EditItemForm;
