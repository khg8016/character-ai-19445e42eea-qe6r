import React, { useState, useEffect } from 'react';
import { MultilineInput } from './MultilineInput';
import { ImageUpload } from './ImageUpload';
import { SourceCodeUpload } from './SourceCodeUpload';
import { CATEGORIES } from '../../types/category';
import type { Prototype, PrototypeInput } from '../../types/prototype';

interface PrototypeFormProps {
  prototype?: Prototype;
  onSubmit: (data: PrototypeInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function PrototypeForm({ prototype, onSubmit, onCancel, loading }: PrototypeFormProps) {
  const [formData, setFormData] = useState<PrototypeInput>({
    title: '',
    description: '',
    image_url: '',
    preview_url: '',
    source_code_url: '',
    category: 'all',
    tags: [],
    features: [],
    requirements: [],
    getting_started: [],
    credit_price: 1
  });

  const [rawInputs, setRawInputs] = useState({
    features: '',
    requirements: '',
    getting_started: '',
    tags: ''
  });

  useEffect(() => {
    if (prototype) {
      setFormData({
        title: prototype.title,
        description: prototype.description,
        image_url: prototype.image,
        preview_url: prototype.preview_url || '',
        source_code_url: prototype.source_code_url || '',
        category: prototype.category || 'all',
        tags: prototype.tags,
        features: prototype.features,
        requirements: prototype.requirements,
        getting_started: prototype.gettingStarted,
        credit_price: prototype.creditPrice
      });

      setRawInputs({
        features: prototype.features.join('\n'),
        requirements: prototype.requirements.join('\n'),
        getting_started: prototype.gettingStarted.join('\n'),
        tags: prototype.tags.join(', ')
      });
    }
  }, [prototype]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const processedData: PrototypeInput = {
      ...formData,
      tags: rawInputs.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      features: rawInputs.features.split('\n').filter(line => line.trim()),
      requirements: rawInputs.requirements.split('\n').filter(line => line.trim()),
      getting_started: rawInputs.getting_started.split('\n').filter(line => line.trim())
    };

    await onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUpload
        currentImageUrl={formData.image_url}
        onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preview URL
        </label>
        <input
          type="url"
          value={formData.preview_url}
          onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
          placeholder="https://example.com"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional: Add a URL where users can preview the prototype
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        >
          {CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={rawInputs.tags}
          onChange={(e) => setRawInputs({ ...rawInputs, tags: e.target.value })}
          placeholder="react, typescript, dashboard"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Credit Price
        </label>
        <input
          type="number"
          min="1"
          value={formData.credit_price}
          onChange={(e) => setFormData({ ...formData, credit_price: parseInt(e.target.value) || 1 })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Set the price in credits (minimum 1 credit)
        </p>
      </div>

      <SourceCodeUpload
        currentUrl={formData.source_code_url}
        onUploadSuccess={(url) => setFormData({ ...formData, source_code_url: url })}
      />

      <MultilineInput
        label="Key Features (one per line)"
        value={rawInputs.features}
        onChange={(value) => setRawInputs({ ...rawInputs, features: value })}
        placeholder="Enter each feature on a new line"
      />

      <MultilineInput
        label="Requirements (one per line)"
        value={rawInputs.requirements}
        onChange={(value) => setRawInputs({ ...rawInputs, requirements: value })}
        placeholder="Enter each requirement on a new line"
      />

      <MultilineInput
        label="Getting Started Steps (one per line)"
        value={rawInputs.getting_started}
        onChange={(value) => setRawInputs({ ...rawInputs, getting_started: value })}
        placeholder="Enter each step on a new line"
      />

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                   hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                   hover:bg-blue-700 rounded-md disabled:opacity-50"
        >
          {loading ? (prototype ? 'Updating...' : 'Creating...') : (prototype ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}