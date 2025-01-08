/*
  # Insert sample data
  
  1. Changes
    - Create default admin profile
    - Insert sample prototypes with features, requirements, and getting started steps
  
  2. Data Added
    - Admin profile for sample data
    - 30 AI-related prototypes
    - Standard features, requirements, and getting started steps for each prototype
*/

-- Create default admin profile if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'admin@sprint.dev',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000'
);

-- Ensure admin profile exists
INSERT INTO profiles (
  id,
  display_id,
  full_name,
  user_level,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin',
  'System Admin',
  'Admin',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample prototypes
INSERT INTO prototypes (id, title, description, image_url, author_id, tags, created_at)
SELECT 
  gen_random_uuid(),
  titles.title,
  descriptions.description,
  images.url,
  '00000000-0000-0000-0000-000000000000', -- Use admin profile as author
  tags.tag_array,
  NOW() - (random() * interval '60 days') -- Random date within last 60 days
FROM (
  VALUES
    ('AI Image Generator Pro', 'Professional-grade image generation tool powered by stable diffusion'),
    ('ChatBot Builder Suite', 'No-code platform for building custom AI chatbots'),
    ('Voice Recognition API', 'Enterprise-ready speech-to-text solution'),
    ('Sentiment Analysis Tool', 'Real-time sentiment analysis for customer feedback'),
    ('AI Code Assistant', 'Intelligent code completion and suggestion system'),
    ('Neural Network Designer', 'Visual tool for designing and training neural networks'),
    ('Data Cleaning Pipeline', 'Automated data preprocessing and cleaning solution'),
    ('Text Summarizer API', 'Advanced text summarization service'),
    ('Object Detection Kit', 'Real-time object detection for video streams'),
    ('AI Translation Engine', 'Neural machine translation for 100+ languages'),
    ('Recommendation Engine', 'Personalized recommendation system for e-commerce'),
    ('Face Recognition SDK', 'Enterprise face recognition and verification'),
    ('AI Content Generator', 'GPT-powered content creation assistant'),
    ('Time Series Predictor', 'AI-powered forecasting for business metrics'),
    ('Document Parser Pro', 'Intelligent document parsing and data extraction'),
    ('Speech Synthesis API', 'Natural text-to-speech conversion service'),
    ('AI Video Editor', 'Automated video editing and enhancement'),
    ('Knowledge Graph Builder', 'Tool for creating and managing knowledge graphs'),
    ('Anomaly Detection System', 'Real-time anomaly detection for IoT data'),
    ('AI Testing Framework', 'Automated testing suite for AI models'),
    ('Language Model Trainer', 'Custom language model training platform'),
    ('AI Search Engine', 'Semantic search engine with natural language understanding'),
    ('Computer Vision Suite', 'Comprehensive computer vision toolkit'),
    ('AI Model Marketplace', 'Platform for sharing and monetizing AI models'),
    ('Data Labeling Tool', 'Collaborative data annotation platform'),
    ('AI Deployment Manager', 'MLOps tool for model deployment and monitoring'),
    ('AI Ethics Scanner', 'Tool for detecting bias in AI models'),
    ('AI Performance Monitor', 'Real-time monitoring for AI systems'),
    ('AI Security Suite', 'Security testing tools for AI models'),
    ('AI Documentation Gen', 'Automated documentation generator for AI projects')
) AS titles(title)
CROSS JOIN LATERAL (
  VALUES (
    CASE titles.title
      WHEN 'AI Image Generator Pro' THEN 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
      WHEN 'ChatBot Builder Suite' THEN 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a'
      WHEN 'Voice Recognition API' THEN 'https://images.unsplash.com/photo-1589254065878-42c9da997008'
      ELSE 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485'
    END
  )
) AS images(url)
CROSS JOIN LATERAL (
  VALUES (
    CASE titles.title
      WHEN 'AI Image Generator Pro' THEN ARRAY['ai', 'image-generation', 'stable-diffusion']
      WHEN 'ChatBot Builder Suite' THEN ARRAY['ai', 'chatbot', 'no-code']
      WHEN 'Voice Recognition API' THEN ARRAY['ai', 'speech', 'api']
      ELSE ARRAY['ai', 'machine-learning']
    END
  )
) AS tags(tag_array)
CROSS JOIN LATERAL (
  VALUES (
    CASE titles.title
      WHEN 'AI Image Generator Pro' THEN 'State-of-the-art image generation using the latest stable diffusion models. Create stunning visuals with simple text prompts.'
      WHEN 'ChatBot Builder Suite' THEN 'Build sophisticated chatbots without coding. Includes visual flow designer, NLP integration, and multi-platform deployment.'
      WHEN 'Voice Recognition API' THEN 'Enterprise-grade speech recognition with support for 50+ languages. Includes noise reduction and speaker diarization.'
      ELSE 'Advanced AI solution powered by state-of-the-art machine learning models.'
    END
  )
) AS descriptions(description);

-- Insert sample features
INSERT INTO prototype_features (prototype_id, feature)
SELECT 
  p.id,
  feature
FROM prototypes p
CROSS JOIN LATERAL (
  VALUES
    ('Advanced AI algorithms'),
    ('Real-time processing'),
    ('API integration'),
    ('Custom model training'),
    ('Performance monitoring')
) AS features(feature);

-- Insert sample requirements
INSERT INTO prototype_requirements (prototype_id, requirement)
SELECT 
  p.id,
  requirement
FROM prototypes p
CROSS JOIN LATERAL (
  VALUES
    ('Node.js 16+'),
    ('8GB RAM minimum'),
    ('GPU for training'),
    ('API key'),
    ('Docker support')
) AS requirements(requirement);

-- Insert sample getting started steps
INSERT INTO prototype_getting_started (prototype_id, step, order_index)
SELECT 
  p.id,
  step,
  step_index
FROM prototypes p
CROSS JOIN LATERAL (
  VALUES
    ('Install dependencies', 1),
    ('Configure API keys', 2),
    ('Initialize the project', 3),
    ('Run sample code', 4),
    ('Deploy to production', 5)
) AS steps(step, step_index);