import axios from 'axios';
import { FitnessPlan, LoginResponse, User } from '../types';

const API_URL = 'http://localhost:3001/api'; // Make sure this matches your backend port

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Fetch Fitness Plans API (GET)
export const getFitnessPlans = async (): Promise<FitnessPlan[]> => {
  const response = await apiClient.get('/fitness-plans');
  return response.data;
};

// API call for User Registration (POST /api/user/register)
export const registerUser = async (username: string, password: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/user/register', { username, password });
  return response.data;
};


// 4. Mock Login (POST)
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post('/user/login', { username, password });
  return response.data;
};

// 5. Get Users for Assign Plan Form (GET)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/user');
  return response.data;
};

export const getAllUsersWithUserRole = async (): Promise<User[]> => {
  const response = await apiClient.get('/user/user', { params: { role: 'user' } });
  return response.data;
};


export const assignPlanToUser = async (userId: number, planId: number): Promise<{ message: string }> => {
  console.log(`Simulating assignment: Assigning Plan ID ${planId} to User ID ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { message: 'Plan assigned successfully!' };
};