import React, { lazy, Suspense } from "react";
import { Controller } from "react-hook-form";
import config from "../../config/config";

const Editor = lazy(() =>
  import("@tinymce/tinymce-react").then((module) => ({
    default: module.Editor,
  }))
);

export default function RTE({
  name,
  control,
  label,
  toolbarOptions = "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | ",
  rules = {},
}) {
  return (
    <div className="w-full mb-6">
      {/* Label for the editor */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Suspense
            fallback={<p className="text-gray-500">Loading editor...</p>}
          >
            <div className="h-[400px] sm:h-[500px]">
              <Editor
                apiKey={config.apiKey}
                value={value} // Controlled value from React Hook Form
                onEditorChange={onChange}
                init={{
                  // Editor initialization options
                  height: "100%",
                  width: "100%",
                  resize: true, // Allow resizing
                  content_css: "writer",
                  plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "wordcount",
                  ],

                  // Mobile-specific settings
                  mobile: {
                    menubar: false, // Hide menubar on mobile
                  },

                  // Global toolbar
                  toolbar: toolbarOptions,
                  menubar: true,

                  setup: (editor) => {
                    editor.on("init", () => {
                      editor.setContent(value || ""); // Initialize content
                    });
                  },

                  content_style: `
                  body {
                    background-color: #1f2937;
                    color: #e5e7eb;
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 14px;
                    margin: 8px;
                    padding: 8px;
                  }
                  a {
                    color: #60a5fa;
                  }
                  a:hover {
                    color: #93c5fd;
                  }
                  p {
                    margin: 16px 0; /* Add vertical spacing between paragraphs */
                    line-height: 1.8; /* Increase line height for better readability */
                  }
                `,
                }}
              />
            </div>
            <p className="mt-2 text-center text-sm sm:text-base">
              For full screen editor : Press (Ctrl + Shift + F)
            </p>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-center mt-2">{error.message}</p>
            )}
          </Suspense>
        )}
      />
    </div>
  );
}
