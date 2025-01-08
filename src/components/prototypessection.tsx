import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { PrototypeCategories } from './PrototypeCategories';
import { PrototypeGrid } from './PrototypeGrid';
import { PrototypeDetail } from './PrototypeDetail/PrototypeDetail';
import { useFilteredPrototypes } from '../hooks/useFilteredPrototypes';

export function PrototypesSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    prototypes,
    loading,
    error,
    refreshPrototypes,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useFilteredPrototypes();

  const handleBack = () => {
    navigate('/prototypes');
  };

  const currentPrototype = id 
    ? prototypes.find(p => p.id === id)
    : null;

  if (id && currentPrototype) {
    return (
      <PrototypeDetail
        prototype={currentPrototype}
        onBack={handleBack}
      />
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      <PrototypeCategories
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <PrototypeGrid 
        prototypes={prototypes}
        loading={loading}
        error={error}
        onPrototypeSelect={(id) => navigate(`/prototypes/${id}`)}
      />
    </section>
  );
}