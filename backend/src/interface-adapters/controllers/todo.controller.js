const {
  CreateTodoUseCase,
  GetTodosUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoCompletionUseCase
} = require('../../usecases/todo.usecase');
const TodoRepositoryImpl = require('../../frameworks-and-drivers/TodoRepositoryImpl');

// Initialize dependencies
const todoRepository = new TodoRepositoryImpl();

// Initialize use cases
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
const toggleTodoCompletionUseCase = new ToggleTodoCompletionUseCase(todoRepository);

/**
 * Get Todos Controller - Interface Adapter for getting todos
 */
const getTodosController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication middleware

    // Execute use case
    const todos = await getTodosUseCase.execute(userId);

    // Return response
    res.status(200).json(todos);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

/**
 * Create Todo Controller - Interface Adapter for creating a todo
 */
const createTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication middleware
    const { title, description, dueDate } = req.body;

    // Execute use case
    const todo = await createTodoUseCase.execute(userId, { title, description, dueDate });

    // Return response
    res.status(201).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

/**
 * Update Todo Controller - Interface Adapter for updating a todo
 */
const updateTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication middleware
    const todoId = parseInt(req.params.id, 10);
    const { title, description, dueDate } = req.body;

    // Execute use case
    const todo = await updateTodoUseCase.execute(userId, todoId, { title, description, dueDate });

    // Return response
    res.status(200).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

/**
 * Delete Todo Controller - Interface Adapter for deleting a todo
 */
const deleteTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication middleware
    const todoId = parseInt(req.params.id, 10);

    // Execute use case
    await deleteTodoUseCase.execute(userId, todoId);

    // Return response
    res.status(204).send(); // No Content
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

/**
 * Toggle Todo Completion Controller - Interface Adapter for toggling completion
 */
const toggleCompleteController = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication middleware
    const todoId = parseInt(req.params.id, 10);

    // Execute use case
    const todo = await toggleTodoCompletionUseCase.execute(userId, todoId);

    // Return response
    res.status(200).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

module.exports = {
  getTodosController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  toggleCompleteController
};