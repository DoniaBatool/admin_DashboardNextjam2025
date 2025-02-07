import { defineType, defineField } from "sanity";

// schemas/faq.js
export const faq = defineType({
  name: "faq",
  type: "document",
  title: "FAQ",
  fields: [
    defineField({
      name: "question",
      type: "string",
      title: "Question",
      validation: (rule) => rule.required().min(10).max(200),
    }),
    defineField({
      name: "answer",
      type: "text",
      title: "Answer",
      validation: (rule) => rule.required().min(20),
    }),
  ],
});

