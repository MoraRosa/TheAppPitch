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
  manifesto: 'Every jar, every mist, every match struck \u2014 someone small and scaled had a hand in it.',
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
  { name: 'Moon Dew Facial Mist',   price: '$34', stock: 42, img: `${ASSET_PATH}/moon-dew-mist.jpg`,
    description: 'A weightless mist of moonflower extract and dew-collected botanicals, sealed with a little gold flake for good measure. Mist over clean skin any time it needs a lift — morning fog, midday slump, or right before bed.',
    details: ['100ml / 3.4 fl oz', 'Moonflower extract, aloe, lavender hydrosol', 'Vegan, cruelty-free', 'Handcrafted in small batches'] },
  { name: 'Solar Radiance Elixir',  price: '$48', stock: 18, img: `${ASSET_PATH}/solar-radiance.jpg`,
    description: 'Saffron, marigold, and sea buckthorn in a gold-flecked oil that sinks in fast and leaves skin looking lit from within. Bramble insists it be bottled at dawn — we haven\u2019t tested whether that actually matters.',
    details: ['30ml / 1 fl oz', 'Saffron, marigold, sea buckthorn oil', 'Cold-pressed, unfiltered', 'One dropper, morning or night'] },
  { name: 'Dragon Mint Tea',        price: '$22', stock: 65, img: `${ASSET_PATH}/dragon-mint-tea.jpg`,
    description: 'Peppermint, spearmint, lemon balm, and honeybush, gathered before sunrise by dragons who take the whole ritual very seriously. Steeps into something between a tea and a small ceremony.',
    details: ['60g loose leaf, ~20 servings', 'Peppermint, spearmint, lemon balm, honeybush', 'Caffeine-free', 'Steep 4\u20135 min at 90\u00b0C'] },
  { name: 'Phoenix Ember Candle',   price: '$28', stock: 31, img: `${ASSET_PATH}/phoenix-ember.jpg`,
    description: 'A crackling wood-wick candle that sounds like a small campfire and smells like one too, minus the smoke in your eyes. Hand-poured, and yes, a small dragon supervises every batch.',
    details: ['8 oz, ~45 hour burn', 'Soy-coconut wax blend', 'Crackling wood wick', 'Hand-poured in small batches'] },
  { name: 'Whispering Moss Soap',   price: '$18', stock: 54, img: `${ASSET_PATH}/whispering-moss-soap.jpg`,
    description: 'A dense, moss-green bar built around real moss and mint, milled slow so it lasts. Lathers quiet, rinses clean, smells like the forest floor after rain.',
    details: ['120g bar', 'Moss extract, mint, shea butter', 'Palm-oil free', 'Cures 4\u20136 weeks before sale'] },
  { name: "Bramble's Bath Ritual",  price: '$26', stock: 22, img: `${ASSET_PATH}/bath-ritual.jpg`,
    description: 'A jar of mineral salts, dried petals, and oat milk powder, named after the dragon who keeps insisting the botanical garden needs "just one more bed" of chamomile.',
    details: ['300g, ~6 baths', 'Epsom salt, dried petals, oat milk powder', 'Unscented base, light lavender finish', 'Not tested on dragons (they refuse to bathe)'] },
];

// Full post bodies for the blog reader view. Short but real paragraphs, not
// filler — these render as-is on the reader page.
export const EMBER_MOSS_JOURNAL_BODY = {
  "A Dragon's Guide to Brewing the Perfect Cup of Tea": [
    'Bramble has opinions about water temperature, and none of them are negotiable. Too hot and the mint turns bitter; too cool and the honeybush never opens up. He steeps at 90\u00b0C for four minutes, no more, timed by a small brass hourglass that predates the shop itself.',
    'Glass, always glass \u2014 never ceramic, never metal. He says he can see the color change as it steeps, and that\u2019s half the point of making tea in the first place.',
  ],
  'Seven Herbs We Gather Before Sunrise': [
    'The dawn harvest isn\u2019t superstition, or not only superstition. Essential oils in mint and lemon balm are highest right before the sun hits the leaves \u2014 by mid-morning, a meaningful amount has already evaporated.',
    'So the gathering happens early, usually before the shop opens, usually with more dragons underfoot than strictly necessary for the job.',
  ],
  'Why Our Candle Makers Insist on Crackling Wood Wicks': [
    'A wood wick doesn\u2019t just burn \u2014 it crackles, low and steady, like a campfire two rooms away. That sound does something a silent flame can\u2019t: it makes a room feel occupied, even when it\u2019s just you.',
    'It took eleven batches to get the wick-to-wax ratio right. The dragons were unusually patient about it, mostly because testing involved a lot of candle-lit tea.',
  ],
};

export const EMBER_MOSS_CONTACT = {
  email: 'hello@emberandmoss.shop',
  note: 'We read every message \u2014 usually by candlelight, occasionally by an actual dragon.',
};

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

// Storefront-theme PRESETS for the Storefront Customization slide. This is
// the actual product moat, made concrete: a merchant brings their content
// ONCE (see EMBER_MOSS_BRAND / EMBER_MOSS_PRODUCTS above) and every preset
// below re-renders that SAME content — same products, same photos, same
// tagline, same manifesto — through a completely different layout skeleton.
// The merchant never designs a theme; they just pick one. So these carry
// visual tokens only (color, font, layout style) — never their own content.
export const STOREFRONT_THEME_SWATCHES = [
  { id: 'a', label: 'Botanical',    style: 'elegant',   bg: '#1B3B2E', accent: '#C9A227', text: '#F5F1E4', font: "'Cormorant Garamond', serif" },
  { id: 'b', label: 'Workshop',     style: 'brutalist', bg: '#141414', accent: '#E8B923', text: '#F2F2F2', font: "'Space Mono', monospace" },
  { id: 'c', label: 'Bubblegum',    style: 'bubbly',    bg: '#FFE9F4', accent: '#FF3E9E', text: '#5A1240', font: "'Quicksand', sans-serif" },
  { id: 'd', label: 'Directorate',  style: 'minimal',   bg: '#EFF1F4', accent: '#2B3A55', text: '#1A222E', font: "'Inter', sans-serif" },
];
