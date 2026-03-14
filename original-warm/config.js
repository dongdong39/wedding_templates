/**
 * Original Warm Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 커튼 열림 애니메이션 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "신랑",
    father: "아버지",
    mother: "어머니",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "신부",
    father: "아버지",
    mother: "어머니",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2050-01-01",
    time: "13:11",
    venue: "예식장 이름",
    address: "예식장 주소",
    mapLinks: {
      kakao: "https://map.kakao.com/",
      naver: "https://map.naver.com/"
    }
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", bank: "OO은행", number: "000-000-000000" },
      { role: "아버지", bank: "OO은행", number: "000-00-000000" },
      { role: "어머니", bank: "OO은행", number: "000-00-000000" }
    ],
    bride: [
      { role: "신부", bank: "OO은행", number: "00000-0000-00" },
      { role: "아버지", bank: "OO은행", number: "000000-00-000000" },
      { role: "어머니", bank: "OO은행", number: "000-00-000000-0" }
    ]
  },

  // ── 공유 설정 ──
  meta: {
    title: "신랑 ♥ 신부 결혼합니다",
    description: "2050년 1월 1일, 소중한 분들을 초대합니다."
  }
};
