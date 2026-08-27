import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUpload } from "react-icons/fa";

const ReportIssue = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch categories for the dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  const categories = categoriesData?.categories || [];

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("category_id", data.category_id);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("priority", data.priority);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axiosSecure.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Issue Reported Successfully!",
          text: "Your issue has been submitted and is pending review.",
          showConfirmButton: false,
          timer: 2000,
        });
        reset();
        navigate("/dashboard/citizen/my-issues");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-8">
        <h2 className="text-2xl font-extrabold mb-1">Report an Issue</h2>
        <p className="text-base-content/60 mb-8">
          Spotted a problem in your city? Let us know and we'll get it fixed.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Issue Title
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="e.g. Broken streetlight on Main Street"
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Category
              </label>
              <select
                {...register("category_id", { required: true })}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-base-content/70 mb-1">
                Priority
              </label>
              <select
                {...register("priority")}
                className="select select-bordered w-full"
                defaultValue="normal"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Location
            </label>
            <input
              {...register("location", { required: true })}
              placeholder="e.g. Near Gulistan Circle, Dhaka"
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Photo (optional)
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed border-base-300 rounded-xl px-4 py-6 cursor-pointer hover:border-primary transition-colors">
              <FaUpload className="text-primary" />
              <span className="text-base-content/60 text-sm">
                Click to upload a photo of the issue (jpg, png — max 5MB)
              </span>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-white w-full rounded-full"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
