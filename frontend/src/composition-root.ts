import { TodoRepositoryImpl } from './infrastructure/repositories/TodoRepositoryImpl';
import { AuthRepositoryImpl } from './infrastructure/repositories/AuthRepositoryImpl';
import { 
  GetTodosUseCase, 
  CreateTodoUseCase, 
  UpdateTodoUseCase, 
  DeleteTodoUseCase, 
  ToggleTodoCompletionUseCase 
} from './application/usecases/TodoUseCases';
import { RegisterUseCase, LoginUseCase } from './application/usecases/AuthUseCases';

// Create repository instances
const todoRepository = new TodoRepositoryImpl();
const authRepository = new AuthRepositoryImpl();

// Create use case instances
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
const toggleTodoCompletionUseCase = new ToggleTodoCompletionUseCase(todoRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const loginUseCase = new LoginUseCase(authRepository);

// Export all use cases
export {
  // Todo Use Cases
  getTodosUseCase,
  createTodoUseCase,
  updateTodoUseCase,
  deleteTodoUseCase,
  toggleTodoCompletionUseCase,
  
  // Auth Use Cases
  registerUseCase,
  loginUseCase
};

// Export repository instances if needed elsewhere
export {
  todoRepository,
  authRepository
};