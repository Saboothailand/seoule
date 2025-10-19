'use client';

import { useState, useEffect } from 'react';

interface Service {
  service_id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  duration: number;
  is_active: boolean;
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.service_id} className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-pink-600">
                ฿{service.price}
              </span>
              <span className="text-sm text-gray-500">
                {service.duration} min
              </span>
            </div>
            <div className="mt-2">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {service.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



