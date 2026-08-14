// ─── EMBER & MOSS — DEMO BRAND DATA ────────────────────────────────────────────
// The example brand shown throughout the demo deck's storefront-facing slides
// (Welcome, Customer, Merchant, Storefront Customization). Product data,
// pricing, stock, and image paths live here — separate from the mockup
// components that render them — so:
//   - adding/editing/removing a product is a one-line change, not a
//     find-and-replace across multiple component files
//   - the customer storefront and the merchant dashboard read from the same
//     list and can never drift out of sync with each other again
//   - swapping in a different demo brand later means editing this file only

export const EMBER_MOSS_BRAND = {
  name: 'Ember & Moss',
  tagline: 'Handmade by tiny dragons.',
  url: 'emberandmoss.shop',
};

// Photos live in /public/demo-assets/ember-moss/. Relative path (no leading
// slash) — this deploys to GitHub Pages under a repo subpath (base:
// '/TheAppPitch/' in vite.config.js), and an absolute '/demo-assets/...'
// path resolves against the domain root, not the repo subpath, and 404s.
// HashRouter keeps the document location constant across routes, so a
// relative path here stays correct everywhere in the app.
const ASSET_PATH = './demo-assets/ember-moss';

export const EMBER_MOSS_PRODUCTS = [
  { name: 'Moon Dew Facial Mist',   price: '$34', stock: 42, img: `${ASSET_PATH}/moon-dew-mist.jpg` },
  { name: 'Solar Radiance Elixir',  price: '$48', stock: 18, img: `${ASSET_PATH}/solar-radiance.jpg` },
  { name: 'Dragon Mint Tea',        price: '$22', stock: 65, img: `${ASSET_PATH}/dragon-mint-tea.jpg` },
  { name: 'Phoenix Ember Candle',   price: '$28', stock: 31, img: `${ASSET_PATH}/phoenix-ember.jpg` },
  { name: 'Whispering Moss Soap',   price: '$18', stock: 54, img: `${ASSET_PATH}/whispering-moss-soap.jpg` },
  { name: "Bramble's Bath Ritual",  price: '$26', stock: 22, img: `${ASSET_PATH}/bath-ritual.jpg` },
];

// Featured on the Welcome slide's storefront landing page. Images optional —
// falls back to the icon on a soft placeholder until real photos exist (see
// blog-* filenames below). Drop files into /public/demo-assets/ember-moss/journal/.
export const EMBER_MOSS_JOURNAL = [
  { icon: '🍵', title: "A Dragon's Guide to Brewing the Perfect Cup of Tea", excerpt: 'Bramble walks through water temperature, steep time, and why he insists on glass.', img: `${ASSET_PATH}/journal/blog-tea-guide.jpg` },
  { icon: '🌿', title: 'Seven Herbs We Gather Before Sunrise', excerpt: 'The dawn harvest ritual behind every batch of Dragon Mint Tea.', img: `${ASSET_PATH}/journal/blog-herb-harvest.jpg` },
  { icon: '🕯️', title: 'Why Our Candle Makers Insist on Crackling Wood Wicks', excerpt: 'A small obsession with sound, and what it does for the whole ritual.', img: `${ASSET_PATH}/journal/blog-candle-wicks.jpg` },
];

export const EMBER_MOSS_TESTIMONIALS = [
  { quote: 'The Moon Dew mist is the first skincare thing I\u2019ve ever finished a bottle of and immediately reordered.', name: 'R. Alvarez', rating: 5 },
  { quote: 'Ordered the tea as a joke gift. Now three people in my office are hooked.', name: 'S. Kim', rating: 5 },
  { quote: 'Shipping was fast and the packaging alone made it worth it.', name: 'D. Osei', rating: 4 },
];

export const EMBER_MOSS_FAQ = [
  { q: 'Is everything cruelty-free?', a: 'Yes — nothing in the collection is tested on anyone, dragons included.' },
  { q: 'How long does shipping take?', a: 'Most orders arrive within 3\u20135 business days across Canada.' },
  { q: 'Can I return something?', a: '30-day returns on unopened items, no questions asked.' },
];

// Storefront-theme swatches for the Storefront Customization slide. One of
// these is the real Ember & Moss palette; the other three are placeholder
// "other tenants on the platform" to demonstrate multi-tenant theming.
export const STOREFRONT_THEME_SWATCHES = [
  { id: 'a', label: 'Ember & Moss', bg: '#1B3B2E', accent: '#C9A227', text: '#F5F1E4', font: "'Cormorant Garamond', serif" },
  { id: 'b', label: 'Studio',       bg: '#111111', accent: '#F2E205', text: '#F5F5F5', font: "'Space Mono', monospace" },
  { id: 'c', label: 'Blush',        bg: '#FCEFEF', accent: '#D6597A', text: '#402A2E', font: "'Quicksand', sans-serif" },
  { id: 'd', label: 'Slate',        bg: '#F4F6F8', accent: '#3B5BDB', text: '#1B2430', font: "'Inter', sans-serif" },
];
