export interface Prototype {
  id: string;
  title: string;
  description: string;
  image: string;
  preview_url?: string;
  github_url?: string;
  source_code_url?: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  features: string[];
  requirements: string[];
  gettingStarted: string[];
  creditPrice: number;
}

export interface PrototypeInput {
  title: string;
  description: string;
  image_url: string;
  preview_url?: string;
  source_code_url?: string;
  github_url?: string;
  category: string;
  tags: string[];
  features: string[];
  requirements: string[];
  getting_started: string[];
  credit_price: number;
}