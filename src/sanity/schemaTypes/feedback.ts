import { defineType, defineField } from "sanity";

export default defineType({
  name: "feedback",
  type: "document",
  title: "Feedback",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "orderId",
      type: "string",
      title: "Order ID",
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating",
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: "feedbackType",
      type: "string",
      title: "Feedback Type",
    }),
    defineField({
      name: "comments",
      type: "text",
      title: "Comments",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "datetime",
      title: "Submission Date",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss" },
      readOnly: true,
      initialValue: () => new Date().toISOString(), // Automatically sets the current date
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Uploaded Image",
    }),
  ],
});
