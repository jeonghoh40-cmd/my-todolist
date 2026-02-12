/**
 * Create Todo Use Case
 * Implements the business logic for creating a todo
 */
class CreateTodoUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(userId, todoData) {
    const { title, description, dueDate } = todoData;

    // Create the todo entity
    const todo = new (require('../entities/Todo'))(null, userId, title, description, dueDate);

    // Validate the todo
    todo.validate();

    // Save the todo
    const createdTodo = await this.todoRepository.createTodo(todo);

    return createdTodo;
  }
}

/**
 * Get Todos Use Case
 * Implements the business logic for retrieving todos
 */
class GetTodosUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(userId) {
    // Get todos for the user
    const todos = await this.todoRepository.findTodosByUserId(userId);

    return todos;
  }
}

/**
 * Update Todo Use Case
 * Implements the business logic for updating a todo
 */
class UpdateTodoUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(userId, todoId, todoData) {
    const { title, description, dueDate } = todoData;

    // Find the existing todo
    const existingTodo = await this.todoRepository.findTodoById(todoId);
    if (!existingTodo) {
      throw { code: 'E-104', message: 'Todo not found', status: 404 };
    }

    // Check ownership
    if (!existingTodo.belongsToUser(userId)) {
      throw { code: 'E-102', message: 'Access denied', status: 403 };
    }

    // Update the todo entity
    if (title) existingTodo.setTitle(title);
    if (description !== undefined) existingTodo.setDescription(description);
    if (dueDate !== undefined) existingTodo.setDueDate(dueDate);

    // Validate the updated todo
    existingTodo.validate();

    // Save the updated todo
    const updatedTodo = await this.todoRepository.updateTodo(existingTodo);

    return updatedTodo;
  }
}

/**
 * Delete Todo Use Case
 * Implements the business logic for deleting a todo
 */
class DeleteTodoUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(userId, todoId) {
    // Find the existing todo
    const existingTodo = await this.todoRepository.findTodoById(todoId);
    if (!existingTodo) {
      throw { code: 'E-104', message: 'Todo not found', status: 404 };
    }

    // Check ownership
    if (!existingTodo.belongsToUser(userId)) {
      throw { code: 'E-102', message: 'Access denied', status: 403 };
    }

    // Delete the todo
    const result = await this.todoRepository.deleteTodo(todoId);

    return result;
  }
}

/**
 * Toggle Todo Completion Use Case
 * Implements the business logic for toggling a todo's completion status
 */
class ToggleTodoCompletionUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(userId, todoId) {
    // Find the existing todo
    const existingTodo = await this.todoRepository.findTodoById(todoId);
    if (!existingTodo) {
      throw { code: 'E-104', message: 'Todo not found', status: 404 };
    }

    // Check ownership
    if (!existingTodo.belongsToUser(userId)) {
      throw { code: 'E-102', message: 'Access denied', status: 403 };
    }

    // Toggle completion status
    existingTodo.toggleCompletion();

    // Save the updated todo
    const updatedTodo = await this.todoRepository.updateTodo(existingTodo);

    return updatedTodo;
  }
}

module.exports = {
  CreateTodoUseCase,
  GetTodosUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoCompletionUseCase
};