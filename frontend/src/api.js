const API_URL = '/api';

export async function fetchFurniture(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'Todo') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.compactOnly) params.append('compactOnly', 'true');

  const url = `${API_URL}/furniture${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar catálogo');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
  return data;
}

export async function createFurniture(furnitureData, token) {
  const res = await fetch(`${API_URL}/furniture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(furnitureData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al guardar mueble');
  return data;
}

export async function updateFurniture(id, furnitureData, token) {
  const res = await fetch(`${API_URL}/furniture/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(furnitureData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar');
  return data;
}

export async function deleteFurniture(id, token) {
  const res = await fetch(`${API_URL}/furniture/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar');
  return data;
}

export async function uploadImages(files, token) {
  const formData = new FormData();
  if (Array.isArray(files) || files instanceof FileList) {
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  } else {
    formData.append('images', files);
  }

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al subir fotos');
  return data;
}

export async function setFeaturedFurniture(id, token) {
  const res = await fetch(`${API_URL}/featured`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ featured_id: id })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar destacado');
  return data;
}

export async function uploadImage(file, token) {
  return uploadImages([file], token);
}
