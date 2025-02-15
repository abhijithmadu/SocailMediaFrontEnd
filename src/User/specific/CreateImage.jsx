import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UploadImage from "./UploadImage";
import { createPost } from "../auth/authUser";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../auth/PutApi";

const CreateImage = ({ onEdit, data }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(data?.imageUrl || null);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onImageUpload = (url) => {
    setImageUrl(url);
  };

  const onSubmit = async (formData) => {
    formData.imageUrl = imageUrl;
    if (!imageUrl) {
      message.error('Please upload an image before submitting');
      return;
    }
    try {
      setSubmitted(true);
      if (onEdit) {
        await updatePost(data._id, formData);
        message.success('Successfully Updated Blog');
      } else {
        await createPost(formData, 'image');
        message.success('Successfully Created Blog');
      }

      reset();
      setImageUrl(null);
      navigate('/profile');
    } catch (error) {
      console.log('Error submitting blog', error);
      message.error('Error submitting blog');
      setSubmitted(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full ">
      <div className="border-dotted  rounded-lg p-6 dark:bg-secondary-dark  w-full max-w-md bg-white shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col gap-2">
            <input
              type="text"
              defaultValue={data?.hashTags ? data.hashTags.join(' ') : ''}
              placeholder="Hash tag"
              {...register("hashTag")}
              className="p-2 rounded w-full dark:bg-primary-dark bg-secondary-light dark:to-secondary-dark dark:text-white ]"
              /> 
{errors.hashTag && (
              <p className="text-red-500 text-sm mt-1">{errors.hashTag.message}</p>
            )}
<input
              type="text"
              defaultValue={data?.location}
              placeholder="Location "
              {...register("location")}
              className="p-2 rounded w-full dark:bg-primary-dark bg-secondary-light dark:to-secondary-dark dark:text-white ]"
              /> 
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
          {!onEdit && (
            <UploadImage
              title="Upload Cover Image"
              onImageUpload={onImageUpload}
              ratio={1 / 1}
              imageUrl={imageUrl}
              submitted={submitted}
            />
          )}
          {onEdit && imageUrl && (
            <div className="mb-4">
              <img src={imageUrl} alt="Cover" className="rounded w-full h-[300px] object-cover" />
            </div>
          )}
          <button type="submit" className="mt-4 bg-secondary-light text-text-gray  w-full dark:bg-primary-dark dark:to-secondary-dark dark:text-text-primary p-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateImage;
