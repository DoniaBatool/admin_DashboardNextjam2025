
export const order= {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
      {
        name: 'orderId',
        title: 'Order ID',
        type: 'string',
       
      },
      {
        name: 'cartItems',
        title: 'Cart Items',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'productName', title: 'Product Name', type: 'string' },
              { name: 'productDescription', title: 'Product Description', type: 'string' },
              { name: 'quantity', title: 'Quantity', type: 'number' },
              { name: 'serviceType', title: 'Service Type', type: 'string' },
              { name: 'productPrice', title: 'Product Price', type: 'number' },
            ]
          }
        ],
      },
      {
        name: 'orderDate',
        title: 'Order Date',
        type: 'datetime',
       
      },
      
      {
        name: 'customerInfo',
        title: 'Customer Information',
        type: 'reference',
        to: [{ type: 'customer' }],
        // Initially this will be empty, but will be filled after checkout
      },
      {
        name: "trackingNumber",  // New field for tracking number
        title: "Tracking Number",
        type: "string",
        description: "Tracking number for the order",  // Optional description
      },
      {
        name: 'carrier',
        title: 'Carrier',
        type: 'string', // or 'text' if you expect a longer value
        description: 'The carrier handling the shipment (e.g., Shippo)',
      },
    ]
  };
  