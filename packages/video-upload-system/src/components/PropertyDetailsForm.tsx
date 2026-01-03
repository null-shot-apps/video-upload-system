'use client';

import { useState } from 'react';
import { PropertyDetails, NIGERIAN_STATES, POWER_SUPPLY_OPTIONS, WATER_SOURCE_OPTIONS } from '@/types';

interface PropertyDetailsFormProps {
  onSubmit: (details: PropertyDetails) => void;
  onBack: () => void;
}

export default function PropertyDetailsForm({ onSubmit, onBack }: PropertyDetailsFormProps) {
  const [formData, setFormData] = useState<PropertyDetails>({
    state: '',
    city: '',
    area: '',
    annualRent: 0,
    agencyFee: 0,
    legalFee: 0,
    cautionFee: 0,
    powerSupply: '',
    waterSource: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PropertyDetails, string>>>({});

  const handleChange = (field: keyof PropertyDetails, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PropertyDetails, string>> = {};

    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (formData.annualRent <= 0) newErrors.annualRent = 'Annual rent must be greater than 0';
    if (formData.agencyFee < 0) newErrors.agencyFee = 'Agency fee cannot be negative';
    if (formData.legalFee < 0) newErrors.legalFee = 'Legal fee cannot be negative';
    if (formData.cautionFee < 0) newErrors.cautionFee = 'Caution fee cannot be negative';
    if (!formData.powerSupply) newErrors.powerSupply = 'Power supply is required';
    if (!formData.waterSource) newErrors.waterSource = 'Water source is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Location</h2>
        
        <div className="space-y-4">
          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.state ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g., Ikeja, Lekki, Victoria Island"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area/Neighborhood <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="e.g., Allen Avenue, Ajah, Surulere"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.area ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.area && <p className="text-sm text-red-600 mt-1">{errors.area}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing (NGN)</h2>
        
        <div className="space-y-4">
          {/* Annual Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.annualRent || ''}
              onChange={(e) => handleChange('annualRent', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.annualRent ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formData.annualRent > 0 && (
              <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.annualRent)}</p>
            )}
            {errors.annualRent && <p className="text-sm text-red-600 mt-1">{errors.annualRent}</p>}
          </div>

          {/* Agency Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agency Fee
            </label>
            <input
              type="number"
              value={formData.agencyFee || ''}
              onChange={(e) => handleChange('agencyFee', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.agencyFee ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formData.agencyFee > 0 && (
              <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.agencyFee)}</p>
            )}
            {errors.agencyFee && <p className="text-sm text-red-600 mt-1">{errors.agencyFee}</p>}
          </div>

          {/* Legal Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Fee
            </label>
            <input
              type="number"
              value={formData.legalFee || ''}
              onChange={(e) => handleChange('legalFee', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.legalFee ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formData.legalFee > 0 && (
              <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.legalFee)}</p>
            )}
            {errors.legalFee && <p className="text-sm text-red-600 mt-1">{errors.legalFee}</p>}
          </div>

          {/* Caution Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caution Fee (Security Deposit)
            </label>
            <input
              type="number"
              value={formData.cautionFee || ''}
              onChange={(e) => handleChange('cautionFee', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.cautionFee ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formData.cautionFee > 0 && (
              <p className="text-sm text-gray-600 mt-1">{formatCurrency(formData.cautionFee)}</p>
            )}
            {errors.cautionFee && <p className="text-sm text-red-600 mt-1">{errors.cautionFee}</p>}
          </div>

          {/* Total */}
          {(formData.annualRent + formData.agencyFee + formData.legalFee + formData.cautionFee) > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Move-in Cost:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(formData.annualRent + formData.agencyFee + formData.legalFee + formData.cautionFee)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Utilities</h2>
        
        <div className="space-y-4">
          {/* Power Supply */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Power Supply <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.powerSupply}
              onChange={(e) => handleChange('powerSupply', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.powerSupply ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Power Supply</option>
              {POWER_SUPPLY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.powerSupply && <p className="text-sm text-red-600 mt-1">{errors.powerSupply}</p>}
          </div>

          {/* Water Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Source <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.waterSource}
              onChange={(e) => handleChange('waterSource', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.waterSource ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Water Source</option>
              {WATER_SOURCE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.waterSource && <p className="text-sm text-red-600 mt-1">{errors.waterSource}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to Videos
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          Submit Property
        </button>
      </div>
    </form>
  );
}

