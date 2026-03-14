/**
 * Modern Minimal Wedding Invitation Configuration
 *
 * Edit the values below to customize your wedding invitation.
 * Image files should be placed in the corresponding images/ subfolders
 * using sequential filenames (1.jpg, 2.jpg, ...).
 * The code auto-detects images by trying sequential filenames.
 *
 * Image folder conventions:
 *   images/hero/1.jpg       - Main wedding photo (single file)
 *   images/story/1.jpg, ... - Story section photos (auto-detected)
 *   images/gallery/1.jpg, . - Gallery photos (auto-detected)
 *   images/location/1.jpg   - Venue/map image (single file)
 *   images/og/1.jpg         - Kakao share thumbnail (single file)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "신랑",
    nameEn: "GROOM",
    father: "아버지",
    mother: "어머니",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "신부",
    nameEn: "BRIDE",
    father: "아버지",
    mother: "어머니",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2025-01-01",
    time: "13:00",
    venue: "예식장 이름",
    hall: "3층 그랜드홀",
    address: "서울특별시 강남구 테헤란로 123",
    tel: "02-1234-5678",
    mapLinks: {
      kakao: "",
      naver: ""
    }
  },

  // ── 인사말 ──
  invitation: {
    title: "소중한 분들을 초대합니다",
    message: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n바쁘시더라도 오셔서\n축복해 주시면 감사하겠습니다."
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
      { role: "신랑", name: "홍길동", bank: "OO은행", number: "000-000-000000" },
      { role: "아버지", name: "홍판서", bank: "OO은행", number: "000-000-000000" },
      { role: "어머니", name: "김순이", bank: "OO은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부", name: "김영희", bank: "OO은행", number: "000-000-000000" },
      { role: "아버지", name: "김철수", bank: "OO은행", number: "000-000-000000" },
      { role: "어머니", name: "이미자", bank: "OO은행", number: "000-000-000000" }
    ]
  },

  // ── 공유 설정 ──
  kakaoShare: {
    jsKey: "",
    title: "결혼식에 초대합니다",
    description: ""
  }
};
