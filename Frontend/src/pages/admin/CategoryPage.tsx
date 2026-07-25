import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types/category";


export default function CategoryPage() {

  const [categories, setCategories] = useState<Category[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [editingCategory, setEditingCategory] =
  useState<Category | null>(null);

const [deleteId, setDeleteId] =
  useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });


  const fetchCategories = async () => {
    try {

      const data = await getCategories();

      setCategories(
        data.categories || data
      );

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);


  const handleEdit = (
  category: Category
) => {
  setEditingCategory(category);

  setFormData({
    name: category.name,
    description:
      category.description || "",
    image: null,
  });

  setShowModal(true);
};



  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = new FormData();

    data.append(
      "name",
      formData.name
    );

    data.append(
      "description",
      formData.description
    );

    if (formData.image) {
      data.append(
        "image",
        formData.image
      );
    }

    if (
      editingCategory?._id
    ) {
      await updateCategory(
        editingCategory._id,
        data
      );
    } else {
      await createCategory(data);
    }

    await fetchCategories();

    setFormData({
      name: "",
      description: "",
      image: null,
    });

    setEditingCategory(null);

    setShowModal(false);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">


      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Categories
          </h1>
          <p className="text-slate-500">Manage your product categories</p>
        </div>


        <button
       onClick={() => {
            setEditingCategory(null);

            setFormData({
                name: "",
                description: "",
                image: null,
            });

            setShowModal(true);
            }}
          className="
          bg-gradient-to-r from-emerald-600 to-teal-600
          text-white
          px-6 py-3
          rounded-lg
          hover:from-emerald-700 hover:to-teal-700
          font-semibold
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-200
          "
        >
          + Add Category
        </button>


      </div>



      <div className="
      rounded-2xl
      overflow-hidden
      ">


    <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-6
  "
>
  {categories.map((cat) => (
    <div
      key={cat._id}
      className="
        bg-white
        rounded-xl
        shadow-md
        border border-slate-100
        overflow-hidden
        hover:shadow-xl
        hover:border-slate-200
        transition-all
        duration-300
        group
      "
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-300
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-slate-400
              font-medium
            "
          >
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">

        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            mb-2
          "
        >
          {cat.name}
        </h3>

        <p
          className="
            text-sm
            text-slate-600
            line-clamp-3
            min-h-[60px]
            leading-relaxed
          "
        >
          {cat.description ||
            "No description available"}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={() =>
              handleEdit(cat)
            }
            className="
              flex-1
              bg-gradient-to-r from-blue-50 to-cyan-50
              text-blue-700
              py-2.5
              rounded-lg
              font-semibold
              hover:from-blue-100 hover:to-cyan-100
              border border-blue-200
              hover:border-blue-300
              transition-all
              duration-200
            "
          >
            Edit
          </button>

          <button
            onClick={() =>
              setDeleteId(cat._id!)
            }
            className="
              flex-1
              bg-gradient-to-r from-red-50 to-rose-50
              text-red-700
              py-2.5
              rounded-lg
              font-semibold
              hover:from-red-100 hover:to-rose-100
              border border-red-200
              hover:border-red-300
              transition-all
              duration-200
            "
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  ))}
</div>
      </div>





      {
        showModal && (
        <div
        className="
        fixed inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        backdrop-blur-sm
        "
        >


          <div
          className="
          bg-white
          w-[400px]
          rounded-2xl
          p-6
          shadow-2xl
          border border-slate-100
          "
          >


            <h2 className="
            text-2xl
            font-bold
            text-slate-900
            mb-6
            ">
             {editingCategory
  ? "Edit Category"
  : "Add Category"}
            </h2>



            <form
            onSubmit={handleSubmit}
            className="space-y-4"
            >


              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Name</label>
                <input
                type="text"
                placeholder="Enter category name"
                className="
                w-full
                border border-slate-300
                p-3
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-transparent
                transition-all
                "
                value={formData.name}
                onChange={(e)=>
                  setFormData({
                    ...formData,
                    name:e.target.value
                  })
                }
                />
              </div>


              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                placeholder="Enter description"
                className="
                w-full
                border border-slate-300
                p-3
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-transparent
                transition-all
                resize-none
                h-24
                "
                value={formData.description}
                onChange={(e)=>
                  setFormData({
                    ...formData,
                    description:e.target.value
                  })
                }
                />
              </div>


              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Image</label>
                <input
                type="file"
                accept="image/*"
                className="
                w-full
                border border-slate-300
                p-3
                rounded-lg
                file:mr-4
                file:py-2
                file:px-4
                file:rounded
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-emerald-50
                file:text-emerald-700
                hover:file:bg-emerald-100
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-transparent
                "
                onChange={(e)=>
                  setFormData({
                    ...formData,
                    image:
                    e.target.files?.[0] || null
                  })
                }
                />
              </div>

            {editingCategory?.image && (
            <div className="flex items-center gap-3">
              <img
                src={editingCategory.image}
                alt={editingCategory.name}
                className="
                w-24
                h-24
                rounded-lg
                object-cover
                border border-slate-200
                "
            />
            <span className="text-sm text-slate-600">Current image</span>
            </div>
            )}

              <div className="
              flex
              justify-end
              gap-3
              pt-4
              ">


                <button
                type="button"
               onClick={() => {
  setShowModal(false);

  setEditingCategory(null);

  setFormData({
    name: "",
    description: "",
    image: null,
  });
}}
                className="
                px-4 py-2.5
                border border-slate-300
                rounded-lg
                text-slate-700
                font-semibold
                hover:bg-slate-50
                transition-colors
                "
                >
                  Cancel
                </button>


                <button
                disabled={loading}
                className="
                bg-gradient-to-r from-emerald-600 to-teal-600
                text-white
                px-6 py-2.5
                rounded-lg
                font-semibold
                hover:from-emerald-700 hover:to-teal-700
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-all
                shadow-md
                "
                >
                  {
                    loading
? "Saving..."
: editingCategory
? "Update Category"
: "Save Category"
                  }
                </button>


              </div>



            </form>


          </div>


        </div>

        )
      }

{deleteId && (
  <div
    className="
      fixed inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      backdrop-blur-sm
    "
  >
    <div
      className="
        bg-white
        rounded-2xl
        p-8
        w-[90%]
        max-w-md
        shadow-2xl
        border border-slate-100
      "
    >
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        Delete Category
      </h3>

      <p className="text-slate-600 mb-8 leading-relaxed">
        Are you sure you want to delete this category? This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() =>
            setDeleteId(null)
          }
          className="
            flex-1
            border border-slate-300
            py-3
            rounded-lg
            text-slate-700
            font-semibold
            hover:bg-slate-50
            transition-colors
          "
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              await deleteCategory(
                deleteId
              );

              setDeleteId(null);

              fetchCategories();
            } catch (error) {
              console.log(error);
            }
          }}
          className="
            flex-1
            bg-gradient-to-r from-red-600 to-rose-600
            text-white
            py-3
            rounded-lg
            font-semibold
            hover:from-red-700 hover:to-rose-700
            transition-all
            shadow-md
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>

  );
}