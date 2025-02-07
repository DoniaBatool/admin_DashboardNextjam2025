import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client"; // Assuming you have this client file configured
import { FaTrash, FaEdit } from "react-icons/fa"; // Import delete and edit icons

interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryNameForUpdate, setCategoryNameForUpdate] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      const query = `*[_type == "category"]{_id, name, slug}`;
      const result = await client.fetch(query);
      setCategories(result);
    };

    fetchCategories();
  }, []);

  // Generate Slug automatically
  useEffect(() => {
    if (newCategoryName) {
      const generatedSlug = newCategoryName.toLowerCase().replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [newCategoryName]);

  // Add a new category
  const addCategory = async () => {
    if (!newCategoryName) return;

    const newCategory = {
      _type: "category",
      name: newCategoryName,
      slug: {
        _type: "slug",
        current: slug,
      },
    };

    await client.create(newCategory);
    setNewCategoryName(""); // Clear input field
    setSlug(""); // Reset slug
    setCategories([...categories, { ...newCategory, _id: "new-id" }]); // Update UI optimistically
  };

  // Update category
  const updateCategory = async () => {
    if (!editingCategory || !categoryNameForUpdate) return;

    const updatedCategory = {
      ...editingCategory,
      name: categoryNameForUpdate,
      slug: {
        _type: "slug",
        current: categoryNameForUpdate.toLowerCase().replace(/\s+/g, "-"),
      },
    };

    await client.patch(editingCategory._id).set(updatedCategory);
    setEditingCategory(null); // Close the edit form
    setCategoryNameForUpdate(""); // Clear the update input field
    setCategories(
      categories.map((cat) =>
        cat._id === editingCategory._id ? updatedCategory : cat
      )
    ); // Update UI
  };

  // Delete category with confirmation
  const deleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      await client.delete(categoryId);
      setCategories(categories.filter((cat) => cat._id !== categoryId)); // Remove from UI
    }
  };

  return (
    <div className="category-list p-6">
      <h3 className="text-2xl font-semibold mb-4">Categories</h3>

      {/* Add Category Form */}
      <div className="mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg ml-4"
        >
          Add Category
        </button>
      </div>

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="mb-6">
          <input
            type="text"
            value={categoryNameForUpdate}
            onChange={(e) => setCategoryNameForUpdate(e.target.value)}
            placeholder="Update category name"
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={updateCategory}
            className="bg-green-500 text-white px-6 py-2 rounded-lg ml-4"
          >
            Update Category
          </button>
          <button
            onClick={() => setEditingCategory(null)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg ml-4"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Category List */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category._id} className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">{category.name}</h4>
            <p className="text-gray-600">Slug: {category.slug.current}</p>
            <div className="flex space-x-4 mt-2">
              {/* Edit Button */}
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setCategoryNameForUpdate(category.name);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                <FaEdit size={18} />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteCategory(category._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;

