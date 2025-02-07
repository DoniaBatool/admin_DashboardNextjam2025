import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'review',
  type: 'document',
  title: 'Review',
  fields: [
    defineField({
      name: 'rating',
      type: 'number',
      title: 'Rating',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'review',
      type: 'text',
      title: 'Review',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewer',
      type: 'string',
      title: 'Reviewer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productId',
      type: 'string',
      title: 'Product ID',
      validation: (rule) => rule.required(),
    }),
  ],
});
