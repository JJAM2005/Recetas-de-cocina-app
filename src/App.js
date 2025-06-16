//import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';


const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dessert');
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchMealsByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories.php`);
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError('Error al cargar las categorías');
    }
  };

  const fetchMealsByCategory = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/filter.php?c=${category}`);
      const data = await res.json();
      setMeals(data.meals);
      setSelectedMeal(null);
    } catch (err) {
      setError('Error al cargar recetas por categoría');
    } finally {
      setLoading(false);
    }
  };

  const searchMeals = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search.php?s=${searchTerm}`);
      const data = await res.json();
      setMeals(data.meals || []);
      setSelectedMeal(null);
    } catch (err) {
      setError('Error en la búsqueda de recetas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMealDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/lookup.php?i=${id}`);
      const data = await res.json();
      setSelectedMeal(data.meals[0]);
    } catch (err) {
      setError('Error al obtener detalles de la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Recetas de Cocina</h1>

      <div className="controls">
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.idCategory} value={cat.strCategory}>{cat.strCategory}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchMeals}>Buscar</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!selectedMeal ? (
        <div className="meal-list">
          {meals.map((meal) => (
            <div key={meal.idMeal} className="meal-card" onClick={() => fetchMealDetails(meal.idMeal)}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <h3>{meal.strMeal}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="meal-details">
          <h2>{selectedMeal.strMeal}</h2>
          <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
          <p><strong>Categoría:</strong> {selectedMeal.strCategory}</p>
          <p><strong>Área:</strong> {selectedMeal.strArea}</p>
          <h3>Ingredientes:</h3>
          <ul>
            {Array.from({ length: 20 }, (_, i) => {
              const ingredient = selectedMeal[`strIngredient${i + 1}`];
              const measure = selectedMeal[`strMeasure${i + 1}`];
              return ingredient ? <li key={i}>{ingredient} - {measure}</li> : null;
            })}
          </ul>
          <h3>Instrucciones:</h3>
          <p>{selectedMeal.strInstructions}</p>
          <button onClick={() => setSelectedMeal(null)}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default App;

