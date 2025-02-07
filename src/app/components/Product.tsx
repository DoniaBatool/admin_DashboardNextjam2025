"use client";
import { useState, useEffect} from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import slugify from "slugify";

// Define the Product type
type Product = {
  _id: string;
  _type: string;
  name: string;
  slug: { current: string };
  category: { _id: string; name: string } | null; // Make category nullable
  price: number;
  quantity: number;
  description: string;
  image?: { asset?: { _ref: string; url?: string } };
  tags: string[];
  dimensions: { height: string; width: string; depth: string };
  features: string[];
};
type FormDataType = {
  name: string;
  slug?: { current: string };
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
  tags: string;
  dimensions: { height: string; width: string; depth: string };
  features: string;
  image?: string;
};


type Category = {
  _id: string;
  name: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  //const editFormRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    slug: undefined,
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    imageUrl: "",
    tags: "",
    dimensions: { height: "", width: "", depth: "" },
    features: "",
    image: "",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productQuery = `*[_type == "product"]{
          _id, name, "slug": slug.current, "category": category->{_id, name}, price, quantity, description,
          "imageUrl": image.asset->url, tags, dimensions, features
        }`;
        const categoryQuery = `*[_type == "category"]{_id, name}`;

        const [productData, categoryData] = await Promise.all([client.fetch(productQuery), client.fetch(categoryQuery)]);

        setProducts(productData);
        setCategories(categoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name) return;
  
    // Ensure slug is generated
    formData.slug = { current: slugify(formData.name, { lower: true }) };
  
    // Prepare the data to be sent to Sanity
    const updatedFormData = {
      ...formData,
      category: { _type: "reference", _ref: formData.category }, // Reference to category
      tags: formData.tags.split(",").map((tag: string) => tag.trim()), // Tags as array
      features: formData.features.split(",").map((feature: string) => feature.trim()), // Features as array
      dimensions: formData.dimensions, // Handle dimensions
      // Add the image reference (ensure formData.imageUrl has the correct _ref)
      image: formData.image
      ? { _type: "image", asset: { _type: "reference", _ref: formData.image } }
      : undefined, // If image is not provided, leave it undefined
    };
  
    try {
      if (editingProduct) {
        // Update existing product
        await client.patch(editingProduct._id).set(updatedFormData).commit();
        alert("Product updated successfully!");
      } else {
        // Create new product
        await client.create({ ...updatedFormData, _type: "product" });
        alert("Product added successfully!");
      }
      setEditingProduct(null);
      setFormData({
        name: "",
        slug: undefined,
        category: "",
        price: 0,
        quantity: 0,
        description: "",
        imageUrl: "",
        tags: "",
        dimensions: { height: "", width: "", depth: "" },
        features: "",
        image: "",
      });
      
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category: product.category?._id || "",
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      imageUrl: product.image?.asset?.url || "",
      tags: product.tags.join(", "),
      dimensions: product.dimensions,
      features: product.features.join(", "),
    });
    setShowForm(true); // Show form for editing
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: undefined,
      category: "",
      price: 0,
      quantity: 0,
      description: "",
      imageUrl: "",
      tags: "",
      dimensions: { height: "", width: "", depth: "" },
      features: "",
      image: "",
    });
    
    setShowForm(true); // Show form for adding new product
  };

  const handleDeleteClick = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await client.delete(product._id);
        setProducts(products.filter((p) => p._id !== product._id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Product Management</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNewProduct}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-11">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium mb-2">Product Name</label>
              <input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="price" className="text-sm font-medium mb-2">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="quantity" className="text-sm font-medium mb-2">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="tags" className="text-sm font-medium mb-2">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                value={formData.tags || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-medium mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="dimensions" className="text-sm font-medium mb-2">Dimensions (Height, Width, Depth)</label>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label htmlFor="dimensions.height" className="text-sm font-medium mb-2">Height</label>
                  <input
                    id="dimensions.height"
                    name="dimensions.height"
                    value={formData.dimensions?.height || ""}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label htmlFor="dimensions.width" className="text-sm font-medium mb-2">Width</label>
                  <input
                    id="dimensions.width"
                    name="dimensions.width"
                    value={formData.dimensions?.width || ""}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label htmlFor="dimensions.depth" className="text-sm font-medium mb-2">Depth</label>
                  <input
                    id="dimensions.depth"
                    name="dimensions.depth"
                    value={formData.dimensions?.depth || ""}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="features" className="text-sm font-medium mb-2 ">Features (comma separated)</label>
              <input
                id="features"
                name="features"
                value={formData.features || ""}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="image" className="text-sm font-medium mb-2">Product Image</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleFileChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formData.image && (
                <div className="mt-4">
                  <Image src={formData.image} alt="Product image preview" width={200} height={200} />
                </div>
              )}
            </div>

            <div className="flex justify-end col-span-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-8">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-600">Product Name</th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-600">Price</th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-600">Category</th>
              <th className="px-6 py-3 text-sm font-medium text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-3 text-sm text-gray-900">${product.price}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{product.category?.name}</td>
                <td className="px-6 py-3 text-sm">
                  <button onClick={() => handleEditClick(product)}>
                    <AiFillEdit className="text-blue-600 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDeleteClick(product)} className="ml-4">
                    <AiFillDelete className="text-red-600 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;


