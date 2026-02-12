# 스타일 가이드 - my-todolist

## 문서 정보
- **프로젝트명**: my-todolist
- **버전**: 1.0.0 (MVP)
- **작성일**: 2026-02-12
- **관련 문서**: [와이어프레임](./8-wireframe.md), [PRD](./2-prd.md)

---

## 1. 컴포넌트 라이브러리

### 1.1 재사용 가능한 UI 컴포넌트

#### Button (버튼)

**Variants**:
- Primary: 파란색 배경 (#007bff), 흰색 텍스트
- Secondary: 회색 배경 (#6c757d), 흰색 텍스트
- Danger: 빨간색 배경 (#dc3545), 흰색 텍스트
- Ghost: 투명 배경, 파란색 텍스트, 테두리

**Sizes**:
- Small: 높이 36px, 패딩 8px 16px
- Medium: 높이 48px, 패딩 12px 24px
- Large: 높이 56px, 패딩 16px 32px

**States**:
- Default: 기본 상태
- Hover: 배경색 10% 어둡게
- Active: 배경색 20% 어둡게
- Disabled: 투명도 50%, 커서 not-allowed

**예시**:
```
[Primary Button]    [Secondary Button]    [Danger Button]
```

---

#### Input (입력 필드)

**Types**:
- Text: 단일 라인 텍스트
- Password: 마스킹 처리
- Email: 이메일 형식 검증
- Date: 날짜 선택

**States**:
- Default: 회색 테두리 (#ced4da)
- Focus: 파란색 테두리 (#007bff), 그림자
- Error: 빨간색 테두리 (#dc3545)
- Disabled: 회색 배경, 커서 not-allowed

**Height**:
- Desktop: 48px
- Mobile: 52px

**예시**:
```
Username
┌────────────────────────┐
│ [username_input]       │
└────────────────────────┘

Password (에러 상태)
┌────────────────────────┐ (빨간색 테두리)
│ [************]         │
└────────────────────────┘
"할일 제목은 필수 항목입니다" (빨간색 텍스트)
```

---

#### Textarea (멀티라인 입력)

**Properties**:
- 높이: 120px (최소), 자동 확장 가능
- 리사이즈: 세로 방향만 허용
- 최대 글자: 1000자 (선택)

**예시**:
```
설명
┌────────────────────────┐
│                        │
│                        │
│                        │
│                        │
└────────────────────────┘
```

---

#### Checkbox (체크박스)

**States**:
- Unchecked: 빈 사각형
- Checked: 파란색 배경, 흰색 체크 아이콘
- Hover: 테두리 두껍게

**Size**: 24x24px (Desktop), 28x28px (Mobile)

**Animation**: 체크 시 0.2초 스케일 애니메이션

**예시**:
```
[ ]  Unchecked
[✓]  Checked
```

---

#### Card (카드)

**Properties**:
- 배경: 흰색
- 테두리: 1px solid #e9ecef
- Border-radius: 8px
- 그림자: 0 2px 4px rgba(0,0,0,0.1)
- 패딩: 20px

**Hover State**: 그림자 증가, 약간 위로 이동 (-2px)

**Completed State** (완료된 할일):
- 배경: #f8f9fa (연한 회색)
- 제목: 취소선
- 투명도: 80%

**예시**:
```
┌──────────────────────┐
│ [ ] 할일 제목        │
│                      │
│ 할일 설명...         │
│                      │
│ 마감일: 2026-02-15  │
│                      │
│ [수정] [삭제]       │
└──────────────────────┘
```

---

#### Modal (모달)

**Components**:
- Overlay: 반투명 검정 배경 (#00000080)
- Container: 중앙 배치, 흰색 배경, border-radius: 12px
- Header: 높이 56px, Primary 색상 또는 흰색
- Body: 패딩 24px
- Footer: 버튼 영역, 우측 정렬

**Animation**:
- 열림: 페이드인 (0.3초) + 스케일 (0.9 → 1.0)
- 닫힘: 페이드아웃 (0.2초)

**Desktop Size**: 500px x 480px
**Mobile Size**: 전체 화면 또는 하단 슬라이드

---

#### Alert / Toast (알림)

**Types**:
- Success: 녹색 배경 (#28a745), 흰색 텍스트
- Error: 빨간색 배경 (#dc3545), 흰색 텍스트
- Warning: 노란색 배경 (#ffc107), 검정 텍스트
- Info: 파란색 배경 (#17a2b8), 흰색 텍스트

**Position**:
- 화면 상단 중앙
- 고정 위치 (sticky/fixed)

**Duration**: 2-3초 자동 사라짐

**Animation**: 하단에서 슬라이드 다운

**예시**:
```
┌─────────────────────────────────────┐
│  ✓  회원가입 성공!                  │ (녹색)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ✗  아이디 또는 비밀번호가 일치하지  │ (빨간색)
│     않습니다                        │
└─────────────────────────────────────┘
```

---

#### DatePicker (날짜 선택기)

**Components**:
- Input: 날짜 텍스트 필드, 달력 아이콘
- Calendar Popup: 월 단위 달력 표시

**Features**:
- 오늘 날짜 강조 (파란색 테두리)
- 선택된 날짜 배경 (파란색)
- 이전/다음 월 이동 버튼
- 년/월 선택 드롭다운

**Format**: YYYY-MM-DD (예: 2026-02-15)

**예시**:
```
마감일
┌────────────────────────┐
│ 2026-02-15    [달력]  │
└────────────────────────┘

달력 팝업:
┌───────────────────────┐
│   <  2026년 2월  >    │
├───┬───┬───┬───┬───┬───┤
│일 │월 │화 │수 │목 │금 │
├───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │ 7 │
│ 8 │ 9 │10 │11 │12 │13 │
│14 │15 │16 │17 │18 │19 │
│   │   │   │   │   │   │
└───────────────────────┘
```

---

### 1.2 컴포넌트 사용 매트릭스

| 화면 | 컴포넌트 |
|------|----------|
| 회원가입 | Input (Text, Password, Email), Button (Primary, Ghost), Alert |
| 로그인 | Input (Text, Password), Button (Primary, Ghost), Alert |
| 할일 목록 | Card, Checkbox, Button (Primary, Secondary, Danger), Alert |
| 할일 추가/수정 | Modal, Input (Text), Textarea, DatePicker, Button (Primary, Secondary) |
| 삭제 확인 | Modal (AlertDialog), Button (Secondary, Danger) |

---

## 2. 색상 및 타이포그래피

### 2.1 색상 팔레트 (Google Calendar 스타일)

#### Primary Colors (주요 색상)

```
Primary Blue (기본 버튼, 링크, 오늘 날짜 강조)
#1a73e8 (Google Blue)
████████

Primary Blue Hover
#1765cc
████████

Primary Blue Active
#1557b0
████████

Primary Blue Light (선택 배경, 포커스)
#e8f0fe
████████
```

#### Status Colors (상태 색상)

```
Success Green (성공 메시지, 완료 상태, 설날/연휴)
#188038 (Google Green)
████████

Success Green Light (완료된 할일 배경)
#e6f4ea
████████

Danger Red (삭제 버튼, 에러 메시지)
#d93025 (Google Red)
████████

Danger Red Light (에러 배경)
#fce8e6
████████

Warning Orange (경고 메시지, 마감 임박)
#f9ab00 (Google Yellow)
████████

Warning Orange Light (경고 배경)
#fef7e0
████████

Event Purple (이벤트, 보조 강조)
#7986cb (Material Indigo)
████████

Event Purple Light (이벤트 배경)
#e8eaf6
████████
```

#### Neutral Colors (중립 색상)

```
Background White (페이지 배경, 카드 배경)
#ffffff
████████

Background Gray (사이드바, 비활성 영역)
#f1f3f4
████████

Surface (카드 배경, Elevated)
#ffffff
████████

Border Light (구분선, 카드 테두리)
#dadce0
████████

Border Gray (입력 필드 테두리)
#80868b
████████

Text Primary (제목, 본문 텍스트)
#202124 (거의 검정)
████████

Text Secondary (설명, 부가 정보)
#5f6368 (회색)
████████

Text Disabled (비활성 텍스트)
#9aa0a6
████████

Overlay Dark (모달 오버레이)
#00000052 (32% opacity)
████████
```

### 2.2 타이포그래피 (Google Material Design 기반)

#### 폰트 패밀리

**Primary Font**:
```
font-family: 'Noto Sans KR', 'Google Sans', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Fallback**:
- 한글: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic'
- 영문: 'Google Sans', 'Roboto', 'Segoe UI', sans-serif
- 시스템: -apple-system, BlinkMacSystemFont

#### 폰트 크기 스케일 (Material Design Type Scale)

| 용도 | Desktop | Mobile | Weight | Line Height | Letter Spacing |
|------|---------|--------|--------|-------------|----------------|
| H1 (페이지 제목) | 32px | 28px | 500 (Medium) | 40px (1.25) | -0.5px |
| H2 (섹션 제목) | 24px | 22px | 500 (Medium) | 32px (1.33) | 0px |
| H3 (카드 제목) | 18px | 17px | 500 (Medium) | 28px (1.55) | 0px |
| Body (본문) | 16px | 15px | 400 (Regular) | 24px (1.5) | 0.15px |
| Body Small (설명) | 14px | 13px | 400 (Regular) | 20px (1.43) | 0.25px |
| Caption (부가 정보) | 12px | 12px | 400 (Regular) | 16px (1.33) | 0.4px |

#### 폰트 적용 예시

```
페이지 제목: "나의 할일 목록"
- Desktop: 32px, Bold (700), #212529
- Mobile: 28px, Bold (700), #212529

할일 카드 제목: "자료구조 과제 - 트리 구현"
- Desktop: 18px, SemiBold (600), #212529
- Mobile: 17px, SemiBold (600), #212529

할일 설명: "이진 탐색 트리 insert, delete 함수 구현하기"
- Desktop: 16px, Regular (400), #6c757d
- Mobile: 15px, Regular (400), #6c757d

마감일: "마감일: 2026-02-15"
- Desktop: 14px, Regular (400), #6c757d
- Mobile: 13px, Regular (400), #6c757d
```

### 2.3 그림자 (Shadows)

```
Card Shadow (카드, 버튼):
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

Card Hover Shadow:
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

Modal Shadow:
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

Input Focus Shadow:
box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
```

### 2.4 Border Radius (모서리 곡률)

```
Small (버튼, 입력 필드):
border-radius: 4px;

Medium (카드):
border-radius: 8px;

Large (모달):
border-radius: 12px;

Circle (체크박스, 아바타):
border-radius: 50%;
```

---

## 3. 반응형 브레이크포인트

### 3.1 브레이크포인트 정의

| 이름 | 최소 너비 | 최대 너비 | 타겟 디바이스 |
|------|-----------|-----------|---------------|
| Mobile Small | 320px | 374px | iPhone SE, 소형 안드로이드 |
| Mobile | 375px | 767px | iPhone 13, Galaxy S22 |
| Tablet | 768px | 1023px | iPad, 소형 태블릿 |
| Desktop | 1024px | 1439px | 노트북, 데스크톱 |
| Desktop Large | 1440px+ | - | 대형 모니터 |

### 3.2 레이아웃 조정 규칙

#### Mobile (375px ~ 767px)

**특징**:
- 세로 스택 레이아웃 (1열)
- 터치 타겟 최소 44x44px
- 좌우 패딩 16px
- 모달 전체 화면 또는 하단 슬라이드

**할일 목록**:
- 카드 간격: 16px
- 카드 너비: 100% (패딩 제외)

**예시 CSS**:
```css
@media (max-width: 767px) {
  .container {
    padding: 0 16px;
  }

  .todo-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .input {
    height: 52px;
    font-size: 16px; /* iOS zoom 방지 */
  }

  .button {
    height: 56px;
    font-size: 17px;
  }

  .modal {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}
```

---

#### Tablet (768px ~ 1023px)

**특징**:
- 2열 그리드 레이아웃
- 좌우 패딩 24px
- 모달 중앙 배치 (70% 너비)

**할일 목록**:
- 카드 2열, 간격 20px

**예시 CSS**:
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
  }

  .todo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .modal {
    width: 70vw;
    max-width: 600px;
  }
}
```

---

#### Desktop (1024px+)

**특징**:
- 2-3열 그리드 레이아웃
- 좌우 패딩 32px 또는 max-width 제한
- 모달 중앙 배치 (고정 크기)

**할일 목록**:
- 카드 2열 (1024px ~ 1280px)
- 카드 3열 (1280px+)
- 간격 24px

**예시 CSS**:
```css
@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .todo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .input {
    height: 48px;
  }

  .button {
    height: 52px;
  }

  .modal {
    width: 500px;
    height: 480px;
  }
}

@media (min-width: 1280px) {
  .todo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### 3.3 반응형 이미지 및 아이콘

**아이콘 크기**:
- Mobile: 24px
- Desktop: 20px

**로고/제목 크기**:
- Mobile: 24px
- Desktop: 28px

**체크박스**:
- Mobile: 28x28px
- Desktop: 24x24px

---

### 3.4 모바일 UX 최적화

#### 터치 타겟 크기

**최소 크기**: 44x44px (Apple HIG 권장)

**적용 대상**:
- 버튼
- 링크
- 체크박스
- 아이콘 버튼
- DatePicker 달력 아이콘

#### 키보드 대응

**iOS Safari**:
- 입력 필드 font-size 최소 16px (자동 줌 방지)
- 키보드 올라올 때 화면 스크롤
- fixed 헤더는 키보드 올라올 때 숨김 (선택)

**Android Chrome**:
- 키보드 올라올 때 viewport resize
- 입력 필드 자동 스크롤

#### 스와이프 제스처 (선택적 기능)

**할일 카드**:
- 오른쪽 스와이프 → 완료 처리 (체크)
- 왼쪽 스와이프 → 삭제 옵션 표시

**구현 예시**:
```
스와이프 전:
┌──────────────────────┐
│ [ ] 할일 제목        │
│     할일 설명...     │
└──────────────────────┘

왼쪽 스와이프:
┌───────────────┬──────┐
│ [ ] 할일 제목 │ [삭제]│
│     할일 설명...│      │
└───────────────┴──────┘

오른쪽 스와이프:
┌──────┬───────────────┐
│[완료]│ [ ] 할일 제목 │
│      │     할일 설명...│
└──────┴───────────────┘
```

---

## 4. 인터랙션 상세 정의

### 4.1 애니메이션 타이밍

| 인터랙션 | 애니메이션 | Duration | Easing |
|----------|------------|----------|--------|
| 버튼 호버 | 배경색 변경 | 0.2s | ease |
| 카드 호버 | 그림자 증가, 위로 이동 | 0.3s | ease-out |
| 체크박스 체크 | 스케일 + 체크 아이콘 | 0.2s | ease-in-out |
| 모달 열기 | 페이드인 + 스케일 | 0.3s | ease-out |
| 모달 닫기 | 페이드아웃 | 0.2s | ease-in |
| 할일 추가 | 페이드인 + 슬라이드 다운 | 0.4s | ease-out |
| 할일 삭제 | 페이드아웃 + 슬라이드 업 | 0.5s | ease-in |
| 알림 표시 | 슬라이드 다운 | 0.3s | ease-out |
| 알림 사라짐 | 페이드아웃 | 0.2s | ease-in |

### 4.2 로딩 상태

**로딩 스피너**:
```
┌──────────────────────┐
│                      │
│        [ ⟳ ]         │
│      로딩 중...      │
│                      │
└──────────────────────┘

스피너 스타일:
- 크기: 32px
- 색상: Primary Blue (#007bff)
- 애니메이션: 회전 (1초)
- 위치: 중앙 정렬
```

**버튼 로딩 상태**:
```
기본 버튼:
┌──────────────┐
│  [로그인]    │
└──────────────┘

로딩 중:
┌──────────────┐
│  [ ⟳ ] ...   │  (비활성화, 투명도 70%)
└──────────────┘
```

**적용 시점**:
- 회원가입 API 호출 중
- 로그인 API 호출 중
- 할일 추가/수정/삭제 API 호출 중
- 할일 목록 로드 중

### 4.3 에러 표시

**인라인 에러** (입력 필드 아래):
```
Username
┌────────────────────┐ (빨간색 테두리)
│ [existing_user]    │
└────────────────────┘
"이미 존재하는 사용자명입니다" (빨간색 텍스트, 14px)
```

**알림 배너** (화면 상단):
```
┌─────────────────────────────────────┐
│  ✗  아이디 또는 비밀번호가 일치하지  │
│     않습니다                        │
└─────────────────────────────────────┘

스타일:
- 배경: Danger Red (#dc3545)
- 텍스트: 흰색
- 높이: 56px
- 위치: 화면 상단 고정
- 자동 사라짐: 3초
```

### 4.4 포커스 관리

**포커스 순서** (Tab 키 네비게이션):

**회원가입 화면**:
1. Username 입력
2. Password 입력
3. Email 입력
4. 회원가입 버튼
5. 로그인 링크

**로그인 화면**:
1. Username 입력
2. Password 입력
3. 로그인 버튼
4. 회원가입 링크

**할일 목록**:
1. 로그아웃 버튼
2. [+] 할일 추가 버튼
3. 첫 번째 할일 체크박스
4. 첫 번째 할일 수정 버튼
5. 첫 번째 할일 삭제 버튼
6. (반복)

**모달**:
1. 제목 입력 (자동 포커스)
2. 설명 입력
3. 마감일 입력
4. 저장 버튼
5. 취소 버튼

**포커스 스타일**:
```css
:focus {
  outline: 3px solid rgba(0, 123, 255, 0.5);
  outline-offset: 2px;
}

input:focus, textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
```

### 4.5 접근성 (Accessibility)

**시맨틱 HTML**:
- `<header>`, `<main>`, `<footer>` 사용
- `<button>` vs `<a>` 명확히 구분
- `<label>` 모든 입력 필드에 연결

**ARIA 속성**:
```html
<!-- 모달 -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">할일 추가</h2>
  ...
</div>

<!-- 삭제 확인 다이얼로그 -->
<div role="alertdialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">정말 삭제하시겠습니까?</h2>
  ...
</div>

<!-- 에러 메시지 -->
<div role="alert" aria-live="assertive">
  아이디 또는 비밀번호가 일치하지 않습니다
</div>

<!-- 로딩 스피너 -->
<div role="status" aria-live="polite">
  로딩 중...
</div>
```

**키보드 네비게이션**:
- Tab: 다음 요소
- Shift + Tab: 이전 요소
- Enter: 버튼 클릭, 폼 제출
- Esc: 모달 닫기
- Space: 체크박스 토글

**스크린리더 지원**:
- 모든 이미지/아이콘에 alt 또는 aria-label
- 버튼에 명확한 텍스트 또는 aria-label
- 에러 메시지 aria-live로 즉시 전달

---

## 5. 디자인 시스템 요약

### 5.1 디자인 원칙

1. **심플함 우선**: 복잡한 애니메이션/그래픽 지양, 명확한 레이아웃
2. **직관적 아이콘**: 체크박스 (완료), 연필 (수정), 휴지통 (삭제), 플러스 (추가)
3. **일관된 색상**: 3-4색 팔레트로 제한 (Blue, Gray, Green, Red)
4. **명확한 피드백**: 로딩, 성공, 에러 상태 시각적 표시
5. **접근성**: 시맨틱 HTML, 키보드 네비게이션, 스크린리더 지원

### 5.2 핵심 컴포넌트 스택

**필수 컴포넌트**:
- Button (Primary, Secondary, Danger)
- Input (Text, Password, Email)
- Textarea
- Checkbox
- Card
- Modal
- Alert/Toast
- DatePicker

**선택 컴포넌트**:
- Spinner (로딩)
- Badge (마감일 임박 알림 - 향후)
- Dropdown (정렬 옵션 - 향후)

---

## 6. 구현 가이드

### 6.1 CSS 프레임워크 선택 (선택사항)

**Option 1: Tailwind CSS** (추천)
- 빠른 스타일링
- 유틸리티 클래스로 일관성 유지
- 반응형 쉽게 구현 (sm:, md:, lg:)

**Option 2: CSS Modules**
- 컴포넌트별 스타일 격리
- TypeScript 지원

**Option 3: Vanilla CSS**
- 외부 의존성 없음
- 3일 개발에는 비효율적

### 6.2 상태 관리

**간단한 Context API** (MVP 충분):
```typescript
// AuthContext.tsx
const AuthContext = createContext({
  user: null,
  login: (token: string) => {},
  logout: () => {},
});

// TodoContext.tsx
const TodoContext = createContext({
  todos: [],
  addTodo: (todo: Todo) => {},
  updateTodo: (id: number, todo: Todo) => {},
  deleteTodo: (id: number) => {},
  toggleTodo: (id: number) => {},
});
```

---

## 7. 아이콘 및 리소스

### 7.1 아이콘 사용

**추천 아이콘 라이브러리**:
- **React Icons** (react-icons) - 추천
- Font Awesome
- Material Icons

**필요 아이콘**:
- `FaPlus` (할일 추가)
- `FaEdit` (수정)
- `FaTrash` (삭제)
- `FaCheck` (체크박스 체크)
- `FaCalendar` (달력)
- `FaTimes` (모달 닫기)
- `FaSpinner` (로딩)
- `FaCheckCircle` (성공)
- `FaExclamationCircle` (에러)

---

## 8. 관련 문서

- [와이어프레임](./8-wireframe.md): 화면 레이아웃 및 플로우
- [PRD](./2-prd.md): 기능 요구사항, UI/UX 섹션
- [사용자 시나리오](./3-user-scenario.md): 페르소나별 사용 흐름
- [도메인 정의서](./1-domain-definition.md): 비즈니스 규칙, 에러 코드

---

## 문서 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-02-12 | UI Designer | 와이어프레임 문서에서 스타일 가이드 분리 |

---

**본 스타일 가이드는 my-todolist MVP 개발을 위한 디자인 시스템 문서입니다.**
**프론트엔드 개발 시 직접 참조하여 일관된 UI를 구현하세요.**
