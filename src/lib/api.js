"use client";

import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export async function predict(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function compare(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/compare', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getMetrics() {
  const { data } = await api.get('/metrics');
  return data;
}
