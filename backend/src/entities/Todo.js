/**
 * Todo Entity representing the business object
 */
class Todo {
  constructor(id, userId, title, description, dueDate, isCompleted, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.isCompleted = isCompleted || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Business rules for todo
  validate() {
    if (!this.title || typeof this.title !== 'string' || this.title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }
    if (this.title.length > 255) {
      throw new Error('Title must be less than 256 characters');
    }
    if (this.description && typeof this.description !== 'string') {
      throw new Error('Description must be a string');
    }
    if (this.dueDate && !(this.dueDate instanceof Date)) {
      throw new Error('Due date must be a valid date');
    }
    if (typeof this.isCompleted !== 'boolean') {
      throw new Error('IsCompleted must be a boolean');
    }
  }

  setTitle(title) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }
    this.title = title;
    this.updatedAt = new Date();
  }

  setDescription(description) {
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }
    this.description = description || '';
    this.updatedAt = new Date();
  }

  setDueDate(dueDate) {
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      this.dueDate = parsedDate;
    } else {
      this.dueDate = null;
    }
    this.updatedAt = new Date();
  }

  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
    this.updatedAt = new Date();
  }

  belongsToUser(userId) {
    return this.userId === userId;
  }
}

module.exports = Todo;