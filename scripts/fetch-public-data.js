const fs = require('fs');
const path = require('path');

const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchPublicData() {
  const url = 'https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON';
  // 일부 공공데이터 API는 serviceKey 쿼리파라미터를 요구하기도 하나, Infuser 방식 지원 시 아래 헤더 사용
  // 안전하게 쿼리파라미터도 함께 붙여서 요청합니다.
  const queryUrl = `${url}&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY || '')}`;
  
  const response = await fetch(queryUrl, {
    headers: {
      'Authorization': `Infuser ${PUBLIC_DATA_API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Public Data API Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data || [];
}

function filterData(dataArray) {
  const filterByKeyword = (keyword) => {
    return dataArray.filter(item => {
      const searchString = `
        ${item['서비스명'] || ''} 
        ${item['서비스목적요약'] || ''} 
        ${item['지원대상'] || ''} 
        ${item['소관기관명'] || ''}
      `.toLowerCase();
      return searchString.includes(keyword.toLowerCase());
    });
  };

  const sadangMatch = filterByKeyword('사당');
  if (sadangMatch.length > 0) return sadangMatch;

  const dongjakMatch = filterByKeyword('동작');
  if (dongjakMatch.length > 0) return dongjakMatch;

  return dataArray;
}

async function generateGeminiContent(dataItem) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(dataItem)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status}`);
  }

  const jsonResponse = await response.json();
  const textVal = jsonResponse.candidates[0].content.parts[0].text;
  
  let cleanJson = textVal.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

async function main() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    let localData = { events: [], benefits: [] };
    
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      localData = JSON.parse(fileContent);
    }
    
    const publicDataRaw = await fetchPublicData();
    if (publicDataRaw.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    const filteredData = filterData(publicDataRaw);
    
    let newItemRaw = null;
    const allExistingNames = [...localData.events, ...localData.benefits].map(item => item.name || item.title);
    
    for (const item of filteredData) {
      const itemName = item['서비스명'];
      if (!allExistingNames.includes(itemName)) {
        newItemRaw = item;
        break;
      }
    }

    if (!newItemRaw) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    const processedItem = await generateGeminiContent(newItemRaw);
    
    const allIds = [...localData.events, ...localData.benefits].map(item => item.id);
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    processedItem.id = maxId + 1;
    
    if (processedItem.name && !processedItem.title) {
        processedItem.title = processedItem.name;
    }

    if (processedItem.category === '행사') {
      localData.events.push(processedItem);
    } else {
      localData.benefits.push(processedItem);
    }

    fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
    console.log('새로운 데이터 추가 완료');

  } catch (error) {
    console.error('에러 발생:', error.message);
  }
}

main();
