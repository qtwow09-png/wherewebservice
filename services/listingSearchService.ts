// 로컬 매물 검색 서비스 (키워드 AND 매칭 기반)

interface Listing {
  구: string;
  동: string;
  단지명: string;
  매물유형: string;
  건물용도: string;
  거래방식: string;
  가격: string;
  가격유형: string;
  소재지: string;
  매물특징: string | null;
  '공급/전용면적': string;
  '해당층/총층': string;
  방향: string;
  확인일자: string | null;
  상세링크: string | null;
  매물번호: string;
  단지번호: string | null;
  수집일시: string;
  status: string;
  first_seen: string;
  last_seen: string;
}

let listingsCache: Listing[] | null = null;

// 매물 데이터 로드
async function loadListings(): Promise<Listing[]> {
  if (listingsCache) return listingsCache;

  try {
    const response = await fetch('/data/listings.json');
    listingsCache = await response.json();
    return listingsCache || [];
  } catch (error) {
    console.error('매물 데이터 로드 실패:', error);
    return [];
  }
}

// 가격 문자열을 숫자(억 단위)로 변환
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;

  const cleanStr = priceStr.replace(/,/g, '').replace(/\s/g, '');

  // 월세 format: "보증금/월세" - 보증금 부분만 반환
  if (cleanStr.includes('/')) {
    const depositPart = cleanStr.split('/')[0];
    if (depositPart.includes('억')) {
      const parts = depositPart.split('억');
      const billions = parseFloat(parts[0]) || 0;
      const millions = parseFloat(parts[1]) || 0;
      return billions + (millions / 10000);
    } else {
      const value = parseFloat(depositPart) || 0;
      return value / 10000;
    }
  }

  // 매매/전세 format
  if (cleanStr.includes('억')) {
    const parts = cleanStr.split('억');
    const billions = parseFloat(parts[0]) || 0;
    const millions = parseFloat(parts[1]) || 0;
    return billions + (millions / 10000);
  } else {
    const value = parseFloat(cleanStr) || 0;
    return value / 10000;
  }
}

// 단지명에서 단지 이름만 추출
function extractComplexName(danjiName: string): string {
  if (!danjiName) return '';

  // 패턴: "단지명 NNN동매매/전세/월세..." → "단지명" 추출
  const match = danjiName.match(/^(.+?)\s*\d+동(?:매매|전세|월세)/);
  if (match) {
    return match[1].trim();
  }

  // fallback: 매매/전세/월세 앞부분 추출
  const fallbackMatch = danjiName.match(/^(.+?)\s*(?:매매|전세|월세)/);
  if (fallbackMatch) {
    return fallbackMatch[1].trim();
  }

  return danjiName.slice(0, 20);
}

// 검색 쿼리 파싱
interface SearchQuery {
  keywords: string[];
  minPrice: number | null;
  maxPrice: number | null;
  buildingType: string | null;
  transactionType: string | null;
}

function parseSearchQuery(query: string): SearchQuery {
  const result: SearchQuery = {
    keywords: [],
    minPrice: null,
    maxPrice: null,
    buildingType: null,
    transactionType: null,
  };

  let workingQuery = query;

  // 1. 가격 추출 (추출 후 workingQuery에서 제거)
  const priceRangeMatch = workingQuery.match(/(\d+)억?\s*[~-]\s*(\d+)억/);
  if (priceRangeMatch) {
    result.minPrice = parseInt(priceRangeMatch[1]);
    result.maxPrice = parseInt(priceRangeMatch[2]);
    workingQuery = workingQuery.replace(priceRangeMatch[0], ' ');
  } else {
    const priceUnderMatch = workingQuery.match(/(\d+)억\s*(이하|미만)/);
    const priceOverMatch = workingQuery.match(/(\d+)억\s*(이상|초과)/);
    const priceRangeSuffixMatch = workingQuery.match(/(\d+)억\s*대/);

    if (priceUnderMatch) {
      result.maxPrice = parseInt(priceUnderMatch[1]);
      workingQuery = workingQuery.replace(priceUnderMatch[0], ' ');
    } else if (priceOverMatch) {
      result.minPrice = parseInt(priceOverMatch[1]);
      workingQuery = workingQuery.replace(priceOverMatch[0], ' ');
    } else if (priceRangeSuffixMatch) {
      const base = parseInt(priceRangeSuffixMatch[1]);
      result.minPrice = base;
      result.maxPrice = base + 9.99;
      workingQuery = workingQuery.replace(priceRangeSuffixMatch[0], ' ');
    }
  }

  // 2. 건물유형 추출
  const buildingTypeMap: [string[], string][] = [
    [['아파트'], '아파트'],
    [['오피스텔'], '오피스텔'],
    [['빌라', '연립', '다세대'], '빌라/연립'],
    [['원룸'], '원룸'],
    [['주택', '단독', '다가구'], '단독/다가구'],
  ];

  for (const [triggers, type] of buildingTypeMap) {
    for (const trigger of triggers) {
      if (workingQuery.includes(trigger)) {
        result.buildingType = type;
        workingQuery = workingQuery.replace(new RegExp(trigger, 'g'), ' ');
        break;
      }
    }
    if (result.buildingType) break;
  }

  // 3. 거래방식 추출
  if (workingQuery.includes('매매')) {
    result.transactionType = '매매';
    workingQuery = workingQuery.replace(/매매/g, ' ');
  } else if (workingQuery.includes('전세')) {
    result.transactionType = '전세';
    workingQuery = workingQuery.replace(/전세/g, ' ');
  } else if (workingQuery.includes('월세')) {
    result.transactionType = '월세';
    workingQuery = workingQuery.replace(/월세/g, ' ');
  }

  // 4. 불용어 제거
  const noiseWords = [
    '찾아줘', '찾아', '검색', '물건', '매물', '보여줘', '알려줘',
    '있나요', '있어', '주세요', '좀', '해줘', '구해줘',
    '싶어', '원하는', '근처', '부근', '주변', '추천',
  ];
  for (const noise of noiseWords) {
    workingQuery = workingQuery.replace(new RegExp(noise, 'g'), ' ');
  }

  // 5. 남은 토큰을 키워드로 추출
  const tokens = workingQuery.split(/\s+/).filter(t => t.length > 0);
  result.keywords = tokens;

  return result;
}

// 키워드가 매물의 주요 필드(구, 동, 단지명)에 매칭되는지 확인
// 소재지는 제외 (도로명에 의한 오매칭 방지: "역삼로" → "역삼" 오매칭 등)
function keywordMatchesListing(keyword: string, listing: Listing): boolean {
  // 구 매칭
  if (listing.구 && listing.구.includes(keyword)) return true;

  // 동 매칭 (동_방향 형식에서 기본 동명 추출: "역삼동_남동" → "역삼동")
  if (listing.동) {
    const dongBase = listing.동.split('_')[0];
    if (dongBase.includes(keyword)) return true;
  }

  // 단지명 매칭
  if (listing.단지명 && listing.단지명.includes(keyword)) return true;

  return false;
}

// 유사 검색용 가중치 점수 (구/동 > 단지명 > 소재지)
function getKeywordMatchScore(keyword: string, listing: Listing): number {
  let score = 0;

  // 구 매칭 (정확 10, 부분 8)
  if (listing.구) {
    if (listing.구 === keyword) score = Math.max(score, 10);
    else if (listing.구.includes(keyword)) score = Math.max(score, 8);
  }

  // 동 매칭 (정확 10, 부분 7)
  if (listing.동) {
    const dongBase = listing.동.split('_')[0];
    if (dongBase === keyword) score = Math.max(score, 10);
    else if (dongBase.includes(keyword)) score = Math.max(score, 7);
  }

  // 단지명 매칭 (5)
  if (listing.단지명 && listing.단지명.includes(keyword)) {
    score = Math.max(score, 5);
  }

  // 소재지 매칭 (1 - fallback only)
  if (listing.소재지 && listing.소재지.includes(keyword)) {
    score = Math.max(score, 1);
  }

  return score;
}

// 비키워드 필터 (가격, 건물유형, 거래방식)
function matchesNonKeywordFilters(listing: Listing, sq: SearchQuery): boolean {
  if (sq.minPrice !== null || sq.maxPrice !== null) {
    const price = parsePrice(listing.가격);
    if (price > 0) {
      if (sq.minPrice !== null && price < sq.minPrice) return false;
      if (sq.maxPrice !== null && price > sq.maxPrice) return false;
    }
  }
  if (sq.buildingType && !listing.건물용도?.includes(sq.buildingType)) return false;
  if (sq.transactionType && !listing.거래방식?.includes(sq.transactionType)) return false;
  return true;
}

// 매물 1건 포맷
function formatListing(listing: Listing, index: number): string {
  const cleanName = extractComplexName(listing.단지명);
  let line = `**${index + 1}. ${cleanName || '매물'}**\n`;
  line += `   위치: ${listing.소재지 || `${listing.구} ${listing.동}`}\n`;
  line += `   가격: ${listing.가격} (${listing.거래방식})\n`;
  line += `   면적: ${listing['공급/전용면적'] || '-'} | ${listing['해당층/총층'] || '-'} | ${listing.방향 || '-'}\n`;
  if (listing.매물특징) {
    line += `   특징: ${listing.매물특징.slice(0, 50)}${listing.매물특징.length > 50 ? '...' : ''}\n`;
  }
  line += '\n';
  return line;
}

// 유사매물 검색 (키워드 부분 매칭 + 매칭 점수 기반)
function findSimilarListings(
  listings: Listing[],
  searchQuery: SearchQuery,
): { similar: Listing[]; matchedKeywords: string[]; nearby: Listing[]; nearbyLocation: string } {
  const keywords = searchQuery.keywords;

  // 1. 각 매물의 키워드 매칭 점수 계산
  const scored: { listing: Listing; score: number; matched: string[] }[] = [];

  for (const listing of listings) {
    if (!matchesNonKeywordFilters(listing, searchQuery)) continue;

    let totalScore = 0;
    const matched: string[] = [];
    for (const k of keywords) {
      const kScore = getKeywordMatchScore(k, listing);
      if (kScore > 0) {
        totalScore += kScore;
        matched.push(k);
      }
    }
    if (matched.length > 0) {
      scored.push({ listing, score: totalScore, matched });
    }
  }

  // 점수 내림차순 정렬, 같은 점수면 가격 오름차순
  scored.sort((a, b) => b.score - a.score || parsePrice(a.listing.가격) - parsePrice(b.listing.가격));

  // 유사매물: 1개 이상 키워드 매칭 (최대 5건)
  const similar = scored.slice(0, 5).map(s => s.listing);
  const topMatched = scored.length > 0 ? scored[0].matched : [];

  // 2. 인근지역매물: 유사매물에서 가장 많이 등장하는 구/동 기준으로 같은 지역 매물
  let nearbyLocation = '';
  let nearby: Listing[] = [];

  // 유사매물에서 구 추출
  const guCount: Record<string, number> = {};
  for (const s of scored.slice(0, 10)) {
    const gu = s.listing.구;
    if (gu) guCount[gu] = (guCount[gu] || 0) + 1;
  }

  // 또는 키워드에서 구 직접 탐색
  if (Object.keys(guCount).length === 0) {
    for (const kw of keywords) {
      const matchGu = listings.find(l => l.구?.includes(kw));
      if (matchGu) {
        guCount[matchGu.구] = 1;
        break;
      }
    }
  }

  if (Object.keys(guCount).length > 0) {
    const topGu = Object.entries(guCount).sort((a, b) => b[1] - a[1])[0][0];
    nearbyLocation = topGu;

    // 같은 구에서 유사매물과 겹치지 않는 매물
    const similarIds = new Set(similar.map(l => l.매물번호));
    nearby = listings
      .filter(l =>
        l.구 === topGu &&
        !similarIds.has(l.매물번호) &&
        matchesNonKeywordFilters(l, searchQuery)
      )
      .sort((a, b) => parsePrice(a.가격) - parsePrice(b.가격))
      .slice(0, 5);
  }

  return { similar, matchedKeywords: topMatched, nearby, nearbyLocation };
}

// 매물 검색
export async function searchListings(query: string): Promise<string> {
  const listings = await loadListings();

  if (listings.length === 0) {
    return "매물 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.";
  }

  const searchQuery = parseSearchQuery(query);

  // 정확한 필터링 (AND 매칭 - 구/동/단지명 필드별 매칭)
  let filtered = listings.filter(listing => {
    if (searchQuery.keywords.length > 0) {
      if (!searchQuery.keywords.every(k => keywordMatchesListing(k, listing))) return false;
    }
    return matchesNonKeywordFilters(listing, searchQuery);
  });

  filtered.sort((a, b) => parsePrice(a.가격) - parsePrice(b.가격));

  // 검색 조건 요약
  const conditionParts: string[] = [];
  if (searchQuery.keywords.length > 0) conditionParts.push(`키워드: ${searchQuery.keywords.join(', ')}`);
  if (searchQuery.minPrice !== null || searchQuery.maxPrice !== null) {
    conditionParts.push(`가격: ${searchQuery.minPrice ?? ''}억 ~ ${searchQuery.maxPrice ?? ''}억`);
  }
  if (searchQuery.buildingType) conditionParts.push(`유형: ${searchQuery.buildingType}`);
  if (searchQuery.transactionType) conditionParts.push(`거래: ${searchQuery.transactionType}`);

  // 정확한 결과가 있으면 바로 반환
  if (filtered.length > 0) {
    const displayCount = Math.min(filtered.length, 10);
    const results = filtered.slice(0, displayCount);

    let response = `**"${query}" 검색 결과**\n`;
    response += `총 ${filtered.length.toLocaleString()}건의 매물을 찾았습니다.\n`;
    response += `(${conditionParts.join(' | ')})\n\n`;

    results.forEach((listing, index) => {
      response += formatListing(listing, index);
    });

    if (filtered.length > displayCount) {
      response += `\n...외 ${(filtered.length - displayCount).toLocaleString()}건의 매물이 더 있습니다.\n`;
      response += `더 구체적인 조건을 입력하시면 원하는 매물을 찾기 쉽습니다.`;
    }

    return response;
  }

  // 정확한 결과 없음 → 유사매물 & 인근지역매물 검색
  const { similar, matchedKeywords, nearby, nearbyLocation } = findSimilarListings(listings, searchQuery);

  let response = `**"${query}" 검색 결과**\n`;
  response += `정확히 일치하는 매물이 없습니다.\n`;
  response += `(${conditionParts.join(' | ')})\n\n`;

  if (similar.length === 0 && nearby.length === 0) {
    response += `조건에 맞는 유사 매물도 찾지 못했습니다.\n\n`;
    response += `**TIP:** 키워드를 줄이거나 조건을 변경해보세요.\n`;
    response += `예: "마곡 매매 아파트", "래미안 전세"`;
    return response;
  }

  // 유사매물 표시
  if (similar.length > 0) {
    response += `---\n`;
    response += `**유사매물** (${matchedKeywords.map(k => `"${k}"`).join(', ')} 포함)\n\n`;
    similar.forEach((listing, index) => {
      response += formatListing(listing, index);
    });
  }

  // 인근지역매물 표시
  if (nearby.length > 0) {
    response += `---\n`;
    response += `**인근지역매물** (${nearbyLocation} 지역)\n\n`;
    nearby.forEach((listing, index) => {
      response += formatListing(listing, index);
    });
  }

  response += `\n더 구체적인 조건이나 다른 키워드로 검색해보세요.`;

  return response;
}

// 메인 검색 함수 (AIAdvisor에서 호출)
export const handleUserQuery = async (message: string): Promise<string> => {
  // 인사말 처리
  if (/안녕|반가|처음|시작/.test(message)) {
    return `안녕하세요! **어디살래** 부동산 검색 서비스입니다.\n\n현재 서울 지역 **33,309건**의 매물을 보유하고 있습니다.\n\n**검색 예시:**\n- "강남구 10억대 아파트"\n- "마포구 전세 5억 이하"\n- "역삼동 매매 아파트"\n- "마곡 힐스테이트 매매"\n- "래미안 전세"\n\n원하시는 조건을 말씀해주세요!`;
  }

  // 도움말
  if (/도움|사용법|어떻게/.test(message)) {
    return `**어디살래 검색 사용법**\n\n**지역 검색:**\n- 구 단위: "강남구", "서초구", "마포구"\n- 동 단위: "역삼동", "논현동", "합정동"\n- 지역명: "마곡", "잠실", "판교"\n\n**단지명 검색:**\n- "래미안", "힐스테이트", "자이", "마곡보타닉"\n\n**가격 조건:**\n- "10억대" → 10억~19억\n- "5억 이하" → 최대 5억\n- "10억 이상" → 최소 10억\n- "5억~10억" → 5억에서 10억 사이\n\n**건물 유형:**\n아파트, 오피스텔, 빌라, 원룸, 단독주택\n\n**거래 방식:**\n매매, 전세, 월세\n\n**검색 TIP:**\n여러 키워드를 조합할 수 있습니다.\n예: "마곡 힐스테이트 매매 10억대"`;
  }

  // 일반 검색
  return await searchListings(message);
};
