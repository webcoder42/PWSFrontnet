import { bookingServices } from '../../../utils/servicePricing';

export const steps = ['Service', 'Choose PSW', 'Date & Time', 'Review'];

export const services = bookingServices;

export const psws = [
  { id: 1, name: 'Sarah Johnson', role: 'Personal Support Worker', rating: 4.9, reviews: 127, rate: 28, seed: 'Sarah', preferred: true },
  { id: 2, name: 'Michael Chen', role: 'Personal Support Worker', rating: 4.8, reviews: 89, rate: 26, seed: 'Michael', preferred: true },
  { id: 3, name: 'Lisa Park', role: 'Personal Support Worker', rating: 4.7, reviews: 43, rate: 24, seed: 'Lisa', preferred: false },
];
