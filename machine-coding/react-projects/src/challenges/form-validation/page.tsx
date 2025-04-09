import React,{ useState } from "react";

interface FormState {
  product: IProduct;
  quantity: IQuantity;
}

interface IProduct {
  state: "";
  error: "";
}

interface IQuantity {
  state: 0;
  error: "";
}

export default function FormValidation() {
  const [formState, setFormState] = useState<FormState>({
    product: {
      state: "",
      error: "",
    },
    quantity: {
      state: 0,
      error: "",
    },
  });

  const validateField = (name: string, value: string | number) => {
    let error = "";

    if (name === "product") {
      error = String(value).trim() === "" ? "Product name is required" : "";
    } else if (name === "quantity") {
      error =
        +value <= 0 || isNaN(+value)
          ? "Quantity must be a valid number greater than 0"
          : "";
    }

    setFormState((prev) => {
      return {
        ...prev,
        [name]: {
          ...[name],
          error,
        },
      };
    });
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: {
        ...[name],
        state: value,
      },
    });
    validateField(name, value);
  };

  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateField("product", formState.product.state);
    validateField("quantity", formState.quantity.state);

    if (isDisabled()) {
      alert(
        "Form submitted: " +
          formState.product.state +
          ", " +
          formState.quantity.state
      );
    }
  };

  const isDisabled = () => {
    const productError = Object.values(formState.product.error).every(
      (error) => error === ""
    );
    const quantityError = Object.values(formState.quantity.error).every(
      (error) => error === ""
    );
    return productError && quantityError;
  };

  return (
    <form className="text-tertiary-light dark:text-tertiary-dark">
      <label htmlFor="productName">Product Name</label>
      <input
        className=""
        name="product"
        type="text"
        value={formState.product.state}
        onChange={inputHandler}
        onBlur={blurHandler}
      />
      <p>{formState.product.error}</p>
      <label htmlFor="productQuantity">Product Quantity</label>

      <input
        className=""
        name="quantity"
        type="number"
        value={formState.quantity.state}
        onChange={inputHandler}
        onBlur={blurHandler}
      />
      <p>{formState.quantity.error}</p>
      <button type="submit" onClick={submitHandler} disabled={!isDisabled()}>
        submit
      </button>
    </form>
  );
}
