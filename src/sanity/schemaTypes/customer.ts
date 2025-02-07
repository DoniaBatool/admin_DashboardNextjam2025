// schemas/customer.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: rule => rule.required().email(),
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Delivery Address',
      type: 'text',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'orderReference',
      title: 'Order Reference',
      type: 'reference',
      to: [{ type: 'order' }], // Reference to the "order" document
    }),
  ]
});
