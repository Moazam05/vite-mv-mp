import * as Yup from "yup";

export const GRSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      image: Yup.string(),
      productName: Yup.string(),
      qtyOrdered: Yup.number(),
      recQty: Yup.number().required("Rec required"),
    })
  ),
});
