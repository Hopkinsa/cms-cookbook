export const data = [
  {
    title: 'Bara Brith',
    description: '',
    tags: ['Dessert', 'British', 'Welsh'],
    img_url: 'barabrith.jpeg',
    prep_time: 10,
    cook_time: 60,
    serves: 1,
    ingredients: [
      { is_title: false, ingredient: 'Dried mixed fruit', preparation: '', quantity: 450, quantity_unit: 13 },
      { is_title: false, ingredient: 'Brown sugar', preparation: '', quantity: 250, quantity_unit: 13 },
      { is_title: false, ingredient: 'Black tea', preparation: 'warm', quantity: 300, quantity_unit: 10 },
      { is_title: false, ingredient: 'Mixed spice', preparation: '', quantity: 2, quantity_unit: 1 },
      { is_title: false, ingredient: 'Self-raising flour', preparation: '', quantity: 450, quantity_unit: 13 },
      { is_title: false, ingredient: 'Free-range egg', preparation: 'beaten', quantity: 1, quantity_unit: 0 },
    ],
    steps: [
      { is_title: false, step: 'In a large bowl soak the fruit and sugar in strained tea and leave overnight.' },
      { is_title: false, step: 'Next day preheat the oven to 170C / 325F / Gas 3.' },
      { is_title: false, step: 'Line a 900g / 2lb loaf tin with baking parchment.' },
      { is_title: false, step: 'Mix the remaining ingredients into the fruit mixture and beat well.' },
      {
        is_title: false,
        step: 'Pour the mixture into the loaf tin and bake the oven and bake for 1 1/2 hours or until a skewer inserted into the middle comes out clean.',
      },
    ],
    notes: '',
    date_created: Date.now(),
    date_updated: Date.now()
  },
];
