# Clean Architecture Frontend

이 프론트엔드는 클린 아키텍처 원칙을 따르도록 설계되었습니다. 관심사 분리를 통해 유지보수성과 테스트 용이성을 향상시키고, 프레임워크나 인프라에 의존하지 않는 구조를 유지합니다.

## 아키텍처 계층

### 1. Domain Layer (도메인 계층)
- **위치**: `src/domain/`
- **책임**: 핵심 비즈니스 로직과 엔티티를 포함
- **구성**:
  - `entities/`: 비즈니스 규칙을 포함한 핵심 엔티티 (Todo, User)
  - `repositories/`: 인터페이스 정의 (ITodoRepository, IAuthRepository)

### 2. Application Layer (애플리케이션 계층)
- **위치**: `src/application/`
- **책임**: 애플리케이션의 유스케이스를 구현
- **구성**:
  - `usecases/`: 비즈니스 로직을 조합한 유스케이스 (TodoUseCases, AuthUseCases)
  - `dtos/`: 데이터 전송 객체 정의

### 3. Infrastructure Layer (인프라 계층)
- **위치**: `src/infrastructure/`
- **책임**: 외부 시스템과의 상호작용을 처리
- **구성**:
  - `repositories/`: 인터페이스의 실제 구현 (TodoRepositoryImpl, AuthRepositoryImpl)
  - `services/`: 외부 서비스와의 통신 로직

### 4. Presentation Layer (표현 계층)
- **위치**: `src/pages/`, `src/components/`, `src/hooks/`
- **책임**: 사용자 인터페이스와 상태 관리
- **구성**:
  - `hooks/`: Clean Architecture 계층과의 상호작용을 위한 커스텀 훅
  - `pages/`: UI 페이지 컴포넌트
  - `components/`: 재사용 가능한 UI 컴포넌트

## 의존성 규칙

- 내부 계층은 외부 계층에 대해 알 수 없습니다.
- 외부 계층만 내부 계층에 의존할 수 있습니다.
- 모든 의존성은 내부를 향합니다.

## 주요 특징

1. **엔티티 중심**: 비즈니스 로직은 엔티티에 캡슐화되어 있습니다.
2. **유스케이스**: 애플리케이션의 특정 작업을 수행하는 로직을 포함합니다.
3. **의존성 주입**: `composition-root.ts`에서 모든 의존성을 주입합니다.
4. **테스트 용이성**: 각 계층은 다른 계층으로부터 분리되어 있어 단위 테스트가 용이합니다.

## 사용 예시

```typescript
// TodoList 페이지에서 사용하는 예시
import { useTodos } from '../hooks/useTodos';

const TodoList: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    removeTodo,
    toggleCompletion
  } = useTodos();

  // 컴포넌트 로직
};
```

이 구조를 통해 UI 로직과 비즈니스 로직이 분리되어 유지되며, 향후 기능 확장이나 유지보수가 용이해집니다.