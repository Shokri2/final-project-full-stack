import { assetUrl } from "../api";

const unsplash = (id) => `https://images.unsplash.com/${id}?w=900&auto=format&fit=crop`;

const cropImages = {
  Tomato: unsplash("photo-1546094096-0df4bcaaa337"),
  Cucumber: unsplash("photo-1604977042946-1eecc30f269e"),
  Lettuce: unsplash("photo-1622206151226-18ca2c9ab4a1"),
  Pepper: unsplash("photo-1563565375-f3fdfdbefa83"),
  Eggplant: unsplash("photo-1653642690505-15e5e4e7f5c0"),
  Carrot: unsplash("photo-1445282768818-728615cc910a"),
  Potato: unsplash("photo-1518977676601-b53f82aba655"),
  Onion: unsplash("photo-1508747703725-719777637510"),
  Spinach: unsplash("photo-1576045057995-568f588f82fb"),
  Strawberry: unsplash("photo-1464965911861-746a04b4bca6"),
  Zucchini: unsplash("photo-1594282486552-05b4d80fbb9f"),
  Broccoli: unsplash("photo-1459411621453-7b03977f4bfc"),
};

export const DEFAULT_CROP_IMAGE = unsplash("photo-1500382017468-9049fed747ef");

export const getCropImage = (crop) => {
  if (crop?.image && (/^https?:\/\//.test(crop.image) || crop.image.startsWith("/uploads"))) {
    return assetUrl(crop.image);
  }

  return cropImages[crop?.name] || DEFAULT_CROP_IMAGE;
};
