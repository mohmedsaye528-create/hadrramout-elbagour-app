export const GENERATED_IMAGES = {
  heroFeast: '/src/assets/images/hero_oriental_feast_1790783451326.jpg',
  mandiPlatter: '/src/assets/images/dish_mandi_platter_1790783465085.jpg',
  mixedGrills: '/src/assets/images/dish_mixed_grills_1790783476186.jpg',
  familyFeast: '/src/assets/images/dish_family_feast_1790783488425.jpg',
  orientalPizza: '/src/assets/images/dish_oriental_pizza_1790783499421.jpg',
};

export interface MenuItemData {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: string;
  price: number; // 0 = Price set upon request / modifiable from Admin
  imageUrl: string;
  isVisible: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  isSpecialOffer: boolean;
  sortOrder: number;
}

export interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  iconName: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface RestaurantSettingsData {
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroDescAr: string;
  heroDescEn: string;
  aboutTextAr: string;
  aboutTextEn: string;
  banquetTextAr: string;
  banquetTextEn: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  priceRangeNoteAr: string;
  priceRangeNoteEn: string;
  facebookUrl: string;
  instagramUrl: string;
}

export interface GalleryItemData {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'dishes' | 'grills' | 'mandi' | 'ambiance' | 'family';
  imageUrl: string;
  isPlaceholder: boolean;
  isVisible: boolean;
  sortOrder: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'cod';
  items: string[];
  totalAmount: number;
  hasUnpricedItems: boolean;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customerUid: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface OrderTrackingData {
  id: string;
  orderNumber: string;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  totalAmount: number;
  hasUnpricedItems: boolean;
  itemCount: number;
  itemsSummaryAr: string;
  itemsSummaryEn: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ReservationData {
  id: string;
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  date: string;
  time: string;
  notes: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  customerUid: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ReviewData {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  authorUid: string;
  createdAt?: any;
  updatedAt?: any;
}

export const INITIAL_SETTINGS: RestaurantSettingsData = {
  heroTitleAr: 'مطعم حضرموت الباجور',
  heroTitleEn: 'Hadramout El-Bagour Restaurant',
  heroSubtitleAr: 'مذاق شرقي أصيل... بتجربة تستحق التكرار',
  heroSubtitleEn: 'Authentic Oriental Taste... An Experience Worth Repeating',
  heroDescAr:
    'استمتع بتشكيلة متنوعة من المأكولات الشرقية والمشويات والمندي والوجبات العائلية في أجواء مناسبة للعائلات والعزومات.',
  heroDescEn:
    'Enjoy a diverse selection of authentic Oriental cuisine, charcoal grills, traditional Mandi, and generous family platters in a welcoming setting for families and gatherings.',
  aboutTextAr:
    'يقدم مطعم حضرموت الباجور في مدينة الباجور بمحافظة المنوفية تشكيلة غنية ومتنوعة من المأكولات الشرقية الأصيلة. نركز في مطعمنا على جودة المكونات وتنوع الاختيارات التي ترضي كافة الأذواق، بدءًا من المشويات على الفحم والمندي والكفتة والأرز المندي، وصولًا إلى البيتزا والوجبات العائلية وتجهيز العزومات وعشاء العروسة، لنمنح الأفراد والعائلات والمجموعات تجربة طعام متكاملة ومميزة.',
  aboutTextEn:
    'Located in El-Bagour City, Menofia Governorate, Hadramout El-Bagour Restaurant offers a rich and diverse selection of authentic Oriental dishes. We focus on ingredient quality, generous variety, and a welcoming dining experience suitable for individuals, families, and large gatherings—ranging from charcoal grills, Mandi, and Kofta to family platters, banquet catering, Bride’s Dinner packages, and oven-baked pizza.',
  banquetTextAr:
    'نعتني بتجهيز الوجبات العائلية، صواني العزومات الكبرى، وتجهيزات عشاء العروسة والمناسبات الخاصة بعناية فائقة وتنسيق يشرفك أمام ضيوفك. تواصل معنا مباشرة لتنسيق طلبك حسب عدد الأفراد والأصناف المفضلة لديكم.',
  banquetTextEn:
    'We specialize in preparing generous family meals, grand banquet platters, Bride’s Dinner catering, and special gathering feasts tailored to your guest count and preferred dishes. Contact us directly to coordinate your custom banquet.',
  phone: '01080240315',
  whatsapp: '01080240315',
  addressAr: 'مدينة الباجور، الباجور، محافظة المنوفية، مصر',
  addressEn: 'El-Bagour City, El-Bagour, Menofia Governorate, Egypt',
  priceRangeNoteAr: 'تتحدد الأسعار حسب الأصناف والأحجام المختارة (قابلة للتحديث من إدارة المطعم)',
  priceRangeNoteEn: 'Prices vary by selected items and portion sizes (managed by restaurant administration)',
  facebookUrl: '',
  instagramUrl: '',
};

export const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: 'grills',
    nameAr: 'المشويات',
    nameEn: 'Charcoal Grills',
    descriptionAr: 'تشكيلة مشويات طازجة على الفحم بتتبيلة شرقية مميزة',
    descriptionEn: 'Fresh charcoal-grilled meats with authentic oriental marinades',
    imageUrl: GENERATED_IMAGES.mixedGrills,
    iconName: 'Flame',
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 'mandi',
    nameAr: 'المندي',
    nameEn: 'Traditional Mandi',
    descriptionAr: 'مندي مطهو بعناية مع التوابل الشرقية الأصيلة',
    descriptionEn: 'Slow-cooked traditional Mandi infused with aromatic oriental spices',
    imageUrl: GENERATED_IMAGES.mandiPlatter,
    iconName: 'UtensilsCrossed',
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 'kofta',
    nameAr: 'الكفتة',
    nameEn: 'Charcoal Kofta',
    descriptionAr: 'كفتة مشوية على الفحم بطعم شرقي أصيل',
    descriptionEn: 'Juicy charcoal-grilled Kofta skewers prepared fresh daily',
    imageUrl: GENERATED_IMAGES.mixedGrills,
    iconName: 'Flame',
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 'family-meals',
    nameAr: 'الوجبات العائلية',
    nameEn: 'Family Meals',
    descriptionAr: 'وجبات وصواني عائلية متنوعة تناسب التجمعات',
    descriptionEn: 'Generous family platters and combo meals for sharing',
    imageUrl: GENERATED_IMAGES.familyFeast,
    iconName: 'Users',
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: 'banquets',
    nameAr: 'العزومات',
    nameEn: 'Banquets & Gatherings',
    descriptionAr: 'تجهيزات متكاملة للعزومات والولائم والمناسبات',
    descriptionEn: 'Complete catering platters for banquets and special gatherings',
    imageUrl: GENERATED_IMAGES.heroFeast,
    iconName: 'Crown',
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: 'bride-dinner',
    nameAr: 'عشاء العروسة',
    nameEn: "Bride's Dinner",
    descriptionAr: 'تشكيلات فاخرة ومرتبة خصيصًا لمناسبات عشاء العروسة',
    descriptionEn: "Specially curated luxury platters for Bride's Dinner celebrations",
    imageUrl: GENERATED_IMAGES.familyFeast,
    iconName: 'Sparkles',
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: 'rice',
    nameAr: 'الأرز',
    nameEn: 'Mandi & Oriental Rice',
    descriptionAr: 'أرز مندي وأطباق أرز بسمتي بالخلطة الشرقية',
    descriptionEn: 'Fragrant Mandi rice and spiced basmati rice platters',
    imageUrl: GENERATED_IMAGES.mandiPlatter,
    iconName: 'Soup',
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: 'pizza',
    nameAr: 'البيتزا',
    nameEn: 'Oven-Baked Pizza',
    descriptionAr: 'تشكيلة بيتزا مخبوزة بعجينة طازجة وإضافات غنية',
    descriptionEn: 'Freshly baked pizzas with rich toppings and melted cheese',
    imageUrl: GENERATED_IMAGES.orientalPizza,
    iconName: 'Pizza',
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: 'oriental',
    nameAr: 'أطباق شرقية',
    nameEn: 'Oriental Dishes',
    descriptionAr: 'أطباق شرقية متنوعة محضرة يوميًا بجودة عالية',
    descriptionEn: 'Authentic Oriental specialties prepared fresh daily',
    imageUrl: GENERATED_IMAGES.heroFeast,
    iconName: 'ChefHat',
    sortOrder: 9,
    isVisible: true,
  },
  {
    id: 'drinks',
    nameAr: 'المشروبات',
    nameEn: 'Beverages',
    descriptionAr: 'مشروبات متنوعة مكملة لوجبتك',
    descriptionEn: 'Refreshing beverages to complement your meal',
    imageUrl: GENERATED_IMAGES.heroFeast,
    iconName: 'CupSoda',
    sortOrder: 10,
    isVisible: true,
  },
  {
    id: 'desserts',
    nameAr: 'الحلويات',
    nameEn: 'Desserts',
    descriptionAr: 'حلويات شرقية الأصالة لختام مميز لوجبتك',
    descriptionEn: 'Traditional Oriental desserts for a sweet finish',
    imageUrl: GENERATED_IMAGES.familyFeast,
    iconName: 'CakeSlice',
    sortOrder: 11,
    isVisible: true,
  },
];

// Authentic baseline menu items strictly matching the known categories/offerings in the prompt.
// Prices default to 0 ("يحدد عند الطلب / يضاف من لوحة التحكم") and badges default to false until set by Admin.
export const INITIAL_MENU_ITEMS: MenuItemData[] = [
  {
    id: 'item-mixed-grills',
    nameAr: 'مشويات حضرموت المشكلة',
    nameEn: 'Hadramout Mixed Charcoal Grills',
    descriptionAr: 'تشكيلة من المشويات الشرقية المشوية على الفحم، تقدم مع الأرز والسلطات والخبز الطازج.',
    descriptionEn: 'Assorted Oriental charcoal grills served with rice, fresh salads, and warm flatbread.',
    categoryId: 'grills',
    price: 0,
    imageUrl: GENERATED_IMAGES.mixedGrills,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 1,
  },
  {
    id: 'item-mandi',
    nameAr: 'مندي حضرموت الشرقي',
    nameEn: 'Traditional Hadramout Mandi',
    descriptionAr: 'مندي مطهو على الطريقة الشرقية الأصيلة مع أرز المندي المتبل بالتوابل الخاصة.',
    descriptionEn: 'Authentic slow-cooked Mandi served over aromatic spiced Mandi basmati rice.',
    categoryId: 'mandi',
    price: 0,
    imageUrl: GENERATED_IMAGES.mandiPlatter,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 2,
  },
  {
    id: 'item-kofta',
    nameAr: 'كفتة مشوية على الفحم',
    nameEn: 'Charcoal-Grilled Kofta',
    descriptionAr: 'أصابع كفتة متبلة ومشوية على الفحم بعناية، تقدم ساخنة مع الطحينة والسلطات.',
    descriptionEn: 'Seasoned charcoal-grilled Kofta skewers served hot with tahini and fresh sides.',
    categoryId: 'kofta',
    price: 0,
    imageUrl: GENERATED_IMAGES.mixedGrills,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 3,
  },
  {
    id: 'item-family-meal',
    nameAr: 'وجبة عائلية مشكلة',
    nameEn: 'Mixed Family Platter',
    descriptionAr: 'وجبة عائلية متكاملة تجمع بين المشويات والمندي والأرز المندي والسلطات، مناسبة للعائلات.',
    descriptionEn: 'Complete family meal combining grills, Mandi, fragrant rice, and salads for family sharing.',
    categoryId: 'family-meals',
    price: 0,
    imageUrl: GENERATED_IMAGES.familyFeast,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 4,
  },
  {
    id: 'item-banquet-platter',
    nameAr: 'صينية عزومات حضرموت',
    nameEn: 'Hadramout Banquet Tray',
    descriptionAr: 'صينية عزومات مجهزة للتجمعات والمناسبات تشمل تشكيلة من المشويات والمندي والأرز.',
    descriptionEn: 'Grand banquet tray prepared for gatherings and events featuring assorted grills, Mandi, and rice.',
    categoryId: 'banquets',
    price: 0,
    imageUrl: GENERATED_IMAGES.heroFeast,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 5,
  },
  {
    id: 'item-bride-dinner',
    nameAr: 'تجهيز عشاء العروسة',
    nameEn: "Bride's Dinner Special Package",
    descriptionAr: 'تشكيلة خاصة ومرتبة لمناسبة عشاء العروسة من المشويات والمندي والأطباق الشرقية حسب الطلب.',
    descriptionEn: "Custom-arranged celebratory package of Oriental grills, Mandi, and specialties for Bride's Dinner.",
    categoryId: 'bride-dinner',
    price: 0,
    imageUrl: GENERATED_IMAGES.familyFeast,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 6,
  },
  {
    id: 'item-mandi-rice',
    nameAr: 'أرز مندي شرقي',
    nameEn: 'Oriental Mandi Rice',
    descriptionAr: 'أرز مندي بسمتي مطهو بمرق وتوابل المندي الأصيلة.',
    descriptionEn: 'Fluffy long-grain basmati rice cooked with traditional Mandi spices.',
    categoryId: 'rice',
    price: 0,
    imageUrl: GENERATED_IMAGES.mandiPlatter,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 7,
  },
  {
    id: 'item-pizza',
    nameAr: 'بيتزا حضرموت',
    nameEn: 'Hadramout Oven Pizza',
    descriptionAr: 'بيتزا مخبوزة طازجة بالجبن الموتزاريلا والإضافات المتنوعة حسب اختيارك.',
    descriptionEn: 'Freshly baked pizza with melted mozzarella cheese and your choice of toppings.',
    categoryId: 'pizza',
    price: 0,
    imageUrl: GENERATED_IMAGES.orientalPizza,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 8,
  },
  {
    id: 'item-oriental-dish',
    nameAr: 'أطباق شرقية متنوعة',
    nameEn: 'Assorted Oriental Specialties',
    descriptionAr: 'تشكيلة من الأطباق الشرقية المحضرة يوميًا لتناسب كافة الأذواق.',
    descriptionEn: 'Daily selection of traditional Oriental dishes crafted with authentic spices.',
    categoryId: 'oriental',
    price: 0,
    imageUrl: GENERATED_IMAGES.heroFeast,
    isVisible: true,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isSpecialOffer: false,
    sortOrder: 9,
  },
];

export const INITIAL_GALLERY: GalleryItemData[] = [
  {
    id: 'gal-1',
    titleAr: 'تشكيلة المأكولات الشرقية والمشويات (صورة توضيحية قابلة للاستبدال)',
    titleEn: 'Oriental Feast & Charcoal Grills (Illustrative - Replaceable via Admin)',
    category: 'dishes',
    imageUrl: GENERATED_IMAGES.heroFeast,
    isPlaceholder: true,
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: 'gal-2',
    titleAr: 'المندي والأرز البسمتي الشرقي (صورة توضيحية قابلة للاستبدال)',
    titleEn: 'Traditional Mandi & Spiced Rice (Illustrative - Replaceable via Admin)',
    category: 'mandi',
    imageUrl: GENERATED_IMAGES.mandiPlatter,
    isPlaceholder: true,
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: 'gal-3',
    titleAr: 'المشويات والكفتة على الفحم (صورة توضيحية قابلة للاستبدال)',
    titleEn: 'Charcoal Grills & Kofta Skewers (Illustrative - Replaceable via Admin)',
    category: 'grills',
    imageUrl: GENERATED_IMAGES.mixedGrills,
    isPlaceholder: true,
    isVisible: true,
    sortOrder: 3,
  },
  {
    id: 'gal-4',
    titleAr: 'صواني الوجبات العائلية والعزومات (صورة توضيحية قابلة للاستبدال)',
    titleEn: 'Family Platters & Banquet Trays (Illustrative - Replaceable via Admin)',
    category: 'family',
    imageUrl: GENERATED_IMAGES.familyFeast,
    isPlaceholder: true,
    isVisible: true,
    sortOrder: 4,
  },
  {
    id: 'gal-5',
    titleAr: 'البيتزا والمخبوزات الساخنة (صورة توضيحية قابلة للاستبدال)',
    titleEn: 'Oven-Baked Pizza Selection (Illustrative - Replaceable via Admin)',
    category: 'dishes',
    imageUrl: GENERATED_IMAGES.orientalPizza,
    isPlaceholder: true,
    isVisible: true,
    sortOrder: 5,
  },
];

export interface WorkingHoursSchedule {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  dayAr: string;
  dayEn: string;
  hoursAr: string;
  hoursEn: string;
}

export const WORKING_HOURS: WorkingHoursSchedule[] = [
  {
    dayIndex: 6,
    dayAr: 'السبت',
    dayEn: 'Saturday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 0,
    dayAr: 'الأحد',
    dayEn: 'Sunday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 1,
    dayAr: 'الإثنين',
    dayEn: 'Monday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 2,
    dayAr: 'الثلاثاء',
    dayEn: 'Tuesday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 3,
    dayAr: 'الأربعاء',
    dayEn: 'Wednesday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 4,
    dayAr: 'الخميس',
    dayEn: 'Thursday',
    hoursAr: '10:01 صباحًا – 12:00 منتصف الليل',
    hoursEn: '10:01 AM – 12:00 Midnight',
  },
  {
    dayIndex: 5,
    dayAr: 'الجمعة',
    dayEn: 'Friday',
    hoursAr: '10:01 صباحًا – 3:01 صباحًا',
    hoursEn: '10:01 AM – 3:01 AM',
  },
];

/**
 * Checks whether the restaurant is currently open based on Egypt time (Africa/Cairo)
 * Saturday - Thursday: 10:01 AM to 12:00 Midnight (24:00)
 * Friday: 10:01 AM to 3:01 AM (next day Saturday early morning)
 */
export function getRestaurantOpenStatus(now: Date = new Date()): {
  isOpen: boolean;
  currentDayIndex: number;
} {
  try {
    const cairoString = now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
    const cairoDate = new Date(cairoString);
    const day = cairoDate.getDay(); // 0 Sun .. 5 Fri, 6 Sat
    const hours = cairoDate.getHours();
    const minutes = cairoDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const openMinute = 10 * 60 + 1; // 10:01 AM = 601

    // Early Saturday morning (00:00 to 03:01 AM) is part of Friday's extended shift
    if (day === 6 && totalMinutes <= 3 * 60 + 1) {
      return { isOpen: true, currentDayIndex: 5 };
    }

    // Standard opening from 10:01 AM until midnight (1439)
    const isOpen = totalMinutes >= openMinute;
    return { isOpen, currentDayIndex: day };
  } catch {
    const day = now.getDay();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    if (day === 6 && totalMinutes <= 3 * 60 + 1) {
      return { isOpen: true, currentDayIndex: 5 };
    }
    return { isOpen: totalMinutes >= 10 * 60 + 1, currentDayIndex: day };
  }
}
