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
    console.log(`[TODO] Get todos - user ID: ${userId}`);

    // Execute use case
    const todos = await getTodosUseCase.execute(userId);
    console.log(`[TODO] Get todos success - user ID: ${userId}, count: ${todos.length}`);

    // Return response
    res.status(200).json(todos);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';
    console.error(`[TODO] Get todos error - Code: ${errorCode}, Message: ${message}`);

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
    console.log(`[TODO] Create todo - user ID: ${userId}, title: ${title}`);

    // Execute use case
    const todo = await createTodoUseCase.execute(userId, { title, description, dueDate });
    console.log(`[TODO] Create todo success - todo ID: ${todo.id}, user ID: ${userId}`);

    // Return response
    res.status(201).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';
    console.error(`[TODO] Create todo error - Code: ${errorCode}, Message: ${message}`);

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
    console.log(`[TODO] Update todo - user ID: ${userId}, todo ID: ${todoId}`);

    // Execute use case
    const todo = await updateTodoUseCase.execute(userId, todoId, { title, description, dueDate });
    console.log(`[TODO] Update todo success - todo ID: ${todoId}, user ID: ${userId}`);

    // Return response
    res.status(200).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';
    console.error(`[TODO] Update todo error - Code: ${errorCode}, Message: ${message}`);

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
    console.log(`[TODO] Delete todo - user ID: ${userId}, todo ID: ${todoId}`);

    // Execute use case
    await deleteTodoUseCase.execute(userId, todoId);
    console.log(`[TODO] Delete todo success - todo ID: ${todoId}, user ID: ${userId}`);

    // Return response
    res.status(204).send(); // No Content
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';
    console.error(`[TODO] Delete todo error - Code: ${errorCode}, Message: ${message}`);

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
    console.log(`[TODO] Toggle complete - user ID: ${userId}, todo ID: ${todoId}`);

    // Execute use case
    const todo = await toggleTodoCompletionUseCase.execute(userId, todoId);
    console.log(`[TODO] Toggle complete success - todo ID: ${todoId}, completed: ${todo.isCompleted}`);

    // Return response
    res.status(200).json(todo);
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';
    console.error(`[TODO] Toggle complete error - Code: ${errorCode}, Message: ${message}`);

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