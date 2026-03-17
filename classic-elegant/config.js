/**
 * Wedding Invitation Configuration
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
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "상희범",
    nameEn: "Groom",
    father: "상문규",
    mother: "최향규",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "최민지",
    nameEn: "Bride",
    father: "최영복",
    mother: "정선미",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-05-17",
    time: "13:00",
    venue: "빌라드아모르 이천",
    hall: "르 블랑 포레",
    address: "경기도 이천시 이섭대천로 921",
    tel: "031-638-5222",
    mapLinks: {
      kakao: "https://map.kakao.com/?from=roughmap&eName=%EA%B2%BD%EA%B8%B0%20%EC%9D%B4%EC%B2%9C%EC%8B%9C%20%EC%9D%B4%EC%84%AD%EB%8C%80%EC%B2%9C%EB%A1%9C%20921&eX=598155.0&eY=1042993.0",
      naver: "https://map.naver.com/"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 날, 소중한 분들과\n함께 하고 싶습니다",
    content: "두 사람이 만든 인연이\n하나의 매듭으로 새로운 길이 되어\n하나뿐인 보금자리를 이루려 합니다.\n그동안 변함없는 마음으로 아껴주신\n마음 그대로 기쁨 가득한 날 오셔서\n축복해 주시면 감사하겠습니다."
  },


  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "상희범", bank: "농협은행", number: "3560877118553" },
      { role: "아버지", name: "상문규", bank: "국민은행", number: "230210685848" },
      { role: "어머니", name: "최향규", bank: "농협은행", number: "18312195965" }
    ],
    bride: [
      { role: "신부", name: "최민지", bank: "하나은행", number: "49491056161107" },
      { role: "아버지", name: "최영복", bank: "국민은행", number: "55400201421679" },
      { role: "어머니", name: "정선미", bank: "하나은행", number: "42191024408507" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "희범 ♥ 민지 결혼합니다",
    description: "2026년 5월 17일, 소중한 분들을 초대합니다."
  }
};
