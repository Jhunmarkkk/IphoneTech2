import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Description is required."),
  category: Yup.string().required("Category is required."),
  brand: Yup.string().required("Brand is required."),
  price: Yup.number().required("Price is required.").positive("Price must be positive."),
  salePrice: Yup.number().required("Sale price is required.").positive("Sale price must be positive."),
  totalStock: Yup.number().required("Total Stock is required.").min(0, "Total Stock cannot be negative."),
});

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const columns = [
    {
      field: 'checkbox',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(params.row.id)}
          onChange={() => handleSelectRow(params.row.id)}
        />
      ),
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt={params.row.title}
          style={{ width: '100%', height: '100%', borderRadius: '4px' }}
        />
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => (
        <div style={{ cursor: 'default' }}>
          {params.row.title}
        </div>
      ),
    },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'price', headerName: 'Price', width: 90 },
    { field: 'totalStock', headerName: 'Total Stock', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(params.row.id);
              setFormData({
                ...params.row,
                salePrice: params.row.salePrice || "",
              });
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rows = productList.map((product) => ({
    id: product._id,
    image: product.image,
    title: product.title,
    category: product.category,
    brand: product.brand,
    price: product.price,
    salePrice: product.salePrice,
    totalStock: product.totalStock,
    description: product.description,
  }));

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleSelectRow(id) {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];
      console.log("Selected Rows:", newSelected);
      return newSelected;
    });
  }

  function handleBulkDelete() {
    if (selectedRows.length > 0) {
      selectedRows.forEach((id) => {
        dispatch(deleteProduct(id)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
          }
        });
      });
      setSelectedRows([]);
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={handleBulkDelete} color="error" disabled={selectedRows.length === 0}>
          Delete Selected
        </Button>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const submitData = currentEditedId !== null
                  ? { id: currentEditedId, formData: values }
                  : { ...values, image: uploadedImageUrl };

                const action = currentEditedId !== null ? editProduct(submitData) : addNewProduct(submitData);
                
                dispatch(action).then((data) => {
                  if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    toast({
                      title: currentEditedId !== null ? "Product updated successfully" : "Product added successfully",
                    });
                  }
                });
              }}
            >
              {({ errors, touched, isValid, dirty }) => (
                <Form>
                  {addProductFormElements.map((controlItem) => (
                    <div className="grid w-full gap-1.5" key={controlItem.name}>
                      <label className="mb-1">{controlItem.label}</label>
                      {controlItem.componentType === 'select' ? (
                        <Field as="select" name={controlItem.name} className={`input ${errors[controlItem.name] && touched[controlItem.name] ? 'border-red-500' : ''}`}>
                          <option value="" label={`Select ${controlItem.label}`} />
                          {controlItem.options.map((option) => (
                            <option key={option.id} value={option.id} label={option.label} />
                          ))}
                        </Field>
                      ) : (
                        <Field
                          name={controlItem.name}
                          placeholder={controlItem.placeholder}
                          type={controlItem.type}
                          className={`input ${errors[controlItem.name] && touched[controlItem.name] ? 'border-red-500' : ''}`}
                        />
                      )}
                      <ErrorMessage name={controlItem.name} component="p" className="text-red-500 text-sm" />
                    </div>
                  ))}
                  <button type="submit" className="mt-2 w-full" disabled={!isValid || !dirty}>
                    {currentEditedId !== null ? "Edit" : "Add"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
