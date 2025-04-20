import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import fileService from "../../appwrite/file";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../store/slices/postSlice";

// Lazy load the RTE editor
const RTE = lazy(() => import("../Editor/RTE"));

export default function PostForm({ post }) {
  const [featuredImage, setFeaturedImage] = useState(null);
  const { loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userData.userId);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    if (post?.featuredImage) {
      setFeaturedImage(fileService.getFilePreview(post.featuredImage));
    }
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue, post]);

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setFeaturedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const submit = async (data) => {
    try {
      if (post) {
        const file = data.image[0]
          ? await fileService.uploadFile(data.image[0])
          : null;

        if (file) {
          await fileService.deleteFile(post.featuredImage);
        }

        const response = await dispatch(
          updatePost({
            id,
            data,
            featuredImage: file ? file.$id : undefined,
          })
        );
        if (response.meta.requestStatus === "fulfilled")
          navigate(`/post/${response.payload?.$id}`);
      } else {
        const file = await fileService.uploadFile(data.image[0]);

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          const response = await dispatch(createPost({ ...data, userId }));
          if (response.meta.requestStatus === "fulfilled")
            navigate(`/post/${response.payload?.$id}`);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-gray-900 px-2 py-4 sm:p-6 rounded-lg shadow-lg"
    >
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Input
            label="Title"
            placeholder="Enter the title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
            autoFocus
          />
          <Input
            label="Slug"
            placeholder="Enter the slug"
            {...register("slug", { required: "Slug is required" })}
            onInput={(e) =>
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              })
            }
            readOnly={post}
            error={errors.slug?.message}
          />
          <Suspense
            fallback={<p className="text-gray-500">Loading editor...</p>}
          >
            <RTE
              label="Content"
              name="content"
              control={control}
              defaultValue={getValues("content")}
              rules={{ required: "Content is required" }}
            />
          </Suspense>
        </div>
        <div className="w-full md:w-1/3">
          <Input
            label="Featured Image"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", {
              required: { value: !post, message: "Image is required" },
            })}
            onChange={handleImageChange}
            error={errors.image?.message}
          />
          {featuredImage && (
            <img
              src={featuredImage}
              alt="Preview"
              className="w-full mb-6 rounded-lg shadow-md"
            />
          )}
          <Select
            options={["active", "inactive"]}
            label="Status"
            {...register("status")}
            error={errors.status?.message}
          />
          <Button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {post
              ? loading
                ? "Updating..."
                : "Update"
              : loading
              ? "Submitting..."
              : "Submit"}
          </Button>
          <Button
            bgColor="bg-red-600 w-full my-4 text-white"
            onClick={() => navigate("/my-posts")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
