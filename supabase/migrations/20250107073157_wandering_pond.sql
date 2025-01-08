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
INSERT INTO prototypes (id, title, description, image_url, author_id, category, tags, created_at)
SELECT 
  gen_random_uuid(),
  title,
  description,
  image_url,
  '00000000-0000-0000-0000-000000000000',
  category,
  tags,
  NOW() - (random() * interval '30 days')
FROM (
  VALUES
    (
      'AI Chat Interface',
      'Modern chat interface with AI-powered responses and real-time streaming',
      'https://images.unsplash.com/photo-1587560699334-cc4ff634909a',
      'frameworks',
      ARRAY['react', 'typescript', 'ai', 'chat']
    ),
    (
      'Invoice Generator',
      'Professional invoice generation system with customizable templates',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
      'business',
      ARRAY['business', 'finance', 'pdf', 'templates']
    ),
    (
      'Task Management Dashboard',
      'Kanban-style task management with analytics and team collaboration',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      'productivity',
      ARRAY['dashboard', 'tasks', 'collaboration']
    ),
    (
      'E-commerce Starter',
      'Full-featured e-commerce template with cart and checkout flow',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      'ecommerce',
      ARRAY['shop', 'payments', 'products']
    ),
    (
      'Learning Management System',
      'Complete LMS with course creation and student progress tracking',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
      'education',
      ARRAY['education', 'courses', 'learning']
    ),
    (
      'Game Development Kit',
      '2D game development starter with physics and sprite animation',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420',
      'entertainment',
      ARRAY['games', 'animation', 'physics']
    ),
    (
      'Social Media Feed',
      'Infinite-scroll social feed with real-time updates and interactions',
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1',
      'social',
      ARRAY['social', 'feed', 'realtime']
    ),
    (
      'AI Image Generator',
      'Text-to-image generation using stable diffusion models',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      'ai-ml',
      ARRAY['ai', 'images', 'generation']
    ),
    (
      'Analytics Dashboard',
      'Beautiful analytics dashboard with charts and data visualization',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      'dashboards',
      ARRAY['analytics', 'charts', 'dashboard']
    ),
    (
      'Design System',
      'Complete design system with components and theme customization',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      'creative',
      ARRAY['design', 'components', 'theme']
    ),
    (
      'File Manager',
      'Modern file management system with drag-and-drop and previews',
      'https://images.unsplash.com/photo-1544396821-4dd40b938ad3',
      'utilities',
      ARRAY['files', 'upload', 'storage']
    ),
    (
      'Authentication System',
      'Secure authentication with social login and password recovery',
      'https://images.unsplash.com/photo-1633265486064-086b219458ec',
      'frameworks',
      ARRAY['auth', 'security', 'users']
    ),
    (
      'Calendar App',
      'Interactive calendar with event management and scheduling',
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
      'productivity',
      ARRAY['calendar', 'events', 'scheduling']
    ),
    (
      'Video Conference',
      'Real-time video conferencing with screen sharing and chat',
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e',
      'business',
      ARRAY['video', 'meetings', 'collaboration']
    ),
    (
      'Music Player',
      'Modern music player with playlist management and visualizations',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      'entertainment',
      ARRAY['music', 'audio', 'player']
    ),
    (
      'AI Code Generator',
      'Code generation and completion using machine learning',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
      'ai-ml',
      ARRAY['ai', 'code', 'generation']
    ),
    (
      'Blog Platform',
      'Full-featured blog platform with markdown support and SEO',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
      'frameworks',
      ARRAY['blog', 'markdown', 'content']
    ),
    (
      'Project Management',
      'Complete project management with Gantt charts and reporting',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      'business',
      ARRAY['projects', 'management', 'planning']
    ),
    (
      'Weather Dashboard',
      'Weather visualization with forecasts and interactive maps',
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
      'dashboards',
      ARRAY['weather', 'maps', 'forecast']
    ),
    (
      'Form Builder',
      'Drag-and-drop form builder with validation and submissions',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      'utilities',
      ARRAY['forms', 'builder', 'validation']
    )
) AS t(title, description, image_url, category, tags);

-- Insert category-specific features
INSERT INTO prototype_features (prototype_id, feature)
SELECT 
  p.id,
  f.feature
FROM prototypes p
CROSS JOIN LATERAL (
  SELECT unnest(CASE p.category
    WHEN 'frameworks' THEN ARRAY[
      'TypeScript support',
      'Component library',
      'State management',
      'Routing system',
      'API integration'
    ]
    WHEN 'business' THEN ARRAY[
      'User management',
      'Role-based access',
      'Report generation',
      'Data export',
      'Analytics dashboard'
    ]
    WHEN 'productivity' THEN ARRAY[
      'Task tracking',
      'Progress monitoring',
      'Team collaboration',
      'File sharing',
      'Calendar integration'
    ]
    ELSE ARRAY[
      'Responsive design',
      'Dark mode support',
      'Performance optimized',
      'API documentation',
      'Easy customization'
    ]
  END) AS feature
) AS f;

-- Insert requirements based on category
INSERT INTO prototype_requirements (prototype_id, requirement)
SELECT 
  p.id,
  r.requirement
FROM prototypes p
CROSS JOIN LATERAL (
  SELECT unnest(CASE p.category
    WHEN 'ai-ml' THEN ARRAY[
      'GPU for training',
      '16GB RAM minimum',
      'CUDA support',
      'Python 3.8+',
      'API key'
    ]
    WHEN 'frameworks' THEN ARRAY[
      'Node.js 16+',
      'npm or yarn',
      'Modern browser',
      'VS Code (recommended)',
      'Git'
    ]
    ELSE ARRAY[
      'Node.js 14+',
      '4GB RAM minimum',
      'Modern browser',
      'npm or yarn',
      'Internet connection'
    ]
  END) AS requirement
) AS r;

-- Insert getting started steps
INSERT INTO prototype_getting_started (prototype_id, step, order_index)
SELECT 
  p.id,
  s.step,
  s.step_index
FROM prototypes p
CROSS JOIN LATERAL (
  VALUES
    ('Clone the repository', 1),
    ('Install dependencies', 2),
    ('Configure environment', 3),
    ('Start development server', 4),
    ('Begin customization', 5)
) AS s(step, step_index);