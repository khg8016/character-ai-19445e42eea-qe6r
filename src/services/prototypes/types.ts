export interface PrototypeInput {
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  features: string[];
  requirements: string[];
  getting_started: string[];
}

export interface CreatePrototypeResponse {
  prototype: any;
  error: Error | null;
}