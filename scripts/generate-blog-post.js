const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getLatestItem(dataPath) {
  if (!fs.existsSync(dataPath)) return null;
  const content = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(content);
  
  const allItems = [...(data.events || []), ...(data.benefits || [])];
  if (allItems.length === 0) return null;
  
  return allItems.reduce((latest, current) => {
    return (current.id > latest.id) ? current : latest;
  });
}

function checkAlreadyWritten(postsDir, itemName) {
  if (!fs.existsSync(postsDir)) return false;
  
  const files = fs.readdirSync(postsDir);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    if (content.includes(itemName)) {
      return true;
    }
  }
  return false;
}

async function generateBlogPost(item) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(item, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 클릭유도 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3, 태그4, 태그5]
---

(본문: 1200자 이상, 친근한 블로그 톤, 사람이 쓴 것 같은 글, 가독성 높은 띄어쓰기, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  return text;
}

async function main() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const latestItem = getLatestItem(dataPath);
    if (!latestItem) {
      console.log('데이터가 없습니다.');
      return;
    }

    const itemName = latestItem.name || latestItem.title;
    if (checkAlreadyWritten(postsDir, itemName)) {
      console.log('이미 작성된 글입니다');
      return;
    }

    const generatedText = await generateBlogPost(latestItem);

    const lines = generatedText.split('\n');
    let contentLines = [];
    let filename = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('```')) continue;
      
      if (line.startsWith('FILENAME:')) {
        filename = line.replace('FILENAME:', '').trim();
        filename = filename.replace(/\.md$/, '');
      } else {
        contentLines.push(lines[i]);
      }
    }

    const content = contentLines.join('\n').trim();

    if (!filename) {
      const today = new Date().toISOString().split('T')[0];
      filename = `${today}-new-post`;
    }

    const outPath = path.join(postsDir, `${filename}.md`);
    fs.writeFileSync(outPath, content, 'utf8');
    
    console.log('새로운 블로그 글 작성 완료:', outPath);

  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

main();
