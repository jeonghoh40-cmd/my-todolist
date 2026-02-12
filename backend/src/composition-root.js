/**
 * Composition Root
 * Wires up all the dependencies for the Clean Architecture
 */

// Entities
const User = require('./entities/User');
const Todo = require('./entities/Todo');

// Interfaces
const UserRepositoryInterface = require('./interfaces/UserRepositoryInterface');
const TodoRepositoryInterface = require('./interfaces/TodoRepositoryInterface');
const PasswordHasherInterface = require('./interfaces/PasswordHasherInterface');
const TokenGeneratorInterface = require('./interfaces/TokenGeneratorInterface');

// Use Cases
const { RegisterUserUseCase, LoginUserUseCase } = require('./usecases/auth.usecase');
const {
  CreateTodoUseCase,
  GetTodosUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoCompletionUseCase
} = require('./usecases/todo.usecase');

// Frameworks and Drivers (Implementations)
const UserRepositoryImpl = require('./frameworks-and-drivers/UserRepositoryImpl');
const TodoRepositoryImpl = require('./frameworks-and-drivers/TodoRepositoryImpl');
const PasswordHasherImpl = require('./frameworks-and-drivers/PasswordHasherImpl');
const TokenGeneratorImpl = require('./frameworks-and-drivers/TokenGeneratorImpl');

// Interface Adapters (Controllers)
const { registerController, loginController } = require('./interface-adapters/controllers/auth.controller');
const {
  getTodosController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  toggleCompleteController
} = require('./interface-adapters/controllers/todo.controller');

// Initialize implementations
const userRepository = new UserRepositoryImpl();
const todoRepository = new TodoRepositoryImpl();
const passwordHasher = new PasswordHasherImpl();
const tokenGenerator = new TokenGeneratorImpl();

// Initialize use cases with dependencies
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator);

const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
const toggleTodoCompletionUseCase = new ToggleTodoCompletionUseCase(todoRepository);

// Export controllers with dependencies already injected
module.exports = {
  // Controllers
  authControllers: {
    registerController,
    loginController
  },
  todoControllers: {
    getTodosController,
    createTodoController,
    updateTodoController,
    deleteTodoController,
    toggleCompleteController
  },
  
  // Use Cases
  useCases: {
    registerUserUseCase,
    loginUserUseCase,
    createTodoUseCase,
    getTodosUseCase,
    updateTodoUseCase,
    deleteTodoUseCase,
    toggleTodoCompletionUseCase
  },
  
  // Repositories
  repositories: {
    userRepository,
    todoRepository
  },
  
  // Utilities
  utilities: {
    passwordHasher,
    tokenGenerator
  }
};