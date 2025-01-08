import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPrototypes } from '../../hooks/useMyPrototypes';
import { Eye, Users, Calendar, Plus } from 'lucide-react';
import { PrototypeForm } from '../prototypes/PrototypeForm';
import { Modal } from '../ui/Modal';
import { usePrototypeManagement } from '../../hooks/usePrototypeManagement';
import type { PrototypeInput } from '../../types/prototype';
import toast from 'react-hot-toast';

export function MyPrototypes() {
  const navigate = useNavigate();
  const { prototypes, loading, refreshPrototypes } = useMyPrototypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading: submitting, createPrototype } = usePrototypeManagement();

  const handleSubmit = async (data: PrototypeInput) => {
    try {
      // Validate required fields
      if (!data.title || !data.description || !data.image_url) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { prototype, error } = await createPrototype(data);
      
      if (error) {
        toast.error(error.message || 'Failed to create prototype');
        return;
      }

      toast.success('Prototype created successfully');
      setIsModalOpen(false);
      await refreshPrototypes();
    } catch (error: any) {
      console.error('Error creating prototype:', error);
      toast.error(error.message || 'Failed to create prototype');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  if (prototypes.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          등록한 프로토타입이 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          새로운 프로토타입을 등록해보세요.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Prototype
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          내 프로토타입
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Prototype
        </button>
      </div>
      
      <div className="space-y-4">
        {prototypes.map(prototype => (
          <div 
            key={prototype.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={prototype.image}
                alt={prototype.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {prototype.title}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4 mr-1" />
                    {prototype.views || 0} views
                  </span>
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    {prototype.purchases || 0} purchases
                  </span>
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(prototype.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/prototypes/${prototype.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors text-sm font-medium"
            >
              상세보기
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Prototype"
      >
        <PrototypeForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}