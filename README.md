# 곰플레이 (GomPlay)

개인 맞춤형 운동 파트너 매칭 플랫폼 — 단국대학교 학생을 대상으로, 운동 성향·목적·선호
종목·공강 시간대를 기반으로 운동 파트너를 추천하고 연결하는 서비스입니다.

이 저장소는 GomPlay의 **모바일 클라이언트(`gomplay-frontend`)** 와 **관리자
백오피스(`gomplay-admin`)** 두 개의 프론트엔드 애플리케이션을 포함하는 모노레포입니다.
백엔드(Spring Boot)는 별도 저장소에서 관리됩니다.

## 핵심 기능

- **학교 이메일 인증 회원가입**: 단국대학교 이메일 인증을 통해 검증된 사용자만 가입 가능
- **온보딩 설문 / 시간표 입력**: 운동 성향(파트너 스타일·강도·목적)·선호 종목·시간표 수집,
  Groq API 기반 LLM 운동 성향 레포트 제공
- **퀵 매치**: 공강 시간대를 활용해 실시간으로 운동 파트너를 매칭 (WebSocket 대기열)
- **운동 모집(Gathering)**: 모집글 작성·신청·수락/거절, 정원 충족 시 그룹 채팅방 자동 생성,
  포인트를 소모하는 모집글 부스트(상단 노출)
- **추천 알고리즘**: 시간표 공강 일치·선호 종목·성향·매너온도·학과·학번을 가중합산하는
  퀵매칭 추천, 종목·일정·난이도·매너온도·마감 임박도 등 7요소 기반 모집글 추천
- **실시간 채팅**: STOMP over SockJS 기반 1:1 채팅(퀵매칭) 및 그룹 채팅(모집글), 공지·일정
  메시지 타입 지원
- **매칭 완료 / 참여자 평가**: 양측 확인 기반 운동 완료 처리, 긍정·부정 태그 평가, 노쇼
  신고 및 매너온도 반영
- **포인트 & 출석 체크**: 활동 기반 포인트 적립/소모, 일별 출석 체크 및 월별 캘린더
- **주변 장소 추천**: 현재 위치·운동 종목 기반 Google Places 연동, 평점/거리순 정렬
- **관리자 백오피스**: 신고 내역 관리, 서비스 현황 대시보드(차트)

## 모노레포 구조

```
gomplay-frontend-main/
├─ gomplay-frontend/   # React Native(Expo) 모바일 앱 — 실제 서비스 클라이언트
└─ gomplay-admin/      # React + Vite 관리자 웹 (대시보드 / 신고 관리)
```

## 기술 스택

### gomplay-frontend (모바일)

| 영역            | 기술                                                         |
| --------------- | ------------------------------------------------------------ |
| 언어/프레임워크 | TypeScript, React Native (Expo SDK 54), React 19             |
| 라우팅          | Expo Router (파일 기반 라우팅)                               |
| 상태 관리       | Zustand                                                      |
| 네트워킹        | Axios (REST), `@stomp/stompjs` + `sockjs-client` (WebSocket) |
| 지도            | `react-native-maps`, Google Maps API                         |
| 기타            | React Native Reanimated, React Native Calendars              |

### gomplay-admin (관리자 웹)

| 영역            | 기술                       |
| --------------- | -------------------------- |
| 언어/프레임워크 | TypeScript, React 19, Vite |
| 라우팅          | React Router DOM           |
| 차트            | Recharts                   |
| 네트워킹        | Axios                      |

### 백엔드 (별도 저장소)

Spring Boot 4.0.5(Java 21) · MySQL(AWS RDS) · WebSocket/STOMP · AWS S3(프로필 이미지) ·
Docker Compose + AWS EC2 · GitHub Actions CI/CD · Groq API(LLM 레포트) · Google Places API

## 폴더 구조 (gomplay-frontend)

```
app/                      # Expo Router 화면 (탭, 채팅, 모집글, 매칭, 마이페이지 등)
components/               # 화면별 UI 컴포넌트 (auth, chat, matching, attendance ...)
services/                 # 도메인별 API 호출 함수 (auth, gathering, chat, review, point ...)
stores/                   # Zustand 전역 상태 (auth, chat, matching, survey, user ...)
lib/
 ├─ api/client.ts          # Axios 인스턴스 (JWT 인터셉터, 에러 핸들링)
 └─ ws/                    # STOMP/SockJS 클라이언트 (1:1 채팅, 그룹 채팅, 매칭)
types/                    # 도메인/UI 타입 정의
utils/                    # 화면 로직 헬퍼 (모집글 검증, 시간표 변환 등)
```

## 시작하기

### 사전 요구 사항

- Node.js, npm
- Expo Go 앱(모바일 테스트) 또는 Android/iOS 에뮬레이터

### gomplay-frontend (모바일 앱) 실행

```bash
cd gomplay-frontend
npm install
npm run start        # Expo 개발 서버 실행 (QR 코드로 Expo Go 접속)
npm run android       # Android 에뮬레이터/기기 실행
npm run ios           # iOS 시뮬레이터 실행
npm run web           # 웹 프리뷰 실행
```

> API 서버 주소는 `lib/api/client.ts`와 `lib/ws/*WsClient.ts`에 하드코딩되어 있습니다.
> 다른 백엔드 환경을 사용하려면 해당 파일의 `baseURL` / WebSocket 접속 주소를 변경하세요.

### gomplay-admin (관리자 웹) 실행

```bash
cd gomplay-admin
npm install
npm run dev           # 개발 서버 (Vite)
npm run build          # 프로덕션 빌드
```

## 참고

본 README는 캡스톤 최종 보고서(곰플레이 GomPlay)의 시스템 구조·기능 설명을 바탕으로,
현재 저장소에 포함된 프론트엔드/관리자 웹 코드 기준으로 작성되었습니다. 추천 알고리즘
세부 수식, API 명세, 데이터 모델 등 백엔드 구현 상세는 보고서 III장(핵심 기능 및 시스템
구현)을 참고하세요.
