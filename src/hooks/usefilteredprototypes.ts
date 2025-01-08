import { useState, useMemo } from 'react';
import { usePrototypes } from './usePrototypes';
import type { Prototype } from '../types/prototype';

export function useFilteredPrototypes() {
  const { prototypes, loading, error, refreshPrototypes } = usePrototypes();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrototypes = useMemo(() => {
    return prototypes.filter((prototype: Prototype) => {
      const matchesCategory = selectedCategory === 'all' || prototype.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        prototype.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prototype.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prototype.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [prototypes, selectedCategory, searchQuery]);

  return {
    prototypes: filteredPrototypes,
    loading,
    error,
    refreshPrototypes,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  };
}