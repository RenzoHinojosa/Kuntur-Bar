// Catálogo externo: TheCocktailDB (gratis, sin API key, con imágenes).
// https://www.thecocktaildb.com/api.php
export const BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

export const SECCIONES = [
  { id: 'autor', label: 'Cócteles de autor', icono: 'Martini', url: `${BASE}/filter.php?c=Cocktail` },
  { id: 'pisco', label: 'Con pisco', icono: 'Grape', url: `${BASE}/search.php?s=pisco` },
  { id: 'clasicos', label: 'Clásicos', icono: 'Wine', url: `${BASE}/filter.php?c=Ordinary_Drink` },
  { id: 'shots', label: 'Shots', icono: 'FlaskConical', url: `${BASE}/filter.php?c=Shot` },
  { id: 'cafe', label: 'Café y té', icono: 'Coffee', url: `${BASE}/filter.php?c=Coffee_/_Tea` },
  { id: 'cerveza', label: 'Cervezas', icono: 'Beer', url: `${BASE}/filter.php?c=Beer` },
  { id: 'sinalcohol', label: 'Sin alcohol', icono: 'Leaf', url: `${BASE}/filter.php?a=Non_Alcoholic` },
  { id: 'batidos', label: 'Batidos', icono: 'Milk', url: `${BASE}/filter.php?c=Shake` },
];

export const RANDOM_URL = `${BASE}/random.php`;
export const lookupUrl = (id) => `${BASE}/lookup.php?i=${id}`;

// La API no trae precios: los generamos de forma determinista a partir del id (S/ 18 a S/ 36).
export const priceFor = (id) => 18 + (Number(id) % 19);

// Miniaturas: la API sirve /small, /medium y /large
export const imgUrl = (thumb, size = 'medium') => `${thumb}/${size}`;
export const ingredientImg = (name) =>
  `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;

export function normalizeList(json) {
  if (!json || !Array.isArray(json.drinks)) return []; // la API responde null o "no data found"
  return json.drinks.map((d) => ({
    id: d.idDrink,
    name: d.strDrink,
    thumb: d.strDrinkThumb,
    price: priceFor(d.idDrink),
  }));
}

const ALCOHOL = {
  Alcoholic: 'Con alcohol',
  'Non alcoholic': 'Sin alcohol',
  'Non Alcoholic': 'Sin alcohol',
  'Optional alcohol': 'Alcohol opcional',
};

export function normalizeDetail(json) {
  const d = Array.isArray(json?.drinks) ? json.drinks[0] : null;
  if (!d) return null;
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = d[`strIngredient${i}`];
    if (name) ingredients.push({ name, measure: (d[`strMeasure${i}`] || '').trim() });
  }
  return {
    id: d.idDrink,
    name: d.strDrink,
    thumb: d.strDrinkThumb,
    price: priceFor(d.idDrink),
    category: d.strCategory,
    glass: d.strGlass,
    alcohol: ALCOHOL[d.strAlcoholic] ?? d.strAlcoholic,
    instructions: d.strInstructionsES || d.strInstructions || '',
    ingredients,
  };
}
