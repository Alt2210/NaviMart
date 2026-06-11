import 'dotenv/config';
import mongoose, { Model } from 'mongoose';
import {
  Category,
  CategorySchema,
} from '../catalog/schemas/category.schema';
import { Food, FoodSchema } from '../catalog/schemas/food.schema';
import { Unit, UnitSchema } from '../catalog/schemas/unit.schema';
import { Recipe, RecipeSchema } from '../recipes/schemas/recipe.schema';

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

type SeedUnit = {
  code: string;
  name: string;
  type: 'weight' | 'volume' | 'count' | 'package';
};

type SeedFood = {
  name: string;
  categorySlug: string;
  defaultUnit: string;
  aliases?: string[];
  defaultStorageLocation: 'freezer' | 'fridge' | 'pantry' | 'other';
  defaultShelfLifeDays: number;
  storageTips: string;
};

type SeedRecipeIngredient = {
  foodName: string;
  quantity: number;
  unit?: string;
  optional?: boolean;
};

type SeedRecipe = {
  name: string;
  description: string;
  cookTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredients: SeedRecipeIngredient[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
};

const categories: SeedCategory[] = [
  {
    name: 'Rau cu',
    slug: 'rau-cu',
    description: 'Rau xanh, cu qua va nam tuoi.',
    icon: 'leaf',
  },
  {
    name: 'Thit ca',
    slug: 'thit-ca',
    description: 'Thit, ca, hai san va protein tuoi song.',
    icon: 'beef',
  },
  {
    name: 'Do kho',
    slug: 'do-kho',
    description: 'Gao, mi, ngu coc va thuc pham kho.',
    icon: 'package',
  },
  {
    name: 'Gia vi',
    slug: 'gia-vi',
    description: 'Gia vi, sot, dau an va nguyen lieu nem.',
    icon: 'chef-hat',
  },
  {
    name: 'Sua trung',
    slug: 'sua-trung',
    description: 'Sua, trung va cac san pham tu sua.',
    icon: 'egg',
  },
  {
    name: 'Trai cay',
    slug: 'trai-cay',
    description: 'Trai cay tuoi va trai cay cat san.',
    icon: 'apple',
  },
];

const units: SeedUnit[] = [
  { code: 'g', name: 'Gram', type: 'weight' },
  { code: 'kg', name: 'Kilogram', type: 'weight' },
  { code: 'ml', name: 'Milliliter', type: 'volume' },
  { code: 'l', name: 'Liter', type: 'volume' },
  { code: 'cai', name: 'Cai', type: 'count' },
  { code: 'qua', name: 'Qua', type: 'count' },
  { code: 'bo', name: 'Bo', type: 'count' },
  { code: 'hop', name: 'Hop', type: 'package' },
  { code: 'goi', name: 'Goi', type: 'package' },
  { code: 'muong', name: 'Muong', type: 'count' },
];

const foods: SeedFood[] = [
  {
    name: 'Thit bo',
    categorySlug: 'thit-ca',
    defaultUnit: 'g',
    aliases: ['bo', 'beef'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 3,
    storageTips: 'Bao quan ngan mat, dung som trong 1-3 ngay.',
  },
  {
    name: 'Thit ga',
    categorySlug: 'thit-ca',
    defaultUnit: 'g',
    aliases: ['ga', 'chicken'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 2,
    storageTips: 'De trong hop kin, tranh tiep xuc thuc pham chin.',
  },
  {
    name: 'Ca hoi',
    categorySlug: 'thit-ca',
    defaultUnit: 'g',
    aliases: ['salmon'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 2,
    storageTips: 'Giu lanh sau khi mua, nen dung trong 24-48 gio.',
  },
  {
    name: 'Trung ga',
    categorySlug: 'sua-trung',
    defaultUnit: 'qua',
    aliases: ['trung'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 21,
    storageTips: 'De trong vi tri on dinh nhiet do, khong rua truoc khi cat.',
  },
  {
    name: 'Sua tuoi',
    categorySlug: 'sua-trung',
    defaultUnit: 'ml',
    aliases: ['sua'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 5,
    storageTips: 'Dong nap kin sau khi mo va dung trong vai ngay.',
  },
  {
    name: 'Ca rot',
    categorySlug: 'rau-cu',
    defaultUnit: 'g',
    aliases: ['carrot'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 14,
    storageTips: 'Cat bo la, de ngan rau cu.',
  },
  {
    name: 'Bong cai xanh',
    categorySlug: 'rau-cu',
    defaultUnit: 'g',
    aliases: ['broccoli'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 5,
    storageTips: 'De kho thoang trong tui giay hoac hop co lo thoang.',
  },
  {
    name: 'Ca chua',
    categorySlug: 'rau-cu',
    defaultUnit: 'g',
    aliases: ['tomato'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 7,
    storageTips: 'De noi thoang mat neu chua chin qua.',
  },
  {
    name: 'Hanh tay',
    categorySlug: 'rau-cu',
    defaultUnit: 'g',
    aliases: ['onion'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 21,
    storageTips: 'De noi kho, thoang, tranh anh nang truc tiep.',
  },
  {
    name: 'Gao',
    categorySlug: 'do-kho',
    defaultUnit: 'g',
    aliases: ['rice'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 180,
    storageTips: 'Bao quan trong hop kin, tranh am.',
  },
  {
    name: 'Mi goi',
    categorySlug: 'do-kho',
    defaultUnit: 'goi',
    aliases: ['mi an lien'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 120,
    storageTips: 'De noi kho mat.',
  },
  {
    name: 'Dau an',
    categorySlug: 'gia-vi',
    defaultUnit: 'ml',
    aliases: ['oil'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 180,
    storageTips: 'Dong nap kin, tranh anh nang.',
  },
  {
    name: 'Nuoc mam',
    categorySlug: 'gia-vi',
    defaultUnit: 'ml',
    aliases: ['fish sauce'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 365,
    storageTips: 'Dong nap kin sau khi dung.',
  },
  {
    name: 'Gung',
    categorySlug: 'gia-vi',
    defaultUnit: 'g',
    aliases: ['ginger'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 14,
    storageTips: 'De noi kho thoang hoac ngan mat neu da cat.',
  },
  {
    name: 'Tao',
    categorySlug: 'trai-cay',
    defaultUnit: 'qua',
    aliases: ['apple'],
    defaultStorageLocation: 'fridge',
    defaultShelfLifeDays: 21,
    storageTips: 'De ngan mat de giu do gion lau hon.',
  },
  {
    name: 'Chuoi',
    categorySlug: 'trai-cay',
    defaultUnit: 'qua',
    aliases: ['banana'],
    defaultStorageLocation: 'pantry',
    defaultShelfLifeDays: 5,
    storageTips: 'De ngoai nhiet do phong, tach khoi trai cay khac neu chin nhanh.',
  },
];

const recipes: SeedRecipe[] = [
  {
    name: 'Thit bo xao rau cu',
    description: 'Mon xao nhanh voi thit bo, ca rot va bong cai xanh.',
    cookTimeMinutes: 25,
    difficulty: 'easy',
    servings: 2,
    ingredients: [
      { foodName: 'Thit bo', quantity: 300, unit: 'g' },
      { foodName: 'Ca rot', quantity: 150, unit: 'g' },
      { foodName: 'Bong cai xanh', quantity: 200, unit: 'g' },
      { foodName: 'Dau an', quantity: 20, unit: 'ml' },
      { foodName: 'Nuoc mam', quantity: 15, unit: 'ml' },
    ],
    steps: [
      'Cat mong thit bo va uop voi nuoc mam.',
      'So che rau cu thanh mieng vua an.',
      'Lam nong chao, xao thit bo nhanh tren lua lon.',
      'Them rau cu, dao deu den khi vua chin.',
    ],
    nutrition: { calories: 480, protein: 36, carbs: 28, fat: 22 },
    tags: ['quick', 'dinner', 'beef'],
  },
  {
    name: 'Canh ca chua trung',
    description: 'Canh don gian voi trung va ca chua cho bua an nhe.',
    cookTimeMinutes: 15,
    difficulty: 'easy',
    servings: 2,
    ingredients: [
      { foodName: 'Trung ga', quantity: 2, unit: 'qua' },
      { foodName: 'Ca chua', quantity: 200, unit: 'g' },
      { foodName: 'Nuoc mam', quantity: 10, unit: 'ml' },
    ],
    steps: [
      'Cat mui cau ca chua.',
      'Nau soi nuoc, cho ca chua vao den khi mem.',
      'Danh tan trung va do tu tu vao noi.',
      'Nem nuoc mam vua an.',
    ],
    nutrition: { calories: 220, protein: 14, carbs: 12, fat: 12 },
    tags: ['soup', 'egg', 'quick'],
  },
  {
    name: 'Ga kho gung',
    description: 'Thit ga kho dam vi voi gung va nuoc mam.',
    cookTimeMinutes: 35,
    difficulty: 'medium',
    servings: 3,
    ingredients: [
      { foodName: 'Thit ga', quantity: 600, unit: 'g' },
      { foodName: 'Gung', quantity: 30, unit: 'g' },
      { foodName: 'Nuoc mam', quantity: 30, unit: 'ml' },
      { foodName: 'Dau an', quantity: 15, unit: 'ml' },
    ],
    steps: [
      'Cat thit ga thanh mieng vua an.',
      'Thai soi gung va uop cung thit ga, nuoc mam.',
      'Ap chao thit ga voi dau an.',
      'Them it nuoc va kho den khi sot sanh lai.',
    ],
    nutrition: { calories: 560, protein: 48, carbs: 8, fat: 34 },
    tags: ['chicken', 'dinner', 'vietnamese'],
  },
  {
    name: 'Com ca hoi ap chao',
    description: 'Ca hoi ap chao an cung com va rau cu.',
    cookTimeMinutes: 30,
    difficulty: 'medium',
    servings: 2,
    ingredients: [
      { foodName: 'Ca hoi', quantity: 300, unit: 'g' },
      { foodName: 'Gao', quantity: 200, unit: 'g' },
      { foodName: 'Ca rot', quantity: 100, unit: 'g' },
      { foodName: 'Dau an', quantity: 10, unit: 'ml' },
    ],
    steps: [
      'Nau com tu gao.',
      'Uop ca hoi voi chut nuoc mam.',
      'Ap chao ca hoi den khi vang hai mat.',
      'An kem ca rot hap hoac xao nhanh.',
    ],
    nutrition: { calories: 620, protein: 34, carbs: 58, fat: 24 },
    tags: ['salmon', 'rice', 'healthy'],
  },
  {
    name: 'Salad trai cay sua tuoi',
    description: 'Mon nhe tu tao, chuoi va sua tuoi.',
    cookTimeMinutes: 10,
    difficulty: 'easy',
    servings: 2,
    ingredients: [
      { foodName: 'Tao', quantity: 2, unit: 'qua' },
      { foodName: 'Chuoi', quantity: 2, unit: 'qua' },
      { foodName: 'Sua tuoi', quantity: 150, unit: 'ml' },
    ],
    steps: [
      'Cat nho tao va chuoi.',
      'Cho trai cay vao bat.',
      'Them sua tuoi va tron deu.',
      'Dung lanh neu thich.',
    ],
    nutrition: { calories: 260, protein: 6, carbs: 52, fat: 4 },
    tags: ['fruit', 'snack', 'breakfast'],
  },
];

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

async function upsertCategories(categoryModel: Model<Category>) {
  const result = new Map<string, Category>();

  for (const category of categories) {
    const document = await categoryModel
      .findOneAndUpdate(
        { slug: category.slug },
        { $set: { ...category, status: 'active' } },
        { new: true, upsert: true },
      )
      .exec();

    result.set(category.slug, document);
  }

  return result;
}

async function upsertUnits(unitModel: Model<Unit>) {
  for (const unit of units) {
    await unitModel
      .findOneAndUpdate(
        { code: unit.code },
        { $set: { ...unit, status: 'active' } },
        { new: true, upsert: true },
      )
      .exec();
  }
}

async function upsertFoods(
  foodModel: Model<Food>,
  categoryBySlug: Map<string, Category>,
) {
  const result = new Map<string, Food>();

  for (const food of foods) {
    const category = categoryBySlug.get(food.categorySlug);
    if (!category) {
      throw new Error(`Missing category for food: ${food.name}`);
    }

    const document = await foodModel
      .findOneAndUpdate(
        { normalizedName: normalizeName(food.name) },
        {
          $set: {
            name: food.name,
            normalizedName: normalizeName(food.name),
            categoryId: category._id,
            defaultUnit: food.defaultUnit,
            aliases: food.aliases ?? [],
            defaultStorageLocation: food.defaultStorageLocation,
            defaultShelfLifeDays: food.defaultShelfLifeDays,
            storageTips: food.storageTips,
            isSystem: true,
            status: 'active',
          },
        },
        { new: true, upsert: true },
      )
      .exec();

    result.set(food.name, document);
  }

  return result;
}

async function upsertRecipes(
  recipeModel: Model<Recipe>,
  foodByName: Map<string, Food>,
) {
  for (const recipe of recipes) {
    const ingredients = recipe.ingredients.map((ingredient) => {
      const food = foodByName.get(ingredient.foodName);
      if (!food) {
        throw new Error(`Missing food for recipe ingredient: ${ingredient.foodName}`);
      }

      return {
        foodId: food._id,
        name: food.name,
        categoryId: food.categoryId,
        quantity: ingredient.quantity,
        unit: ingredient.unit ?? food.defaultUnit,
        optional: ingredient.optional ?? false,
      };
    });

    await recipeModel
      .findOneAndUpdate(
        { normalizedName: normalizeName(recipe.name) },
        {
          $set: {
            name: recipe.name,
            normalizedName: normalizeName(recipe.name),
            description: recipe.description,
            cookTimeMinutes: recipe.cookTimeMinutes,
            difficulty: recipe.difficulty,
            servings: recipe.servings,
            ingredients,
            steps: recipe.steps,
            nutrition: recipe.nutrition,
            tags: recipe.tags,
            status: 'approved',
          },
        },
        { new: true, upsert: true },
      )
      .exec();
  }
}

async function bootstrap() {
  const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/navimart';
  const dbName = process.env.MONGODB_DB_NAME;

  await mongoose.connect(mongoUri, dbName ? { dbName } : undefined);

  const categoryModel = mongoose.model(Category.name, CategorySchema);
  const unitModel = mongoose.model(Unit.name, UnitSchema);
  const foodModel = mongoose.model(Food.name, FoodSchema);
  const recipeModel = mongoose.model(Recipe.name, RecipeSchema);

  const categoryBySlug = await upsertCategories(categoryModel);
  await upsertUnits(unitModel);
  const foodByName = await upsertFoods(foodModel, categoryBySlug);
  await upsertRecipes(recipeModel, foodByName);

  console.log(
    `Seed completed: ${categories.length} categories, ${units.length} units, ${foods.length} foods, ${recipes.length} recipes.`,
  );

  await mongoose.disconnect();
}

bootstrap().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
