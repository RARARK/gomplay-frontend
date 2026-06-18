# GomPlay (곰플레이)

> 단국대학교 재학생을 위한 개인 맞춤형 운동 파트너 매칭 플랫폼

---

## 1. 프로젝트 소개

**GomPlay**는 운동 지속의 어려움과 파트너 탐색 문제를 해결하기 위해 개발된 단국대학교 학생 전용 운동 파트너 매칭 모바일 애플리케이션입니다.

학교 이메일 인증을 통해 검증된 단국대학교 학생만 이용할 수 있으며, 운동 성향·목적·선호 종목·공강 시간표를 분석하여 최적의 운동 파트너를 추천합니다. 혼자 운동할 때 겪는 동기 부여 부족 문제를 운동 파트너 연결로 해결하고, 운동을 지속할 수 있는 환경을 조성하는 것이 목표입니다.

| 구분 | 내용 |
|------|------|
| 서비스 대상 | 단국대학교 재학생 |
| 플랫폼 | iOS / Android (React Native + Expo) |
| 관리자 페이지 | 웹 (React + Vite) |
| 차별점 | 학교 이메일 인증 기반 신뢰 환경 + 공강 시간표·성향 기반 개인화 매칭 |

---

## 2. 주요 기능

### 🔐 회원 인증

- 단국대학교 이메일 인증 기반 회원가입
- 가입 시 온보딩 설문으로 운동 성향·강도·목적·선호 종목·공강 시간표 수집
- Groq API 기반 AI 운동 성향 분석 리포트 제공

### ⚡ 퀵 매칭 (1:1 실시간 매칭)

- WebSocket(STOMP over SockJS) 기반 실시간 대기열 매칭
- 공강 시간표·운동 성향·매너온도 등 6가지 항목 가중합 추천 알고리즘
- 매칭 완료 시 1:1 채팅방 자동 생성, 양측 완료 확인 후 운동 종료 처리

### 📋 운동 모집글

- 운동 종목·날짜·인원·장소·난이도 지정 모집글 작성
- 사용자 성향·시간표·매너온도 기반 맞춤 추천 알고리즘
- 참여 신청 → 수락/거절 → 정원 충족 시 그룹 채팅방 자동 생성
- 포인트 30P 소모로 모집글 24시간 최상단 부스트 가능

### 💬 실시간 채팅

- 퀵 매칭 기반 1:1 채팅 (TEXT / 완료 처리)
- 모집글 기반 그룹 채팅 (TEXT / NOTICE / SCHEDULE 메시지 타입)
- STOMP over SockJS WebSocket 통신

### 🌡️ 매너온도 & 평가

- 운동 완료 후 파트너 긍정/부정 태그 선택 및 코멘트 작성
- 평가 결과에 따라 매너온도 실시간 반영 (초기값 36.5°C)
- 노쇼 신고 시 포인트 차감 및 누적 5회 시 7일 매칭 제한

### 📍 장소 추천

- 운동 종목 및 현재 위치 기반 Google Places API 주변 시설 조회
- 평점순 / 거리순 정렬 (Haversine 공식 거리 계산)

### 💰 포인트 시스템

- 출석 체크(+1P), 모집글 생성(+2P), 운동 완료(+4P), 평가 제출(+2P) 등 활동별 적립
- 퀵 매칭 신청(-10P), 모집글 부스트(-30P) 소모
- 전체 포인트 내역 조회

### 📅 출석 체크

- 일별 체크인 (하루 1회, +1P 적립)
- 월별 캘린더 뷰 조회

### 🔔 알림

- 매칭 요청·수락·거절, 모집글 참여, 운동 완료, 포인트 적립 등 이벤트별 알림
- 퀵매칭(partner) / 모집글(general) 탭 분류 조회

### 👤 마이페이지

- 프로필 / 비밀번호 / 운동 성향 / 시간표 수정
- 매칭 내역 및 포인트 내역 확인

---

## 3. 화면 캡처

> 📷 스크린샷 첨부 예정

| 홈 | 퀵 매칭 | 모집글 |
|:---:|:---:|:---:|
| - | - | - |

| 채팅 | 매너온도 평가 | 마이페이지 |
|:---:|:---:|:---:|
| - | - | - |

---

## 4. 기술 스택

### Mobile App (`gomplay-frontend`)

| 분류 | 기술 |
|------|------|
| 언어 | TypeScript |
| 프레임워크 | React Native 0.81.5 / React 19 |
| 개발 도구 | Expo SDK 54 |
| 라우팅 | Expo Router (파일 기반 라우팅) |
| 상태 관리 | Zustand 5 |
| HTTP 통신 | Axios (JWT 인터셉터) |
| 실시간 통신 | STOMP over SockJS (WebSocket) |
| 애니메이션 | React Native Reanimated |
| 지도 / 장소 | react-native-maps + Google Places API |
| 캘린더 | react-native-calendars |
| 아이콘 | @expo/vector-icons |

### Admin Dashboard (`gomplay-admin`)

| 분류 | 기술 |
|------|------|
| 언어 | TypeScript |
| 프레임워크 | React 19 |
| 빌드 도구 | Vite |
| 라우팅 | React Router v7 |
| HTTP 통신 | Axios |
| 차트 | Recharts |
| 아이콘 | lucide-react |

---

## 5. 폴더 구조

```text
gomplay-frontend/
├── app/                        # Expo Router 화면 (파일 기반 라우팅)
│   ├── (tabs)/                 # 하단 탭 네비게이션
│   │   ├── index.tsx           # 홈
│   │   ├── match.tsx           # 퀵 매칭 현황
│   │   ├── partner.tsx         # 모집글 탐색
│   │   └── chat.tsx            # 채팅 목록
│   ├── chat/[chatRoomId].tsx   # 1:1 채팅방
│   ├── group-chat/[roomId].tsx # 그룹 채팅방
│   ├── matches/                # 매칭 상세 / 내역
│   ├── posts/                  # 모집글 목록 / 상세 / 작성 / 수정
│   ├── profile/                # 프로필 수정 / 비밀번호 / 성향 / 시간표
│   ├── review/                 # 리뷰 작성 (퀵매칭 / 모집)
│   ├── login.tsx               # 로그인
│   ├── signup*.tsx             # 회원가입 플로우
│   ├── onboarding.tsx          # 온보딩 설문
│   ├── tutorial*.tsx           # 튜토리얼 / AI 성향 분석 / 결과
│   ├── attendance.tsx          # 출석 체크
│   ├── mypage.tsx              # 마이페이지
│   ├── notifications.tsx       # 알림
│   └── point-logs.tsx          # 포인트 내역
│
├── components/                 # 기능별 UI 컴포넌트
│   ├── auth/                   # 로그인 / 회원가입 / 튜토리얼
│   ├── matching/               # 홈 / 모집글 / 매칭 상태 / 토스트
│   ├── chat/                   # 채팅 목록 / 1:1 채팅방 / 그룹 채팅방
│   ├── review/                 # 평가 컴포넌트
│   ├── profile/                # 프로필 컴포넌트
│   ├── attendance/             # 출석 체크
│   ├── notifications/          # 알림
│   └── common/                 # 공통 (시간표 선택기 등)
│
├── services/                   # 도메인별 API 서비스 레이어
│   ├── auth/authService.ts
│   ├── user/userService.ts
│   ├── matching/matchingService.ts
│   ├── gathering/gatheringService.ts
│   ├── chat/chatService.ts
│   ├── review/reviewService.ts
│   ├── point/pointService.ts
│   ├── attendance/attendanceService.ts
│   ├── notification/notificationService.ts
│   └── location/locationService.ts
│
├── stores/                     # Zustand 전역 상태 관리
│   ├── auth/authStore.ts       # 인증 (토큰, 로그인 상태)
│   ├── user/userStore.ts       # 사용자 프로필
│   ├── matching/matchingStore.ts
│   ├── chat/chatStore.ts
│   └── notification/notificationStore.ts
│
├── lib/
│   ├── api/client.ts           # Axios 인스턴스 (JWT 인터셉터)
│   └── ws/                     # WebSocket 클라이언트
│       ├── matchWsClient.ts    # 퀵 매칭 WebSocket
│       └── chatWsClient.ts     # 채팅 WebSocket
│
├── types/                      # TypeScript 타입 정의
│   ├── auth/
│   ├── domain/                 # user, match, gathering, chat, review 등
│   └── ui/
│
├── hooks/                      # 커스텀 React Hooks
├── constants/                  # 색상, 상태값 등 상수
├── utils/                      # 유틸리티 함수
└── assets/                     # 이미지 및 아이콘 리소스

gomplay-admin/
└── src/
    ├── pages/                  # 로그인 / 대시보드 / 신고 관리
    ├── components/             # 레이아웃 / 보호된 라우트
    ├── lib/
    │   └── apiClient.ts
    └── types/
```

---

## 6. 실행 방법

### 사전 준비

- Node.js 설치
- Expo Go 앱 설치 (iOS / Android) 또는 에뮬레이터 환경

### 모바일 앱 실행

```bash
cd gomplay-frontend
npm install
npm run start        # Expo 개발 서버 실행 (QR 코드로 Expo Go 연결)
npm run android      # Android 에뮬레이터 실행
npm run ios          # iOS 시뮬레이터 실행
```

### 관리자 대시보드 실행

```bash
cd gomplay-admin
npm install
npm run dev          # Vite 개발 서버 실행
npm run build        # 프로덕션 빌드
```

---

## 7. 환경 변수

### gomplay-frontend

`app.json` 및 `lib/` 하위 파일에서 아래 항목을 설정합니다.

| 변수명 | 설명 |
|------|------|
| EXPO_PUBLIC_GOOGLE_MAPS_API_KEY | Google Maps / Places API 키 |
| API_BASE_URL | 백엔드 서버 기본 URL |
| WS_BASE_URL | WebSocket 서버 기본 URL |

### gomplay-admin

| 변수명 | 설명 |
|------|------|
| VITE_API_BASE_URL | 백엔드 서버 기본 URL |

---

## 8. 담당 역할

| 이름 | 역할 | 담당 내용 |
|------|------|------|
| 김형수 | Frontend | UI/UX 설계 및 구현 |
| 신동은 | Backend | 로그인/회원가입, 퀵매칭 및 1:1 채팅 구현 |
| 한상윤 | Backend | 추천 알고리즘, 운동 모집 및 그룹 채팅 구현 |

---

## 9. 인수인계 / 유지보수 안내

이 저장소는 GomPlay 프로젝트의 프론트엔드 저장소입니다.  
코드를 이어받거나 로컬에서 다시 실행할 경우 아래 사항을 확인해야 합니다.

### ⚠️ 환경 설정 확인

현재 서버 주소와 외부 API 키는 프론트엔드 실행 환경에 맞게 설정되어야 합니다.  
배포 환경이 바뀌거나 API 키가 만료된 경우 아래 항목을 수정해야 합니다.

| 파일 | 내용 | 비고 |
|------|------|------|
| `lib/api/client.ts` | REST API 서버 기본 URL | 백엔드 서버 주소 변경 시 수정 |
| `lib/ws/matchWsClient.ts` | 퀵 매칭 WebSocket 서버 주소 | 백엔드 WebSocket 주소 변경 시 수정 |
| `lib/ws/chatWsClient.ts` | 채팅 WebSocket 서버 주소 | 백엔드 WebSocket 주소 변경 시 수정 |
| `app.json` | Google Maps API 키 | 지도 및 장소 검색 기능 사용 시 필요 |

> Google Maps API 키는 Google Cloud Console에서 새로 발급하거나 기존 키의 유효 여부를 확인해야 합니다.  
> 키가 만료되면 지도 화면 및 주변 장소 검색 기능이 정상 동작하지 않을 수 있습니다.

### 🔌 프론트엔드 외부 의존성

앱이 정상 동작하려면 아래 서비스가 연결되어 있어야 합니다.

| 서비스 | 프론트엔드에서 사용하는 기능 | 비고 |
|--------|----------------------------|------|
| Spring Boot 백엔드 API | 로그인, 회원가입, 프로필, 매칭, 모집글, 리뷰, 포인트 등 전체 API 통신 | `lib/api/client.ts`의 baseURL 확인 |
| WebSocket 서버 | 퀵 매칭 상태 변경, 실시간 채팅 | `lib/ws/` 하위 클라이언트 확인 |
| Google Maps / Places API | 지도 표시, 주변 운동 시설 검색 | `app.json`의 API 키 확인 |
| 이미지 저장소 URL | 프로필 이미지 및 업로드 이미지 표시 | `lib/utils/imageUrl.ts` 확인 |

### 🏗️ 프론트엔드 통신 구조 요약

```text
React Native App (Expo)
  │
  ├── REST API 통신
  │     └── Axios Client
  │          └── lib/api/client.ts
  │
  ├── WebSocket 통신
  │     ├── Quick Matching WebSocket
  │     │     └── lib/ws/matchWsClient.ts
  │     └── Chat WebSocket
  │           └── lib/ws/chatWsClient.ts
  │
  └── Google Maps / Places API
        └── app.json
```

### 🔐 인증 관련 참고

- 인증 방식은 JWT 기반입니다.
- 로그인 후 발급받은 토큰은 `AsyncStorage`에 저장됩니다.
- 인증 상태는 `stores/auth/authStore.ts`에서 관리합니다.
- Axios 요청 시 토큰 처리는 `lib/api/client.ts`의 인터셉터에서 처리합니다.

### 📦 패키지 버전 주의사항

| 패키지 | 버전 | 주의사항 |
|--------|------|---------|
| Expo SDK | 54 | SDK 업그레이드 시 네이티브 모듈 호환성 확인 필요 |
| React Native | 0.81.5 | Expo SDK 54 기준 버전 |
| React | 19 | React Native 및 Expo 호환성 확인 필요 |
| Zustand | 5 | 상태 관리 방식 변경 시 store 구조 확인 필요 |
| React Native Maps | 사용 중 | Expo / Google Maps 키 설정 확인 필요 |
| React Native Reanimated | 사용 중 | Expo SDK 업그레이드 시 설정 확인 필요 |

### 🗂️ 주요 파일 위치 요약

| 목적 | 파일 경로 |
|------|-----------|
| API 클라이언트 설정 | `lib/api/client.ts` |
| 퀵 매칭 WebSocket 클라이언트 | `lib/ws/matchWsClient.ts` |
| 채팅 WebSocket 클라이언트 | `lib/ws/chatWsClient.ts` |
| 이미지 URL 변환 유틸 | `lib/utils/imageUrl.ts` |
| 인증 상태 관리 | `stores/auth/authStore.ts` |
| 사용자 정보 상태 관리 | `stores/user/userStore.ts` |
| 채팅 상태 관리 | `stores/chat/chatStore.ts` |
| 알림 상태 관리 | `stores/notification/notificationStore.ts` |
| 앱 설정 | `app.json` |





