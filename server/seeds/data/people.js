// Test accounts. All share the password from SEED_PASSWORD (see .env.example).
// `specialties` lists category names (agronomist_specialties many-to-many).

export const users = [
  { key: "admin", name: "System Admin", email: "admin@alhasad.test", role: "admin", phone: "0590000001" },
  {
    key: "agro1",
    name: "Dr. Lina Haddad",
    email: "lina.agronomist@alhasad.test",
    role: "agronomist",
    phone: "0590000002",
    specialties: ["Fruiting Vegetables", "Fruits"],
  },
  {
    key: "agro2",
    name: "Eng. Omar Saleh",
    email: "omar.agronomist@alhasad.test",
    role: "agronomist",
    phone: "0590000003",
    specialties: ["Leafy Greens", "Root & Bulb Crops"],
  },
  { key: "farmer1", name: "Ahmad Khalil", email: "ahmad.farmer@alhasad.test", role: "user", phone: "0590000004" },
  { key: "farmer2", name: "Sara Nasser", email: "sara.farmer@alhasad.test", role: "user", phone: "0590000005" },
  { key: "farmer3", name: "Yousef Odeh", email: "yousef.farmer@alhasad.test", role: "user", phone: "0590000006" },
  // Registered but never verified their email -> cannot log in yet.
  { key: "unverified", name: "Nour Jaber", email: "nour.unverified@alhasad.test", role: "user", verified: false },
  // Deactivated by the admin -> cannot log in.
  { key: "inactive", name: "Khaled Amin", email: "khaled.inactive@alhasad.test", role: "user", active: false },
];

// Each request walks through `steps` (status transitions after creation).
// The seed writes every step to request_status_history, like the real API will.
export const requests = [
  {
    user: "farmer1",
    crop: "Tomato",
    title: "Yellow spots on tomato leaves",
    description: "Lower leaves are turning yellow with brown spots, spreading upwards over the last week.",
    farm_location: "Jenin",
    field_area_m2: 800,
    priority: "high",
    daysAgo: 12,
    steps: [
      { to: "assigned", by: "admin", agronomist: "agro1", note: "Assigned to tomato specialist." },
      { to: "in_progress", by: "agro1" },
      {
        to: "answered",
        by: "agro1",
        response: "Looks like early blight. Remove infected leaves, avoid overhead watering and apply a copper-based fungicide every 7-10 days.",
      },
      { to: "closed", by: "farmer1", note: "Thanks, the treatment worked." },
    ],
  },
  {
    user: "farmer1",
    crop: "Potato",
    title: "Best irrigation schedule for potatoes",
    description: "Planting next month on sandy soil. How often should I irrigate during tuber formation?",
    farm_location: "Jenin",
    field_area_m2: 1500,
    priority: "medium",
    daysAgo: 6,
    steps: [
      { to: "assigned", by: "admin", agronomist: "agro2" },
      { to: "in_progress", by: "agro2" },
      {
        to: "answered",
        by: "agro2",
        response: "On sandy soil irrigate every 3-4 days during tuber formation, keeping moisture steady. Reduce as foliage yellows.",
      },
    ],
  },
  {
    user: "farmer2",
    crop: "Cucumber",
    title: "Bitter cucumbers in greenhouse",
    description: "Fruits taste bitter even though the plants look healthy.",
    farm_location: "Tulkarm",
    field_area_m2: 400,
    priority: "medium",
    daysAgo: 4,
    steps: [
      { to: "assigned", by: "admin", agronomist: "agro1" },
      { to: "in_progress", by: "agro1" },
    ],
  },
  {
    user: "farmer2",
    crop: "Lettuce",
    title: "Lettuce bolting too early",
    description: "Plants send up flower stalks before heads form.",
    farm_location: "Tulkarm",
    priority: "low",
    daysAgo: 3,
    steps: [{ to: "assigned", by: "admin", agronomist: "agro2" }],
  },
  {
    user: "farmer3",
    crop: "Strawberry",
    title: "White powder on strawberry leaves",
    description: "A white powdery layer appeared on the upper side of the leaves.",
    farm_location: "Nablus",
    field_area_m2: 250,
    priority: "high",
    daysAgo: 1,
    steps: [],
  },
  {
    user: "farmer3",
    crop: "Onion",
    title: "When to stop watering onions",
    description: "Bulbs are forming. When should irrigation stop before harvest?",
    farm_location: "Nablus",
    priority: "low",
    daysAgo: 2,
    steps: [],
  },
  {
    user: "farmer1",
    crop: "Carrot",
    title: "Need someone to plough my land",
    description: "Looking for a tractor service for my field.",
    farm_location: "Jenin",
    priority: "low",
    daysAgo: 9,
    steps: [
      {
        to: "rejected",
        by: "admin",
        reason: "This platform provides agronomy consultations only, not machinery services.",
      },
    ],
  },
  {
    user: "farmer2",
    crop: "Pepper",
    title: "Pepper seedlings question",
    description: "Duplicate of a question I already asked by phone.",
    priority: "low",
    daysAgo: 8,
    steps: [{ to: "cancelled", by: "farmer2", note: "Cancelled by the farmer." }],
  },
];

export const feedback = [
  { user: "farmer1", request: "Yellow spots on tomato leaves", crop: "Tomato", rating: 5, comment: "Very fast and accurate diagnosis. The treatment saved my crop!", status: "approved", reviewer: "admin" },
  { user: "farmer2", crop: "Cucumber", rating: 4, comment: "The cucumber guide is clear and the growth stages helped me plan.", status: "approved", reviewer: "agro1" },
  { user: "farmer3", crop: "Strawberry", rating: 5, comment: "Great information about strawberries.", status: "pending" },
  { user: "farmer1", crop: "Potato", rating: 4, comment: "Useful potato guide, would love more pictures.", status: "pending" },
  { user: "farmer2", crop: "Lettuce", rating: 1, comment: "spam spam visit my website", status: "rejected", reviewer: "admin", reason: "Spam / promotional content." },
];

export const contactMessages = [
  { name: "Mahmoud Saeed", email: "mahmoud@example.com", subject: "Partnership", message: "We run an agricultural cooperative and would like to work with your agronomists.", status: "new" },
  { name: "Rana Ali", email: "rana@example.com", subject: "Account question", message: "I did not receive the verification email.", status: "read" },
];
