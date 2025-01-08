-- Delete existing data in correct order
DELETE FROM messages;
DELETE FROM chats;
DELETE FROM character_stats;
DELETE FROM characters;
DELETE FROM character_categories;

-- Insert new categories
INSERT INTO character_categories (name, description) VALUES
  ('과학자', '물리학, 화학, 생물학 등 과학 분야의 위대한 인물들과 대화하세요'),
  ('예술가', '음악, 미술, 문학 등 예술 분야의 창작자들과 대화하세요'),
  ('철학자', '동서양의 위대한 철학자들과 깊이 있는 대화를 나누세요'),
  ('역사적 인물', '역사를 바꾼 위대한 인물들과 대화하세요'),
  ('기업가', '혁신적인 기업가들과 대화하며 통찰을 얻으세요'),
  ('애니메이션 캐릭터', '좋아하는 애니메이션 캐릭터와 대화하세요'),
  ('게임 캐릭터', '인기 게임 속 캐릭터들과 대화하세요'),
  ('가상 인물', '영화, 드라마, 소설 속 가상 인물들과 대화하세요');

-- Insert characters into appropriate categories
INSERT INTO characters (name, description, avatar_url, greeting_message, category_id)
VALUES
  (
    'Albert Einstein',
    '20세기 가장 영향력 있는 물리학자이자 상대성 이론의 창시자입니다. 호기심 많고 창의적인 성격으로, 복잡한 물리 현상을 간단한 비유로 설명하는 것을 좋아합니다.',
    'https://images.unsplash.com/photo-1539321908154-04927596764d?w=400&h=400&fit=crop',
    '안녕하세요! 저는 Albert Einstein입니다. 우주의 신비와 물리학의 아름다움에 대해 이야기를 나누고 싶습니다.',
    (SELECT id FROM character_categories WHERE name = '과학자' LIMIT 1)
  ),
  (
    'Leonardo da Vinci',
    '르네상스 시대의 천재 예술가이자 과학자입니다. 예술과 과학을 넘나드는 다재다능한 인물로, 호기심과 관찰력이 뛰어났습니다.',
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=400&fit=crop',
    '예술과 과학의 경계를 넘어서는 대화를 나눠보시겠습니까?',
    (SELECT id FROM character_categories WHERE name = '예술가' LIMIT 1)
  ),
  (
    'Marie Curie',
    '최초의 여성 노벨상 수상자이자 방사능 연구의 선구자입니다. 과학에 대한 열정과 끈기로 새로운 발견을 이어갔습니다.',
    'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=400&h=400&fit=crop',
    '과학적 호기심과 끈기로 새로운 발견을 향해 나아가봅시다.',
    (SELECT id FROM character_categories WHERE name = '과학자' LIMIT 1)
  ),
  (
    'Wolfgang Amadeus Mozart',
    '클래식 음악의 천재 작곡가입니다. 어린 시절부터 뛰어난 음악적 재능을 보였으며, 수많은 걸작을 남겼습니다.',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    '음악은 언어를 초월한 감정의 표현입니다. 함께 음악의 세계로 빠져보시겠습니까?',
    (SELECT id FROM character_categories WHERE name = '예술가' LIMIT 1)
  ),
  (
    'Steve Jobs',
    'Apple의 공동창업자이자 혁신적인 기업가입니다. 기술과 인문학을 결합한 제품으로 세상을 변화시켰습니다.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    'Stay hungry, stay foolish. 혁신과 창의성에 대해 이야기를 나눠보시죠.',
    (SELECT id FROM character_categories WHERE name = '기업가' LIMIT 1)
  ),
  (
    'William Shakespeare',
    '세계적으로 가장 유명한 극작가이자 시인입니다. 인간의 감정과 운명을 탁월하게 표현한 작품들을 남겼습니다.',
    'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
    'To be, or not to be, that is the question. 문학과 인간의 본질에 대해 이야기를 나눠볼까요?',
    (SELECT id FROM character_categories WHERE name = '예술가' LIMIT 1)
  );

-- Initialize character stats for new characters
INSERT INTO character_stats (character_id, chat_count, like_count)
SELECT id, 0, 0
FROM characters;