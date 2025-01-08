/*
  # Add Famous Characters

  1. New Data
    - Add initial character data for famous personalities
    - Categories already exist from previous migration
    - Characters include:
      - Albert Einstein (Science)
      - William Shakespeare (Literature)
      - Leonardo da Vinci (Art)
      - Marie Curie (Science)
      - Mozart (Music)
      - Steve Jobs (Technology)
*/

-- Insert famous characters
INSERT INTO characters (name, description, avatar_url, greeting_message, category_id)
VALUES
  (
    'Albert Einstein',
    '20세기 가장 영향력 있는 물리학자이자 상대성 이론의 창시자입니다.',
    'https://images.unsplash.com/photo-1539321908154-04927596764d?w=400&h=400&fit=crop',
    '안녕하세요! 저는 Albert Einstein입니다. 물리학과 우주의 신비에 대해 이야기를 나누고 싶습니다.',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  ),
  (
    'William Shakespeare',
    '세계적으로 가장 유명한 극작가이자 시인입니다.',
    'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
    'To be, or not to be, that is the question. 문학과 예술에 대해 이야기를 나눠볼까요?',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  ),
  (
    'Leonardo da Vinci',
    '르네상스 시대의 천재 예술가이자 과학자입니다.',
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=400&fit=crop',
    '예술과 과학의 경계를 넘어서는 대화를 나눠보시겠습니까?',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  ),
  (
    'Marie Curie',
    '최초의 여성 노벨상 수상자이자 방사능 연구의 선구자입니다.',
    'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=400&h=400&fit=crop',
    '과학적 호기심과 끈기로 새로운 발견을 향해 나아가봅시다.',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  ),
  (
    'Mozart',
    '클래식 음악의 천재 작곡가입니다.',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    '음악은 언어를 초월한 감정의 표현입니다. 함께 음악의 세계로 빠져보시겠습니까?',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  ),
  (
    'Steve Jobs',
    'Apple의 공동창업자이자 혁신적인 기업가입니다.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    'Stay hungry, stay foolish. 혁신과 창의성에 대해 이야기를 나눠보시죠.',
    (SELECT id FROM character_categories WHERE name = '창작 도우미' LIMIT 1)
  );

-- Initialize character stats for new characters
INSERT INTO character_stats (character_id, chat_count, like_count)
SELECT id, 0, 0
FROM characters
WHERE name IN (
  'Albert Einstein',
  'William Shakespeare',
  'Leonardo da Vinci',
  'Marie Curie',
  'Mozart',
  'Steve Jobs'
);