import React, { useState } from 'react';
import { BackButton } from './BackButton';
import { PrototypeActions } from './PrototypeActions';
import { PrototypeHeader } from './PrototypeHeader';
import { PrototypeButtons } from './PrototypeButtons';
import { PrototypeContent } from './PrototypeContent';
import { PurchasedPrototypeContent } from './PurchasedPrototypeContent';
import { EditPrototypeModal } from '../prototypes/EditPrototypeModal';
import { usePrototypes } from '../../hooks/usePrototypes';
import { usePrototypePurchase } from '../../hooks/usePrototypePurchase';
import type { Prototype } from '../../types/prototype';

interface PrototypeDetailProps {
  prototype: Prototype;
  onBack: () => void;
}

export function PrototypeDetail({ prototype: initialPrototype, onBack }: PrototypeDetailProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { refreshPrototypes } = usePrototypes();
  const [prototype, setPrototype] = useState(initialPrototype);
  const { hasAccess, refreshAccess } = usePrototypePurchase(prototype.id);

  const handleEditSuccess = async () => {
    const { data: updatedPrototypes } = await refreshPrototypes();
    const updatedPrototype = updatedPrototypes.find(p => p.id === prototype.id);
    if (updatedPrototype) {
      setPrototype(updatedPrototype);
    }
    setIsEditModalOpen(false);
  };

  const handlePreviewClick = () => {
    if (prototype.preview_url) {
      window.open(prototype.preview_url, '_blank');
    }
  };

  const handlePurchaseSuccess = () => {
    refreshAccess();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton onClick={onBack} />
      
      <PrototypeActions
        prototype={prototype}
        onEdit={() => setIsEditModalOpen(true)}
        onDeleted={onBack}
      />

      <div className="mb-8">
        <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={prototype.image}
            alt={prototype.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <PrototypeHeader prototype={prototype} />
      
      <PrototypeButtons 
        prototype={prototype}
        onPreviewClick={handlePreviewClick}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
      
      {hasAccess && <PurchasedPrototypeContent prototype={prototype} />}
      
      <PrototypeContent prototype={prototype} />

      <EditPrototypeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        prototype={prototype}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}